import { Link, useLocation } from 'react-router-dom';
import './App.css'; // Żeby widział style

function Nawigacja() {
    const location = useLocation(); // Żeby wiedzieć, gdzie jesteśmy

    return (
        <nav className="navbar">
            <div className="nav-brand">System <span>Magazynowy</span></div>
            <div className="nav-links">
                <Link to="/" className={location.pathname === "/" ? "nav-item active" : "nav-item"}>
                    📦 Produkty
                </Link>
                <Link to="/dostawcy" className={location.pathname === "/dostawcy" ? "nav-item active" : "nav-item"}>
                    🚚 Dostawcy
                </Link>
            </div>
        </nav>
    );
}

export default Nawigacja;