import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Menu() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const role = decoded.role;

    function handleLogout() {
        localStorage.removeItem('token');
        navigate('/login');
    }

    return (
        <nav>
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
            {' | '}
            <button onClick={handleLogout}>Se deconnecter</button>
        </nav>
    );
}

export default Menu;