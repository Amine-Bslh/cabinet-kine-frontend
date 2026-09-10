import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { listerSeances, creerSeance, modifierSeance, supprimerSeance } from '../services/seanceService';
import { listerRendezVous } from '../services/rendezVousService';
import Layout from '../components/Layout';
import BoutonCreer from '../components/BoutonCreer';

function SeancePage() {
    const [seances, setSeances] = useState([]);
    const [rendezVousListe, setRendezVousListe] = useState([]);
    const [date, setDate] = useState('');
    const [compteRendu, setCompteRendu] = useState('');
    const [rendezVousId, setRendezVousId] = useState('');
    const [formulaireOuvert, setFormulaireOuvert] = useState(false);
    const [enEdition, setEnEdition] = useState(null);

    const token = localStorage.getItem('token');
    const role = jwtDecode(token).role;

    useEffect(() => {
        charger();
        listerRendezVous().then((response) => setRendezVousListe(response.data));
    }, []);

    function charger() {
        listerSeances()
            .then((response) => setSeances(response.data))
            .catch((error) => console.log('Erreur :', error));
    }

    function handleCreer() {
        creerSeance({ date, compteRendu, rendezVous: { id: rendezVousId } })
            .then(() => {
                annuler();
                charger();
            })
            .catch((error) => alert(error.response?.data?.message || 'Erreur'));
    }

    function ouvrirEdition(seance) {
        setEnEdition(seance);
        setDate(seance.date);
        setCompteRendu(seance.compteRendu || '');
        setRendezVousId(seance.rendezVous ? seance.rendezVous.id : '');
        setFormulaireOuvert(true);
    }

    function handleModifier() {
        modifierSeance(enEdition.id, { date, compteRendu, rendezVous: { id: rendezVousId } })
            .then(() => {
                annuler();
                charger();
            })
            .catch((error) => alert(error.response?.data?.message || 'Erreur'));
    }

    function handleSupprimer(id) {
        if (window.confirm('Supprimer cette seance ?')) {
            supprimerSeance(id)
                .then(() => charger())
                .catch((error) => alert(error.response?.data?.message || 'Erreur lors de la suppression'));
        }
    }

    function annuler() {
        setEnEdition(null);
        setDate('');
        setCompteRendu('');
        setRendezVousId('');
        setFormulaireOuvert(false);
    }

    return (
        <Layout>
            <h1>Seances</h1>

            <div style={{ padding: '0 24px', marginBottom: '8px' }}>
                <button className="btn-ouvrir-formulaire" onClick={() => (formulaireOuvert ? annuler() : setFormulaireOuvert(true))}>
                    {formulaireOuvert ? 'Annuler' : '+ Ajouter une seance'}
                </button>
            </div>

            {formulaireOuvert && (
                <div className="form-card">
                    <div className="form-field">
                        <label>Rendez-vous</label>
                        <select value={rendezVousId} onChange={(e) => setRendezVousId(e.target.value)}>
                            <option value="">-- Choisir un rendez-vous --</option>
                            {rendezVousListe.map((rdv) => (
                                <option key={rdv.id} value={rdv.id}>{rdv.date} {rdv.patient ? `- ${rdv.patient.nom}` : ''}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-field">
                        <label>Date</label>
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                    <div className="form-field">
                        <label>Compte-rendu</label>
                        <input type="text" placeholder="Compte-rendu" value={compteRendu} onChange={(e) => setCompteRendu(e.target.value)} />
                    </div>
                    <BoutonCreer onClick={enEdition ? handleModifier : handleCreer} label={enEdition ? 'Enregistrer' : 'Creer'} />
                </div>
            )}

            <h2>Liste des seances</h2>
            <ul className="liste-cards">
                {seances.map((seance) => (
                    <li key={seance.id} className="card-item card-item-row">
                        <div>
                            <div className="card-item-title">{seance.date}</div>
                            <div className="card-item-subtitle">
                                {seance.compteRendu}
                                {seance.rendezVous && seance.rendezVous.patient ? ` - Patient : ${seance.rendezVous.patient.nom}` : ''}
                            </div>
                        </div>
                        {role === 'ADMIN' && (
                            <div className="card-item-actions">
                                <button className="btn-icon" onClick={() => ouvrirEdition(seance)} title="Modifier">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                                <button className="btn-icon btn-icon-danger" onClick={() => handleSupprimer(seance.id)} title="Supprimer">
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

export default SeancePage;