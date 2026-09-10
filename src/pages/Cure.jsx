import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { listerCures, creerCure, modifierCure, supprimerCure } from '../services/cureService';
import { listerPatients } from '../services/patientService';
import Layout from '../components/Layout';
import BoutonCreer from '../components/BoutonCreer';

function CurePage() {
    const [cures, setCures] = useState([]);
    const [patients, setPatients] = useState([]);
    const [dateDebut, setDateDebut] = useState('');
    const [nombreSeancesPrevues, setNombreSeancesPrevues] = useState('');
    const [statut, setStatut] = useState('en cours');
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
        listerCures()
            .then((response) => setCures(response.data))
            .catch((error) => console.log('Erreur :', error));
    }

    function handleCreer() {
        creerCure({ dateDebut, nombreSeancesPrevues, statut, patient: { id: patientId } })
            .then(() => {
                annuler();
                charger();
            })
            .catch((error) => alert(error.response?.data?.message || 'Erreur'));
    }

    function ouvrirEdition(cure) {
        setEnEdition(cure);
        setDateDebut(cure.dateDebut);
        setNombreSeancesPrevues(cure.nombreSeancesPrevues);
        setStatut(cure.statut);
        setPatientId(cure.patient ? cure.patient.id : '');
        setFormulaireOuvert(true);
    }

    function handleModifier() {
        modifierCure(enEdition.id, { dateDebut, nombreSeancesPrevues, statut, patient: { id: patientId } })
            .then(() => {
                annuler();
                charger();
            })
            .catch((error) => alert(error.response?.data?.message || 'Erreur'));
    }

    function handleSupprimer(id) {
        if (window.confirm('Supprimer cette cure ?')) {
            supprimerCure(id)
                .then(() => charger())
                .catch((error) => alert(error.response?.data?.message || 'Erreur lors de la suppression'));
        }
    }

    function annuler() {
        setEnEdition(null);
        setDateDebut('');
        setNombreSeancesPrevues('');
        setStatut('en cours');
        setPatientId('');
        setFormulaireOuvert(false);
    }

    return (
        <Layout>
            <h1>Cures</h1>

            <div style={{ padding: '0 24px', marginBottom: '8px' }}>
                <button className="btn-ouvrir-formulaire" onClick={() => (formulaireOuvert ? annuler() : setFormulaireOuvert(true))}>
                    {formulaireOuvert ? 'Annuler' : '+ Ajouter une cure'}
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
                        <label>Date de debut</label>
                        <input type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} />
                    </div>
                    <div className="form-field">
                        <label>Nb. seances prevues</label>
                        <input type="number" placeholder="Ex: 10" value={nombreSeancesPrevues} onChange={(e) => setNombreSeancesPrevues(e.target.value)} />
                    </div>
                    <div className="form-field">
                        <label>Statut</label>
                        <select value={statut} onChange={(e) => setStatut(e.target.value)}>
                            <option value="en cours">En cours</option>
                            <option value="terminee">Terminee</option>
                            <option value="annulee">Annulee</option>
                        </select>
                    </div>
                    <BoutonCreer onClick={enEdition ? handleModifier : handleCreer} label={enEdition ? 'Enregistrer' : 'Creer'} />
                </div>
            )}

            <h2>Liste des cures</h2>
            <ul className="liste-cards">
                {cures.map((cure) => (
                    <li key={cure.id} className="card-item card-item-row">
                        <div>
                            <div className="card-item-title">
                                {cure.dateDebut}
                                <span className="card-badge">{cure.statut}</span>
                            </div>
                            <div className="card-item-subtitle">
                                {cure.nombreSeancesPrevues} seances prevues
                                {cure.patient ? ` - ${cure.patient.nom}` : ''}
                            </div>
                        </div>
                        {role === 'ADMIN' && (
                            <div className="card-item-actions">
                                <button className="btn-icon" onClick={() => ouvrirEdition(cure)} title="Modifier">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                                <button className="btn-icon btn-icon-danger" onClick={() => handleSupprimer(cure.id)} title="Supprimer">
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

export default CurePage;