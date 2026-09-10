import { useState, useEffect } from 'react';
import { listerPrestations, creerPrestation } from '../services/prestationService';
import Layout from '../components/Layout';
import BoutonCreer from '../components/BoutonCreer';

const PAR_PAGE = 5;

function PrestationPage() {
    const [prestations, setPrestations] = useState([]);
    const [nom, setNom] = useState('');
    const [description, setDescription] = useState('');
    const [page, setPage] = useState(0);
    const [formulaireOuvert, setFormulaireOuvert] = useState(false);

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
                setNom('');
                setDescription('');
                setFormulaireOuvert(false);
                charger();
            })
            .catch((error) => console.log('Erreur :', error));
    }

    const nombreDePages = Math.ceil(prestations.length / PAR_PAGE);
    const debut = page * PAR_PAGE;
    const prestationsAffichees = prestations.slice(debut, debut + PAR_PAGE);

    return (
        <Layout>
            <h1>Prestations</h1>

            <div style={{ padding: '0 24px', marginBottom: '8px' }}>
                <button className="btn-ouvrir-formulaire" onClick={() => setFormulaireOuvert(!formulaireOuvert)}>
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
                    <BoutonCreer onClick={handleCreer} />
                </div>
            )}

            <h2>Liste des prestations</h2>
            <ul className="liste-cards">
                {prestationsAffichees.map((prestation) => (
                    <li key={prestation.id} className="card-item">
                        <div className="card-item-title">{prestation.nom}</div>
                        <div className="card-item-subtitle">{prestation.description}</div>
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