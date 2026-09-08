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
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="text"
                placeholder="Nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
            />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
            </select>
            <input
                type="password"
                placeholder="Mot de passe"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
            />
            <button onClick={handleCreer}>Creer</button>

            <h2>Liste des utilisateurs</h2>
            <ul>
                {utilisateurs.map((utilisateur) => (
                    <li key={utilisateur.id}>
                        {utilisateur.nom} - {utilisateur.email} - {utilisateur.role}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Utilisateurs;