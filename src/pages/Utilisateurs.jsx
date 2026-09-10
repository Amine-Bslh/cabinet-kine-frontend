import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { listerUtilisateurs, creerUtilisateur, modifierUtilisateur, supprimerUtilisateur } from '../services/utilisateurService';
import Layout from '../components/Layout';
import BoutonCreer from '../components/BoutonCreer';

function Utilisateurs() {
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [email, setEmail] = useState('');
    const [nom, setNom] = useState('');
    const [role, setRole] = useState('USER');
    const [motDePasse, setMotDePasse] = useState('');
    const [formulaireOuvert, setFormulaireOuvert] = useState(false);
    const [enEdition, setEnEdition] = useState(null);

    const token = localStorage.getItem('token');
    const monRole = jwtDecode(token).role;

    useEffect(() => {
        chargerUtilisateurs();
    }, []);

    function chargerUtilisateurs() {
        listerUtilisateurs()
            .then((response) => setUtilisateurs(response.data))
            .catch((error) => console.log('Erreur lors du chargement des utilisateurs :', error));
    }

    function handleCreer() {
        creerUtilisateur({ email, nom, role, motDePasse })
            .then(() => {
                annuler();
                chargerUtilisateurs();
            })
            .catch((error) => alert(error.response?.data?.message || 'Erreur'));
    }

    function ouvrirEdition(utilisateur) {
        setEnEdition(utilisateur);
        setEmail(utilisateur.email);
        setNom(utilisateur.nom);
        setRole(utilisateur.role);
        setMotDePasse('');
        setFormulaireOuvert(true);
    }

    function handleModifier() {
        modifierUtilisateur(enEdition.id, { email, nom, role, motDePasse })
            .then(() => {
                annuler();
                chargerUtilisateurs();
            })
            .catch((error) => alert(error.response?.data?.message || 'Erreur'));
    }

    function handleSupprimer(id) {
        if (window.confirm('Supprimer cet utilisateur ?')) {
            supprimerUtilisateur(id)
                .then(() => chargerUtilisateurs())
                .catch((error) => alert(error.response?.data?.message || 'Erreur lors de la suppression'));
        }
    }

    function annuler() {
        setEnEdition(null);
        setEmail('');
        setNom('');
        setRole('USER');
        setMotDePasse('');
        setFormulaireOuvert(false);
    }

    return (
        <Layout>
            <h1>Gestion des utilisateurs</h1>

            <div style={{ padding: '0 24px', marginBottom: '8px' }}>
                <button className="btn-ouvrir-formulaire" onClick={() => (formulaireOuvert ? annuler() : setFormulaireOuvert(true))}>
                    {formulaireOuvert ? 'Annuler' : '+ Ajouter un utilisateur'}
                </button>
            </div>

            {formulaireOuvert && (
                <div className="form-card">
                    <div className="form-field">
                        <label>Email</label>
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="form-field">
                        <label>Nom</label>
                        <input type="text" placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} />
                    </div>
                    <div className="form-field">
                        <label>Role</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </div>
                    <div className="form-field">
                        <label>Mot de passe {enEdition ? '(laisser vide pour ne pas changer)' : ''}</label>
                        <input type="password" placeholder="Mot de passe" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} />
                    </div>
                    <BoutonCreer onClick={enEdition ? handleModifier : handleCreer} label={enEdition ? 'Enregistrer' : 'Creer'} />
                </div>
            )}

            <h2>Liste des utilisateurs</h2>
            <ul className="liste-cards">
                {utilisateurs.map((utilisateur) => (
                    <li key={utilisateur.id} className="card-item card-item-row">
                        <div>
                            <div className="card-item-title">
                                {utilisateur.nom}
                                <span className="card-badge">{utilisateur.role}</span>
                            </div>
                            <div className="card-item-subtitle">{utilisateur.email}</div>
                        </div>
                        {monRole === 'ADMIN' && (
                            <div className="card-item-actions">
                                <button className="btn-icon" onClick={() => ouvrirEdition(utilisateur)} title="Modifier">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                                <button className="btn-icon btn-icon-danger" onClick={() => handleSupprimer(utilisateur.id)} title="Supprimer">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </Layout>
    );
}

export default Utilisateurs;