import { useEffect, useState } from 'react';
import './Produkty.css';

function Produkty() {
    const [produkty, setProdukty] = useState([]);
    const [kategorie, setKategorie] = useState([]);
    const [dostawcy, setDostawcy] = useState([]);

    // --- STANY FILTRÓW ---
    const [szukanaFraza, setSzukanaFraza] = useState("");
    const [filtrDostawca, setFiltrDostawca] = useState("");
    const [filtrKategoria, setFiltrKategoria] = useState("");

    const [form, setForm] = useState({ nazwa: "", cena: "", kategoriaId: "", dostawcaId: "" });
    const [edytowanyId, setEdytowanyId] = useState(null);

    useEffect(() => {
        pobierzProdukty();
        pobierzDostawcow();
        fetch('http://localhost:8080/api/kategorie').then(res => res.json()).then(setKategorie);
    }, []);

    // Funkcja pobierająca z obsługą 3 parametrów
    const pobierzProdukty = (fraza = szukanaFraza, idDostawcy = filtrDostawca, idKategorii = filtrKategoria) => {
        let url = `http://localhost:8080/api/produkty?`;
        const params = new URLSearchParams();

        if (fraza) params.append('szukaj', fraza);
        if (idDostawcy) params.append('dostawcaId', idDostawcy);
        if (idKategorii) params.append('kategoriaId', idKategorii);

        fetch(url + params.toString())
            .then(res => res.json())
            .then(setProdukty);
    }

    const pobierzDostawcow = async () => {
        const res = await fetch('http://localhost:8080/api/dostawcy');
        const data = await res.json();
        setDostawcy(data);
    };

    // --- HANDLERY FILTRÓW ---
    const handleSzukaj = (e) => {
        setSzukanaFraza(e.target.value);
        pobierzProdukty(e.target.value, filtrDostawca, filtrKategoria);
    }

    const handleFiltrDostawcy = (e) => {
        setFiltrDostawca(e.target.value);
        pobierzProdukty(szukanaFraza, e.target.value, filtrKategoria);
    }

    const handleFiltrKategorii = (e) => {
        setFiltrKategoria(e.target.value);
        pobierzProdukty(szukanaFraza, filtrDostawca, e.target.value);
    }

    // NOWOŚĆ: Funkcja czyszcząca wszystkie filtry naraz
    const resetujFiltry = () => {
        setSzukanaFraza("");
        setFiltrDostawca("");
        setFiltrKategoria("");
        pobierzProdukty("", "", ""); // Pobierz wszystko "na czysto"
    }

    const handleZapisz = async (e) => {
        e.preventDefault();
        const url = edytowanyId ? `http://localhost:8080/api/produkty/${edytowanyId}` : 'http://localhost:8080/api/produkty';
        const method = edytowanyId ? 'PUT' : 'POST';

        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });

        pobierzProdukty();
        setForm({ nazwa: "", cena: "", kategoriaId: "", dostawcaId: "" });
        setEdytowanyId(null);
    };

    const handleUsun = async (id) => {
        if(confirm("Usunąć produkt?")) {
            await fetch(`http://localhost:8080/api/produkty/${id}`, { method: 'DELETE' });
            pobierzProdukty();
        }
    }

    const handleEdytuj = (p) => {
        setEdytowanyId(p.id);
        setForm({ nazwa: p.nazwa, cena: p.cena, kategoriaId: p.kategoriaId, dostawcaId: p.dostawcaId || "" });
    };

    const znajdzNazweKategorii = (id) => {
        const k = kategorie.find(x => x.id == id); return k ? k.nazwa : "Brak";
    }
    const znajdzNazweDostawcy = (id) => {
        const d = dostawcy.find(x => x.id == id); return d ? d.nazwa : "Nieznany";
    }

    return (
        <div className="produkty-page">
            <section className="dashboard-section">
                <h2 className="section-title">📦 Zarządzanie Produktami</h2>
                <div className="side-by-side-layout">

                    {/* LEWA: MENU */}
                    <div className="menu-column">
                        <div className="card search-box">
                            <h3>🔍 Szukaj i Filtruj</h3>
                            <div className="search-group">
                                <input
                                    placeholder="Nazwa produktu..."
                                    value={szukanaFraza}
                                    onChange={handleSzukaj}
                                />
                                <select value={filtrDostawca} onChange={handleFiltrDostawcy}>
                                    <option value="">-- Wszyscy dostawcy --</option>
                                    {dostawcy.map(d => <option key={d.id} value={d.id}>{d.nazwa}</option>)}
                                </select>
                                <select value={filtrKategoria} onChange={handleFiltrKategorii}>
                                    <option value="">-- Wszystkie kategorie --</option>
                                    {kategorie.map(k => <option key={k.id} value={k.id}>{k.nazwa}</option>)}
                                </select>

                                {/* PRZYCISK RESETOWANIA */}
                                <button onClick={resetujFiltry} className="btn-cancel" style={{marginTop: '10px', width: '100%'}}>
                                    🔄 Resetuj filtry
                                </button>
                            </div>
                        </div>

                        <div className="card add-form">
                            <h3>{edytowanyId ? "✏️ Edycja towaru" : "➕ Nowy produkt"}</h3>
                            <form onSubmit={handleZapisz}>
                                <input placeholder="Nazwa" value={form.nazwa} onChange={e => setForm({...form, nazwa: e.target.value})} required />
                                <input type="number" placeholder="Cena" value={form.cena} onChange={e => setForm({...form, cena: e.target.value})} required />
                                <select value={form.kategoriaId} onChange={e => setForm({...form, kategoriaId: e.target.value})} required>
                                    <option value="">-- Wybierz Kategorię --</option>
                                    {kategorie.map(k => <option key={k.id} value={k.id}>{k.nazwa}</option>)}
                                </select>
                                <select value={form.dostawcaId} onChange={e => setForm({...form, dostawcaId: e.target.value})} required>
                                    <option value="">-- Wybierz Dostawcę --</option>
                                    {dostawcy.map(d => <option key={d.id} value={d.id}>{d.nazwa}</option>)}
                                </select>
                                <button type="submit" className="btn-save">{edytowanyId ? "ZAPISZ ZMIANY" : "DODAJ DO BAZY"}</button>
                                {edytowanyId && <button type="button" onClick={() => {setEdytowanyId(null); setForm({nazwa:"",cena:"",kategoriaId:"",dostawcaId:""})}} className="btn-cancel">Anuluj edycję</button>}
                            </form>
                        </div>
                    </div>

                    {/* PRAWA: LISTA */}
                    <div className="list-column">
                        <div className="table-container">
                            <table className="styled-table">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Produkt</th>
                                    <th>Cena</th>
                                    <th>Dostawca</th>
                                    <th>Kategoria</th>
                                    <th>Akcje</th>
                                </tr>
                                </thead>
                                <tbody>
                                {produkty.map(p => (
                                    <tr key={p.id}>
                                        <td>#{p.id}</td>
                                        <td className="bold" title={p.nazwa}>{p.nazwa}</td>
                                        <td><span className="price-tag">{p.cena} zł</span></td>
                                        <td><span className="supplier-tag">{znajdzNazweDostawcy(p.dostawcaId)}</span></td>
                                        <td><span className="category-tag">{znajdzNazweKategorii(p.kategoriaId)}</span></td>
                                        <td>
                                            <button onClick={() => handleEdytuj(p)} className="btn-edit">Edytuj</button>
                                            <button onClick={() => handleUsun(p.id)} className="btn-delete">Usuń</button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            {produkty.length === 0 && <p style={{textAlign: 'center', padding: '20px', color: '#888'}}>Brak wyników dla wybranych filtrów.</p>}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Produkty;