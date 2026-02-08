import { useEffect, useState } from 'react';
import './Dostawcy.css';

function Dostawcy() {
    const [dostawcy, setDostawcy] = useState([]);
    const [dostawcaForm, setDostawcaForm] = useState({ nazwa: "", nip: "", miasto: "" });
    const [edytowanyDostawcaId, setEdytowanyDostawcaId] = useState(null);

    // NOWOŚĆ: Stan dla wyszukiwarki
    const [szukanaFraza, setSzukanaFraza] = useState("");

    useEffect(() => {
        pobierzDostawcow();
    }, []);

    // ZMODYFIKOWANA funkcja pobierania
    const pobierzDostawcow = async (fraza = "") => {
        const url = fraza
            ? `http://localhost:8080/api/dostawcy?szukaj=${fraza}`
            : `http://localhost:8080/api/dostawcy`;

        const res = await fetch(url);
        const data = await res.json();
        setDostawcy(data);
    };

    // Obsługa wpisywania w pole szukania
    const handleSzukaj = (e) => {
        const tekst = e.target.value;
        setSzukanaFraza(tekst);
        pobierzDostawcow(tekst);
    };

    const handleZapiszDostawce = async (e) => {
        e.preventDefault();
        const url = edytowanyDostawcaId ? `http://localhost:8080/api/dostawcy/${edytowanyDostawcaId}` : 'http://localhost:8080/api/dostawcy';
        const method = edytowanyDostawcaId ? 'PUT' : 'POST';

        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dostawcaForm)
        });

        setDostawcaForm({ nazwa: "", nip: "", miasto: "" });
        setEdytowanyDostawcaId(null);
        pobierzDostawcow(szukanaFraza); // Odśwież z zachowaniem wyszukiwania
    };

    const handleUsunDostawce = async (id) => {
        if(confirm("Usunąć dostawcę?")) {
            const res = await fetch(`http://localhost:8080/api/dostawcy/${id}`, { method: 'DELETE' });
            if(res.ok) {
                pobierzDostawcow(szukanaFraza);
            } else {
                alert("Nie można usunąć - dostawca ma przypisane produkty!");
            }
        }
    };

    const handleEdytujDostawce = (d) => {
        setEdytowanyDostawcaId(d.id);
        setDostawcaForm({ nazwa: d.nazwa, nip: d.nip, miasto: d.miasto });
    };

    return (
        <div className="dostawcy-page">
        <section className="dashboard-section">
            <h2 className="section-title">🚚 Zarządzanie Dostawcami</h2>
            <div className="side-by-side-layout">

                {/* LEWA KOLUMNA: WYSZUKIWARKA + FORMULARZ */}
                <div className="menu-column">

                    {/* NOWOŚĆ: KARTA WYSZUKIWANIA */}
                    <div className="card search-box supplier-card">
                        <h3>🔍 Znajdź dostawcę</h3>
                        <div className="search-group">
                            <input
                                placeholder="Wpisz nazwę, NIP lub miasto..."
                                value={szukanaFraza}
                                onChange={handleSzukaj}
                            />
                        </div>
                    </div>

                    <div className="card add-form supplier-card">
                        <h3>{edytowanyDostawcaId ? "✏️ Edytuj Dostawcę" : "➕ Nowy Dostawca"}</h3>
                        <form onSubmit={handleZapiszDostawce}>
                            <input placeholder="Nazwa firmy" value={dostawcaForm.nazwa} onChange={e => setDostawcaForm({...dostawcaForm, nazwa: e.target.value})} required />
                            <input placeholder="NIP" value={dostawcaForm.nip} onChange={e => setDostawcaForm({...dostawcaForm, nip: e.target.value})} required />
                            <input placeholder="Miasto" value={dostawcaForm.miasto} onChange={e => setDostawcaForm({...dostawcaForm, miasto: e.target.value})} required />
                            <button type="submit" className="btn-save supplier-btn">ZAPISZ</button>
                            {edytowanyDostawcaId && <button type="button" onClick={() => {setEdytowanyDostawcaId(null); setDostawcaForm({nazwa:"",nip:"",miasto:""})}} className="btn-cancel">Anuluj</button>}
                        </form>
                    </div>
                </div>

                {/* PRAWA KOLUMNA: LISTA */}
                <div className="list-column">
                    <div className="table-container">
                        <table className="styled-table">
                            <thead><tr><th>ID</th><th>Firma</th><th>NIP</th><th>Miasto</th><th>Akcje</th></tr></thead>
                            <tbody>
                            {dostawcy.map(d => (
                                <tr key={d.id}>
                                    <td>{d.id}</td>
                                    <td className="bold">{d.nazwa}</td>
                                    <td>{d.nip}</td>
                                    <td>{d.miasto}</td>
                                    <td>
                                        <button onClick={() => handleEdytujDostawce(d)} className="btn-edit">Edytuj</button>
                                        <button onClick={() => handleUsunDostawce(d.id)} className="btn-delete">Usuń</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
        </div>
    );
}

export default Dostawcy;