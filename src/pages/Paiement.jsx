import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { listerPaiements, creerPaiement, modifierPaiement, supprimerPaiement } from '../services/paiementService';
import { listerRendezVous } from '../services/rendezVousService';
import Layout from '../components/Layout';
import BoutonCreer from '../components/BoutonCreer';

function PaiementPage() {
    const [paiements, setPaiements] = useState([]);
    const [rendezVousListe, setRendezVousListe] = useState([]);
    const [montant, setMontant] = useState('');
    const [moyen, setMoyen] = useState('especes');
    const [date, setDate] = useState('');
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
        listerPaiements()
            .then((response) => setPaiements(response.data))
            .catch((error) => console.log('Erreur :', error));
    }

    function handleCreer() {
        creerPaiement({ montant, moyen, date, rendezVous: { id: rendezVousId } })
            .then(() => {
                annuler();
                charger();
            })
            .catch((error) => alert(error.response?.data?.message || 'Erreur'));
    }

    function ouvrirEdition(paiement) {
        setEnEdition(paiement);
        setMontant(paiement.montant);
        setMoyen(paiement.moyen);
        setDate(paiement.date);
        setRendezVousId(paiement.rendezVous ? paiement.rendezVous.id : '');
        setFormulaireOuvert(true);
    }

    function handleModifier() {
        modifierPaiement(enEdition.id, { montant, moyen, date, rendezVous: { id: rendezVousId } })
            .then(() => {
                annuler();
                charger();
            })
            .catch((error) => alert(error.response?.data?.message || 'Erreur'));
    }

    function handleSupprimer(id) {
        if (window.confirm('Supprimer ce paiement ?')) {
            supprimerPaiement(id)
                .then(() => charger())
                .catch((error) => alert(error.response?.data?.message || 'Erreur lors de la suppression'));
        }
    }

    function annuler() {
        setEnEdition(null);
        setMontant('');
        setMoyen('especes');
        setDate('');
        setRendezVousId('');
        setFormulaireOuvert(false);
    }

    return (
        <Layout>
            <h1>Paiements</h1>

            <div style={{ padding: '0 24px', marginBottom: '8px' }}>
                <button className="btn-ouvrir-formulaire" onClick={() => (formulaireOuvert ? annuler() : setFormulaireOuvert(true))}>
                    {formulaireOuvert ? 'Annuler' : '+ Ajouter un paiement'}
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
                        <label>Montant</label>
                        <input type="number" placeholder="Montant" value={montant} onChange={(e) => setMontant(e.target.value)} />
                    </div>
                    <div className="form-field">
                        <label>Moyen</label>
                        <select value={moyen} onChange={(e) => setMoyen(e.target.value)}>
                            <option value="especes">Especes</option>
                            <option value="carte">Carte</option>
                            <option value="cheque">Cheque</option>
                        </select>
                    </div>
                    <div className="form-field">
                        <label>Date</label>
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                    <BoutonCreer onClick={enEdition ? handleModifier : handleCreer} label={enEdition ? 'Enregistrer' : 'Creer'} />
                </div>
            )}

            <h2>Liste des paiements</h2>
            <ul className="liste-cards">
                {paiements.map((paiement) => (
                    <li key={paiement.id} className="card-item card-item-row">
                        <div>
                            <div className="card-item-title">
                                {paiement.montant} DT
                                <span className="card-badge">{paiement.moyen}</span>
                            </div>
                            <div className="card-item-subtitle">
                                {paiement.date}
                                {paiement.rendezVous && paiement.rendezVous.patient ? ` - Patient : ${paiement.rendezVous.patient.nom}` : ''}
                            </div>
                        </div>
                        {role === 'ADMIN' && (
                            <div className="card-item-actions">
                                <button className="btn-icon" onClick={() => ouvrirEdition(paiement)} title="Modifier">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                                <button className="btn-icon btn-icon-danger" onClick={() => handleSupprimer(paiement.id)} title="Supprimer">
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

export default PaiementPage;