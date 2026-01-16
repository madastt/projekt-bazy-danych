import { useEffect, useState } from 'react';
import './App.css'; // <--- WAŻNE: Import stylów

function App() {
    const [produkty, setProdukty] = useState([]);
    const [kategorie, setKategorie] = useState([]);
    const [szukanaFraza, setSzukanaFraza] = useState("");
    const [form, setForm] = useState({
        nazwa: "",
        cena: "",
        kategoriaId: ""
    });

    useEffect(() => {
        pobierzProdukty();
        fetch('http://localhost:8080/api/kategorie')
            .then(res => res.json())
            .then(data => setKategorie(data));
    }, []);

    const pobierzProdukty = (fraza = "") => {
        const url = fraza
            ? `http://localhost:8080/api/produkty?szukaj=${fraza}`
            : `http://localhost:8080/api/produkty`;

        fetch(url)
            .then(res => res.json())
            .then(data => setProdukty(data));
    }

    const handleSzukaj = (e) => {
        const tekst = e.target.value;
        setSzukanaFraza(tekst);
        pobierzProdukty(tekst);
    }

    const handleDodaj = async (e) => {
        e.preventDefault();
        await fetch('http://localhost:8080/api/produkty', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        alert("Dodano produkt!");
        pobierzProdukty(szukanaFraza);
        setForm({ nazwa: "", cena: "", kategoriaId: "" });
    };

    const handleUsun = async (id) => {
        if(confirm("Usunąć ten produkt?")) {
            await fetch(`http://localhost:8080/api/produkty/${id}`, { method: 'DELETE' });
            pobierzProdukty(szukanaFraza);
        }
    }

    const znajdzNazweKategorii = (id) => {
        const kat = kategorie.find(k => k.id == id);
        return kat ? kat.nazwa : "Nieznana";
    }

    return (
        <div className="app-container">
            <h1 className="header-title">System Magazynowy <span>Oracle</span></h1>

            {/* --- PANEL STEROWANIA --- */}
            <div className="panel-grid">

                {/* LEWA: Formularz Dodawania */}
                <div className="card add-form">
                    <h3>➕ Dodaj nowy towar</h3>
                    <form onSubmit={handleDodaj}>
                        <input
                            placeholder="Nazwa produktu"
                            value={form.nazwa}
                            onChange={e => setForm({...form, nazwa: e.target.value})}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Cena (PLN)"
                            value={form.cena}
                            onChange={e => setForm({...form, cena: e.target.value})}
                            required
                        />

                        <select
                            value={form.kategoriaId}
                            onChange={e => setForm({...form, kategoriaId: e.target.value})}
                            required
                        >
                            <option value="">-- Wybierz kategorię --</option>
                            {kategorie.map(k => (
                                <option key={k.id} value={k.id}>{k.nazwa}</option>
                            ))}
                        </select>

                        <button type="submit" className="btn-save">ZAPISZ W BAZIE</button>
                    </form>
                </div>

                {/* PRAWA: Wyszukiwarka */}
                <div className="card search-box">
                    <h3>🔍 Szukaj towaru</h3>

                    {/* Prostszy układ - jeden pod drugim */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input
                            placeholder="Wpisz nazwę produktu..."
                            value={szukanaFraza}
                            onChange={handleSzukaj}
                        />

                        {/* Napis od razu pod spodem, wyśrodkowany */}
                        <div style={{ textAlign: 'center', color: '#555', fontSize: '0.9rem' }}>
                            <p style={{ margin: 0 }}>
                                Znaleziono w bazie: <b>{produkty.length}</b> rekordów
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- TABELA DANYCH --- */}
            <div className="table-container">
                <table className="styled-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nazwa Produktu</th>
                        <th>Kategoria</th>
                        <th>Cena</th>
                        <th>Akcja</th>
                    </tr>
                    </thead>
                    <tbody>
                    {produkty.map(p => (
                        <tr key={p.id}>
                            <td>#{p.id}</td>
                            <td style={{ fontWeight: '600' }}>{p.nazwa}</td>
                            <td>
                                <span className="category-tag">
                                    {znajdzNazweKategorii(p.kategoriaId)}
                                </span>
                            </td>
                            <td>
                                <span className="price-tag">{p.cena} zł</span>
                            </td>
                            <td>
                                <button
                                    onClick={() => handleUsun(p.id)}
                                    className="btn-delete"
                                >
                                    USUŃ
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {produkty.length === 0 && (
                    <div style={{padding: 20, textAlign: 'center', color: '#888'}}>
                        Brak produktów. Dodaj coś lub zmień kryteria wyszukiwania.
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;