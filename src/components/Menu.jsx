import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Logo from './Logo';

function Menu() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const role = decoded.role;
    const nom = decoded.nom || '';
    const initiales = nom.substring(0, 2).toUpperCase();
    const [menuOuvert, setMenuOuvert] = useState(false);

    function handleLogout() {
        localStorage.removeItem('token');
        navigate('/login');
    }

    return (
        <nav>
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '8px' }}>
                <Logo size={40} />
            </div>
            <Link to="/patients">Patients</Link>
            {' | '}
            <Link to="/diagnostics">Diagnostics</Link>
            {' | '}
            <Link to="/cures">Cures</Link>
            {' | '}
            <Link to="/rendezvous">Rendez-vous</Link>
            {' | '}
            <Link to="/seances">Seances</Link>
            {' | '}
            <Link to="/prestations">Prestations</Link>
            {' | '}
            <Link to="/paiements">Paiements</Link>
            {role === 'ADMIN' && (
                <>
                    {' | '}
                    <Link to="/utilisateurs">Utilisateurs</Link>
                </>
            )}

            <div className="nav-user-menu">
                <button className="nav-avatar" onClick={() => setMenuOuvert(!menuOuvert)}>
                    {initiales}
                </button>

                {menuOuvert && (
                    <div className="nav-user-dropdown">
                        <div className="nav-dropdown-header">
                            <div className="nav-avatar-small">{initiales}</div>
                            <div>
                                <div className="nav-dropdown-name">{nom}</div>
                                <div className="nav-dropdown-email">{decoded.sub}</div>
                            </div>
                        </div>

                        <div className="nav-dropdown-row">
              <span className="nav-dropdown-row-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" strokeLinejoin="round" />
                </svg>
              </span>
                            <span>{role}</span>
                        </div>

                        <button className="nav-dropdown-row nav-dropdown-row-button" onClick={handleLogout}>
              <span className="nav-dropdown-row-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
                            <span>Deconnexion</span>
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Menu;