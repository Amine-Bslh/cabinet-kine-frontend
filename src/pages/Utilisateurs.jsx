import { useState, useEffect } from 'react';
import { listerUtilisateurs } from '../services/utilisateurService';

function Utilisateurs() {
    const [utilisateurs, setUtilisateurs] = useState([]);

    useEffect(() => {
        listerUtilisateurs()
            .then((response) => {
                setUtilisateurs(response.data);
            })
            .catch((error) => {
                console.log('Erreur lors du chargement des utilisateurs :', error);
            });
    }, []);

    return (
        <div>
            <h1>Gestion des utilisateurs</h1>
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