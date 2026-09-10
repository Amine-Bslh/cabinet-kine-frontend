import { Link, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ICONS = {
    patients: <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />,
    diagnostics: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 9h6M9 13h6M9 17h3" /></>,
    cures: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />,
    rendezvous: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
    seances: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
    prestations: <path d="M20 7h-3a2 2 0 0 1-2-2V2M9 2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V9l-5-7z" />,
    paiements: <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></>,
    utilisateurs: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
};

function IconWrap({ children }) {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {children}
        </svg>
    );
}

function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const role = decoded.role;
    const nom = decoded.nom || '';
    const initiales = nom.substring(0, 2).toUpperCase();

    function handleLogout() {
        localStorage.removeItem('token');
        navigate('/login');
    }

    const links = [
        { to: '/patients', label: 'Patients', icon: ICONS.patients },
        { to: '/diagnostics', label: 'Diagnostics', icon: ICONS.diagnostics },
        { to: '/cures', label: 'Cures', icon: ICONS.cures },
        { to: '/rendezvous', label: 'Rendez-vous', icon: ICONS.rendezvous },
        { to: '/seances', label: 'Seances', icon: ICONS.seances },
        { to: '/prestations', label: 'Prestations', icon: ICONS.prestations },
        { to: '/paiements', label: 'Paiements', icon: ICONS.paiements },
    ];

    if (role === 'ADMIN') {
        links.push({ to: '/utilisateurs', label: 'Utilisateurs', icon: ICONS.utilisateurs });
    }

    return (
        <aside className="sidebar">
            <div className="sidebar-profile">
                <div className="sidebar-avatar">{initiales}</div>
                <div className="sidebar-profile-name">{nom}</div>
                <div className="sidebar-profile-role">{role}</div>
            </div>

            <nav className="sidebar-links">
                {links.map((link) => (
                    <Link
                        key={link.to}
                        to={link.to}
                        className={`sidebar-link ${location.pathname === link.to ? 'active' : ''}`}
                    >
                        <IconWrap>{link.icon}</IconWrap>
                        {link.label}
                    </Link>
                ))}
            </nav>

            <button className="sidebar-logout" onClick={handleLogout}>
                <IconWrap>
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <path d="M16 17l5-5-5-5M21 12H9" />
                </IconWrap>
                Deconnexion
            </button>
        </aside>
    );
}

export default Sidebar;