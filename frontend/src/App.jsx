import { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [produkty, setProdukty] = useState([]);
    const [kategorie, setKategorie] = useState([]);

    // --- STANY WYSZUKIWANIA ---
    const [szukanaFraza, setSzukanaFraza] = useState("");
    const [filtrDostawca, setFiltrDostawca] = useState(""); // <--- NOWOŚĆ: ID wybranego dostawcy do filtra

    const [form, setForm] = useState({
        nazwa: "",
        cena: "",
        kategoriaId: "",
        dostawcaId: ""
    });
    const [edytowanyId, setEdytowanyId] = useState(null);
    const [dostawcy, setDostawcy] = useState([]);
    const [dostawcaForm, setDostawcaForm] = useState({ nazwa: "", nip: "", miasto: "" });
    const [edytowanyDostawcaId, setEdytowanyDostawcaId] = useState(null);

    useEffect(() => {
        pobierzProdukty(); // Pobierz wszystko na start
        pobierzDostawcow();
        fetch('http://localhost:8080/api/kategorie')
            .then(res => res.json())
            .then(data => setKategorie(data));
    }, []);

    // --- ZMODYFIKOWANA FUNKCJA POBIERANIA ---
    // Teraz przyjmuje dwa argumenty, żeby móc filtrować po obu naraz
    const pobierzProdukty = (fraza = szukanaFraza, idDostawcy = filtrDostawca) => {
        let url = `http://localhost:8080/api/produkty?`;

        // Budujemy URL dynamicznie
        const params = new URLSearchParams();
        if (fraza) params.append('szukaj', fraza);
        if (idDostawcy) params.append('dostawcaId', idDostawcy);

        fetch(url + params.toString())
            .then(res => res.json())
            .then(data => setProdukty(data));
    }

    const handleSzukaj = (e) => {
        const tekst = e.target.value;
        setSzukanaFraza(tekst);
        pobierzProdukty(tekst, filtrDostawca); // Przekazujemy aktualny filtr dostawcy
    }

    // --- NOWA FUNKCJA DO FILTROWANIA ---
    const handleFiltrDostawcy = (e) => {
        const id = e.target.value;
        setFiltrDostawca(id);
        pobierzProdukty(szukanaFraza, id); // Przekazujemy aktualną frazę
    }

    const handleZapisz = async (e) => {
        e.preventDefault();
        const url = edytowanyId
            ? `http://localhost:8080/api/produkty/${edytowanyId}`
            : 'http://localhost:8080/api/produkty';

        const method = edytowanyId ? 'PUT' : 'POST';

        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });

        alert(edytowanyId ? "Zaktualizowano produkt!" : "Dodano produkt!");

        pobierzProdukty(); // Odświeżamy listę
        setForm({ nazwa: "", cena: "", kategoriaId: "", dostawcaId: "" });
        setEdytowanyId(null);
    };

    const handleUsun = async (id) => {
        if(confirm("Usunąć ten produkt?")) {
            await fetch(`http://localhost:8080/api/produkty/${id}`, { method: 'DELETE' });
            pobierzProdukty();
        }
    }

    const znajdzNazweKategorii = (id) => {
        const kat = kategorie.find(k => k.id == id);
        return kat ? kat.nazwa : "Nieznana";
    }

    const handleEdytuj = (produkt) => {
        setEdytowanyId(produkt.id);
        setForm({
            nazwa: produkt.nazwa,
            cena: produkt.cena,
            kategoriaId: produkt.kategoriaId,
            dostawcaId: produkt.dostawcaId || "" // Zabezpieczenie na null
        });
    };

    const anulujEdycje = () => {
        setEdytowanyId(null);
        setForm({ nazwa: "", cena: "", kategoriaId: "", dostawcaId: "" });
    }

    // Ujednoliciłem nazwę funkcji (było "pobierzDostawców" z ó)
    const pobierzDostawcow = async () => {
        const resp = await fetch('http://localhost:8080/api/dostawcy');
        const data = await resp.json();
        setDostawcy(data);
    };

    const znajdzNazweDostawcy = (id) => {
        const dostawca = dostawcy.find(d => d.id === parseInt(id));
        return dostawca ? dostawca.nazwa : 'Nieznany dostawca';
    };

    const handleZapiszDostawce = async (e) => {
        e.preventDefault();
        const url = edytowanyDostawcaId
            ? `http://localhost:8080/api/dostawcy/${edytowanyDostawcaId}`
            : 'http://localhost:8080/api/dostawcy';

        await fetch(url, {
            method: edytowanyDostawcaId ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dostawcaForm)
        });

        setDostawcaForm({ nazwa: "", nip: "", miasto: "" });
        setEdytowanyDostawcaId(null);
        pobierzDostawcow();
    };

    const handleEdytujDostawce = (d) => {
        setEdytowanyDostawcaId(d.id);
        setDostawcaForm({ nazwa: d.nazwa, nip: d.nip, miasto: d.miasto });
    };

    const handleUsunDostawce = async (id) => {
        if(confirm("Czy na pewno chcesz usunąć tego dostawcę?")) {
            try {
                const resp = await fetch(`http://localhost:8080/api/dostawcy/${id}`, {
                    method: 'DELETE'
                });

                if (resp.ok) {
                    // TYLKO TUTAJ JEST SUKCES (Status 200-299)
                    alert("Dostawca został pomyślnie usunięty.");
                    pobierzDostawcow();
                } else if (resp.status === 409) {
                    // Obsługa błędu powiązania (Status 409 Conflict)
                    const msg = await resp.text();
                    alert("BŁĄD: " + msg);
                } else {
                    // Obsługa pozostałych błędów (np. 500)
                    alert("Wystąpił nieoczekiwany błąd serwera.");
                }
            } catch (error) {
                alert("Błąd połączenia z serwerem.");
            }
        }
    };

    return (
        <div className="app-container">
            <h1 className="header-title">System Magazynowy</h1>

            <div className="panel-grid">
                {/* LEWA: Formularz Dodawania Produktu */}
                <div className="card add-form">
                    <h3>{edytowanyId ? "✏️ Edytuj towar" : "➕ Dodaj nowy towar"}</h3>
                    <form onSubmit={handleZapisz}>
                        <input placeholder="Nazwa produktu" value={form.nazwa} onChange={e => setForm({...form, nazwa: e.target.value})} required />
                        <input type="number" placeholder="Cena (PLN)" value={form.cena} onChange={e => setForm({...form, cena: e.target.value})} required />

                        <select value={form.kategoriaId} onChange={e => setForm({...form, kategoriaId: e.target.value})} required>
                            <option value="">-- Wybierz kategorię --</option>
                            {kategorie.map(k => (
                                <option key={k.id} value={k.id}>{k.nazwa}</option>
                            ))}
                        </select>

                        <select value={form.dostawcaId} onChange={e => setForm({...form, dostawcaId: e.target.value})} required>
                            <option value="">-- Wybierz dostawcę --</option>
                            {dostawcy.map(d => (
                                <option key={d.id} value={d.id}>{d.nazwa} ({d.miasto})</option>
                            ))}
                        </select>

                        <div style={{display: 'flex', gap: '10px'}}>
                            <button type="submit" className="btn-save" style={{flex: 1}}>
                                {edytowanyId ? "ZAKTUALIZUJ" : "ZAPISZ W BAZIE"}
                            </button>
                            {edytowanyId && (
                                <button type="button" onClick={anulujEdycje} style={{background: '#ccc', border: 'none', borderRadius: '8px', cursor: 'pointer', padding: '0 15px'}}>❌</button>
                            )}
                        </div>
                    </form>
                </div>

                {/* PRAWA: Wyszukiwarka i Filtrowanie */}
                <div className="card search-box">
                    <h3>🔍 Szukaj i Filtruj</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                        {/* 1. Szukanie po nazwie */}
                        <input
                            placeholder="Wpisz nazwę produktu..."
                            value={szukanaFraza}
                            onChange={handleSzukaj}
                        />

                        {/* 2. Filtrowanie po dostawcy (NOWOŚĆ) */}
                        <select
                            value={filtrDostawca}
                            onChange={handleFiltrDostawcy}
                            style={{padding: '10px', borderRadius: '8px', border: '1px solid #ddd'}}
                        >
                            <option value="">-- Wszyscy dostawcy --</option>
                            {dostawcy.map(d => (
                                <option key={d.id} value={d.id}>{d.nazwa}</option>
                            ))}
                        </select>

                        <div style={{ textAlign: 'center', color: '#555', fontSize: '0.9rem' }}>
                            <p style={{ margin: 0 }}>
                                Znaleziono: <b>{produkty.length}</b> produktów
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* TABELA PRODUKTÓW */}
            <div className="table-container">
                <table className="styled-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nazwa Produktu</th>
                        <th>Kategoria</th>
                        <th>Cena</th>
                        <th>Dostawca</th>
                        <th>Akcja</th>
                    </tr>
                    </thead>
                    <tbody>
                    {produkty.map(p => (
                        <tr key={p.id}>
                            <td>#{p.id}</td>
                            <td style={{ fontWeight: '600' }}>{p.nazwa}</td>
                            <td><span className="category-tag">{znajdzNazweKategorii(p.kategoriaId)}</span></td>
                            <td><span className="price-tag">{p.cena} zł</span></td>
                            <td><span className="supplier-tag">{znajdzNazweDostawcy(p.dostawcaId)}</span></td>
                            <td>
                                <button onClick={() => handleEdytuj(p)} className="btn-edit" style={{marginRight: '10px'}}>EDYTUJ</button>
                                <button onClick={() => handleUsun(p.id)} className="btn-delete">USUŃ</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {produkty.length === 0 && (
                    <div style={{padding: 20, textAlign: 'center', color: '#888'}}>Brak produktów spełniających kryteria.</div>
                )}
            </div>

            {/* ZARZĄDZANIE DOSTAWCAMI */}
            <div className="management-section">
                <h2>🚚 Zarządzanie Dostawcami</h2>
                <div className="card add-form">
                    <h3>{edytowanyDostawcaId ? "✏️ Edytuj Dostawcę" : "➕ Nowy Dostawca"}</h3>
                    <form onSubmit={handleZapiszDostawce}>
                        <input placeholder="Nazwa firmy" value={dostawcaForm.nazwa} onChange={e => setDostawcaForm({...dostawcaForm, nazwa: e.target.value})} required />
                        <input placeholder="NIP" value={dostawcaForm.nip} onChange={e => setDostawcaForm({...dostawcaForm, nip: e.target.value})} required />
                        <input placeholder="Miasto" value={dostawcaForm.miasto} onChange={e => setDostawcaForm({...dostawcaForm, miasto: e.target.value})} required />
                        <button type="submit" className="btn-save">ZAPISZ DOSTAWCĘ</button>
                    </form>
                </div>

                <table className="styled-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nazwa</th>
                        <th>NIP</th>
                        <th>Miasto</th>
                        <th>Akcje</th>
                    </tr>
                    </thead>
                    <tbody>
                    {dostawcy.map(d => (
                        <tr key={d.id}>
                            <td>#{d.id}</td>
                            <td>{d.nazwa}</td>
                            <td>{d.nip}</td>
                            <td>{d.miasto}</td>
                            <td>
                                <button
                                    onClick={() => handleEdytujDostawce(d)}
                                    className="btn-edit"
                                    style={{marginRight: '10px'}}
                                >
                                    EDYTUJ
                                </button>
                                <button
                                    onClick={() => handleUsunDostawce(d.id)}
                                    className="btn-delete"
                                >
                                    USUŃ
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default App;