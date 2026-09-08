import { useState, useEffect } from 'react';
import { listerUtilisateurs, creerUtilisateur } from '../services/utilisateurService';
import Menu from '../components/Menu';

function Utilisateurs() {
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [email, setEmail] = useState('');
    const [nom, setNom] = useState('');
    const [role, setRole] = useState('USER');
    const [motDePasse, setMotDePasse] = useState('');

    useEffect(() => {
        chargerUtilisateurs();
    }, []);

    function chargerUtilisateurs() {
        listerUtilisateurs()
            .then((response) => {
                setUtilisateurs(response.data);
            })
            .catch((error) => {
                console.log('Erreur lors du chargement des utilisateurs :', error);
            });
    }

    function handleCreer() {
        const nouvelUtilisateur = { email, nom, role, motDePasse };

        creerUtilisateur(nouvelUtilisateur)
            .then(() => {
                setEmail('');
                setNom('');
                setRole('USER');
                setMotDePasse('');
                chargerUtilisateurs();
            })
            .catch((error) => {
                console.log('Erreur lors de la creation :', error);
            });
    }

    return (
        <div>
            <Menu />
            <h1>Gestion des utilisateurs</h1>

            <h2>Creer un utilisateur</h2>
            <div className="form-card">
                <div className="form-field">
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-field">
                    <label>Nom</label>
                    <input
                        type="text"
                        placeholder="Nom"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                    />
                </div>
                <div className="form-field">
                    <label>Role</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                </div>
                <div className="form-field">
                    <label>Mot de passe</label>
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={motDePasse}
                        onChange={(e) => setMotDePasse(e.target.value)}
                    />
                </div>
                <button onClick={handleCreer}>Creer</button>
            </div>

            <h2>Liste des utilisateurs</h2>
            <ul className="liste-cards">
                {utilisateurs.map((utilisateur) => (
                    <li key={utilisateur.id} className="card-item">
                        <div className="card-item-title">
                            {utilisateur.nom}
                            <span className="card-badge">{utilisateur.role}</span>
                        </div>
                        <div className="card-item-subtitle">{utilisateur.email}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Utilisateurs;