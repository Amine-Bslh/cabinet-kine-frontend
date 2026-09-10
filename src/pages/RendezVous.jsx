import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { listerRendezVous, creerRendezVous, modifierRendezVous, supprimerRendezVous } from '../services/rendezVousService';
import { listerPatients } from '../services/patientService';
import Layout from '../components/Layout';
import BoutonCreer from '../components/BoutonCreer';

function RendezVousPage() {
    const [rendezVous, setRendezVous] = useState([]);
    const [patients, setPatients] = useState([]);
    const [date, setDate] = useState('');
    const [statut, setStatut] = useState('prevu');
    const [patientId, setPatientId] = useState('');
    const [formulaireOuvert, setFormulaireOuvert] = useState(false);
    const [enEdition, setEnEdition] = useState(null);

    const token = localStorage.getItem('token');
    const role = jwtDecode(token).role;

    useEffect(() => {
        charger();
        listerPatients().then((response) => setPatients(response.data));
    }, []);

    function charger() {
        listerRendezVous()
            .then((response) => setRendezVous(response.data))
            .catch((error) => console.log('Erreur :', error));
    }

    function handleCreer() {
        creerRendezVous({ date, statut, patient: { id: patientId } })
            .then(() => {
                annuler();
                charger();
            })
            .catch((error) => alert(error.response?.data?.message || 'Erreur'));
    }

    function ouvrirEdition(rdv) {
        setEnEdition(rdv);
        setDate(rdv.date);
        setStatut(rdv.statut);
        setPatientId(rdv.patient ? rdv.patient.id : '');
        setFormulaireOuvert(true);
    }

    function handleModifier() {
        modifierRendezVous(enEdition.id, { date, statut, patient: { id: patientId } })
            .then(() => {
                annuler();
                charger();
            })
            .catch((error) => alert(error.response?.data?.message || 'Erreur'));
    }

    function handleSupprimer(id) {
        if (window.confirm('Supprimer ce rendez-vous ?')) {
            supprimerRendezVous(id)
                .then(() => charger())
                .catch((error) => alert(error.response?.data?.message || 'Erreur lors de la suppression'));
        }
    }

    function annuler() {
        setEnEdition(null);
        setDate('');
        setStatut('prevu');
        setPatientId('');
        setFormulaireOuvert(false);
    }

    return (
        <Layout>
            <h1>Rendez-vous</h1>

            <div style={{ padding: '0 24px', marginBottom: '8px' }}>
                <button className="btn-ouvrir-formulaire" onClick={() => (formulaireOuvert ? annuler() : setFormulaireOuvert(true))}>
                    {formulaireOuvert ? 'Annuler' : '+ Ajouter un rendez-vous'}
                </button>
            </div>

            {formulaireOuvert && (
                <div className="form-card">
                    <div className="form-field">
                        <label>Patient</label>
                        <select value={patientId} onChange={(e) => setPatientId(e.target.value)}>
                            <option value="">-- Choisir un patient --</option>
                            {patients.map((patient) => (
                                <option key={patient.id} value={patient.id}>{patient.nom} {patient.prenom}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-field">
                        <label>Date et heure</label>
                        <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                    <div className="form-field">
                        <label>Statut</label>
                        <input type="text" placeholder="Statut" value={statut} onChange={(e) => setStatut(e.target.value)} />
                    </div>
                    <BoutonCreer onClick={enEdition ? handleModifier : handleCreer} label={enEdition ? 'Enregistrer' : 'Creer'} />
                </div>
            )}

            <h2>Liste des rendez-vous</h2>
            <ul className="liste-cards">
                {rendezVous.map((rdv) => (
                    <li key={rdv.id} className="card-item card-item-row">
                        <div>
                            <div className="card-item-title">
                                {rdv.date}
                                <span className="card-badge">{rdv.statut}</span>
                            </div>
                            <div className="card-item-subtitle">
                                {rdv.patient ? `${rdv.patient.nom} ${rdv.patient.prenom}` : ''}
                            </div>
                        </div>
                        {role === 'ADMIN' && (
                            <div className="card-item-actions">
                                <button className="btn-icon" onClick={() => ouvrirEdition(rdv)} title="Modifier">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                                <button className="btn-icon btn-icon-danger" onClick={() => handleSupprimer(rdv.id)} title="Supprimer">
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

export default RendezVousPage;