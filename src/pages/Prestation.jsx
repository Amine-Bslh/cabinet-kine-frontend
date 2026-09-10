import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { listerPrestations, creerPrestation, modifierPrestation, supprimerPrestation } from '../services/prestationService';
import Layout from '../components/Layout';
import BoutonCreer from '../components/BoutonCreer';

const PAR_PAGE = 5;

function PrestationPage() {
    const [prestations, setPrestations] = useState([]);
    const [nom, setNom] = useState('');
    const [description, setDescription] = useState('');
    const [page, setPage] = useState(0);
    const [formulaireOuvert, setFormulaireOuvert] = useState(false);
    const [enEdition, setEnEdition] = useState(null);

    const token = localStorage.getItem('token');
    const role = jwtDecode(token).role;

    useEffect(() => {
        charger();
    }, []);

    function charger() {
        listerPrestations()
            .then((response) => setPrestations(response.data))
            .catch((error) => console.log('Erreur :', error));
    }

    function handleCreer() {
        creerPrestation({ nom, description })
            .then(() => {
                annuler();
                charger();
            })
            .catch((error) => alert(error.response?.data?.message || 'Erreur'));
    }

    function ouvrirEdition(prestation) {
        setEnEdition(prestation);
        setNom(prestation.nom);
        setDescription(prestation.description || '');
        setFormulaireOuvert(true);
    }

    function handleModifier() {
        modifierPrestation(enEdition.id, { nom, description })
            .then(() => {
                annuler();
                charger();
            })
            .catch((error) => alert(error.response?.data?.message || 'Erreur'));
    }

    function handleSupprimer(id) {
        if (window.confirm('Supprimer cette prestation ?')) {
            supprimerPrestation(id)
                .then(() => charger())
                .catch((error) => alert(error.response?.data?.message || 'Erreur lors de la suppression'));
        }
    }

    function annuler() {
        setEnEdition(null);
        setNom('');
        setDescription('');
        setFormulaireOuvert(false);
    }

    const nombreDePages = Math.ceil(prestations.length / PAR_PAGE);
    const debut = page * PAR_PAGE;
    const prestationsAffichees = prestations.slice(debut, debut + PAR_PAGE);

    return (
        <Layout>
            <h1>Prestations</h1>

            <div style={{ padding: '0 24px', marginBottom: '8px' }}>
                <button className="btn-ouvrir-formulaire" onClick={() => (formulaireOuvert ? annuler() : setFormulaireOuvert(true))}>
                    {formulaireOuvert ? 'Annuler' : '+ Ajouter une prestation'}
                </button>
            </div>

            {formulaireOuvert && (
                <div className="form-card">
                    <div className="form-field">
                        <label>Nom</label>
                        <input type="text" placeholder="ex: Cryo" value={nom} onChange={(e) => setNom(e.target.value)} />
                    </div>
                    <div className="form-field">
                        <label>Description</label>
                        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <BoutonCreer onClick={enEdition ? handleModifier : handleCreer} label={enEdition ? 'Enregistrer' : 'Creer'} />
                </div>
            )}

            <h2>Liste des prestations</h2>
            <ul className="liste-cards">
                {prestationsAffichees.map((prestation) => (
                    <li key={prestation.id} className="card-item card-item-row">
                        <div>
                            <div className="card-item-title">{prestation.nom}</div>
                            <div className="card-item-subtitle">{prestation.description}</div>
                        </div>
                        {role === 'ADMIN' && (
                            <div className="card-item-actions">
                                <button className="btn-icon" onClick={() => ouvrirEdition(prestation)} title="Modifier">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                                <button className="btn-icon btn-icon-danger" onClick={() => handleSupprimer(prestation.id)} title="Supprimer">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            <div style={{ padding: '0 24px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button onClick={() => setPage(page - 1)} disabled={page === 0}>Precedent</button>
                <span>Page {page + 1} / {nombreDePages || 1}</span>
                <button onClick={() => setPage(page + 1)} disabled={page + 1 >= nombreDePages}>Suivant</button>
            </div>
        </Layout>
    );
}

export default PrestationPage;