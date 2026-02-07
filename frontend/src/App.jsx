import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nawigacja from './Nawigacja';
import Produkty from './Produkty';
import Dostawcy from './Dostawcy';
import './App.css';

function App() {
    return (
        <Router>
            <div className="app-container">
                <Nawigacja />

                <div className="content-area">
                    <Routes>
                        <Route path="/" element={<Produkty />} />
                        <Route path="/dostawcy" element={<Dostawcy />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;