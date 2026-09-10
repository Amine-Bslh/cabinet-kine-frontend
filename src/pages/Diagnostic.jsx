import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { listerDiagnostics, creerDiagnostic, modifierDiagnostic, supprimerDiagnostic } from '../services/diagnosticService';
import { listerPatients } from '../services/patientService';
import { listerPrestations } from '../services/prestationService';
import Layout from '../components/Layout';
import BoutonCreer from '../components/BoutonCreer';

const ZONES_DISPONIBLES = [
    'Bras', 'Ventre', 'Jambes', 'Relachement', 'Surpoids',
    'Cellulite', 'Culotte de cheval', 'Retention d\'eau', 'Graisse rebelle', 'Graisse abdominale'
];

function DiagnosticPage() {
    const [diagnostics, setDiagnostics] = useState([]);
    const [patients, setPatients] = useState([]);
    const [prestations, setPrestations] = useState([]);
    const [date, setDate] = useState('');
    const [zonesSelectionnees, setZonesSelectionnees] = useState([]);
    const [prestationsSelectionnees, setPrestationsSelectionnees] = useState([]);
    const [patientId, setPatientId] = useState('');
    const [formulaireOuvert, setFormulaireOuvert] = useState(false);
    const [enEdition, setEnEdition] = useState(null);

    const token = localStorage.getItem('token');
    const role = jwtDecode(token).role;

    useEffect(() => {
        charger();
        listerPatients().then((response) => setPatients(response.data));
        listerPrestations().then((response) => setPrestations(response.data));
    }, []);

    function charger() {
        listerDiagnostics()
            .then((response) => setDiagnostics(response.data))
            .catch((error) => console.log('Erreur :', error));
    }

    function toggleZone(zone) {
        if (zonesSelectionnees.includes(zone)) {
            setZonesSelectionnees(zonesSelectionnees.filter((z) => z !== zone));
        } else {
            setZonesSelectionnees([...zonesSelectionnees, zone]);
        }
    }

    function togglePrestation(nomPrestation) {
        if (prestationsSelectionnees.includes(nomPrestation)) {
            setPrestationsSelectionnees(prestationsSelectionnees.filter((p) => p !== nomPrestation));
        } else {
            setPrestationsSelectionnees([...prestationsSelectionnees, nomPrestation]);
        }
    }

    function handleCreer() {
        creerDiagnostic({
            date,
            zonesProblematiques: zonesSelectionnees.join(', '),
            prestationsRecommandees: prestationsSelectionnees.join(', '),
            patient: { id: patientId },
        })
            .then(() => {
                annuler();
                charger();
            })
            .catch((error) => alert(error.response?.data?.message || 'Erreur'));
    }

    function ouvrirEdition(diagnostic) {
        setEnEdition(diagnostic);
        setDate(diagnostic.date);
        setZonesSelectionnees(diagnostic.zonesProblematiques ? diagnostic.zonesProblematiques.split(', ') : []);
        setPrestationsSelectionnees(diagnostic.prestationsRecommandees ? diagnostic.prestationsRecommandees.split(', ') : []);
        setPatientId(diagnostic.patient ? diagnostic.patient.id : '');
        setFormulaireOuvert(true);
    }

    function handleModifier() {
        modifierDiagnostic(enEdition.id, {
            date,
            zonesProblematiques: zonesSelectionnees.join(', '),
            prestationsRecommandees: prestationsSelectionnees.join(', '),
            patient: { id: patientId },
        })
            .then(() => {
                annuler();
                charger();
            })
            .catch((error) => alert(error.response?.data?.message || 'Erreur'));
    }

    function handleSupprimer(id) {
        if (window.confirm('Supprimer ce diagnostic ?')) {
            supprimerDiagnostic(id)
                .then(() => charger())
                .catch((error) => alert(error.response?.data?.message || 'Erreur lors de la suppression'));
        }
    }

    function annuler() {
        setEnEdition(null);
        setDate('');
        setZonesSelectionnees([]);
        setPrestationsSelectionnees([]);
        setPatientId('');
        setFormulaireOuvert(false);
    }

    return (
        <Layout>
            <h1>Diagnostics corporels</h1>

            <div style={{ padding: '0 24px', marginBottom: '8px' }}>
                <button className="btn-ouvrir-formulaire" onClick={() => (formulaireOuvert ? annuler() : setFormulaireOuvert(true))}>
                    {formulaireOuvert ? 'Annuler' : '+ Ajouter un diagnostic'}
                </button>
            </div>

            {formulaireOuvert && (
                <>
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
                            <label>Date</label>
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                        </div>
                    </div>

                    <h3>Zones problematiques</h3>
                    <div className="checkbox-grid">
                        {ZONES_DISPONIBLES.map((zone) => (
                            <label key={zone} className={`checkbox-chip ${zonesSelectionnees.includes(zone) ? 'selected' : ''}`}>
                                <input type="checkbox" checked={zonesSelectionnees.includes(zone)} onChange={() => toggleZone(zone)} />
                                {zone}
                            </label>
                        ))}
                    </div>

                    <h3>Prestations recommandees</h3>
                    <div className="checkbox-grid">
                        {prestations.map((prestation) => (
                            <label key={prestation.id} className={`checkbox-chip ${prestationsSelectionnees.includes(prestation.nom) ? 'selected' : ''}`}>
                                <input type="checkbox" checked={prestationsSelectionnees.includes(prestation.nom)} onChange={() => togglePrestation(prestation.nom)} />
                                {prestation.nom}
                            </label>
                        ))}
                    </div>

                    <div style={{ padding: '0 24px', marginBottom: '16px' }}>
                        <BoutonCreer onClick={enEdition ? handleModifier : handleCreer} label={enEdition ? 'Enregistrer' : 'Creer'} />
                    </div>
                </>
            )}

            <h2>Liste des diagnostics</h2>
            <ul className="liste-cards">
                {diagnostics.map((diagnostic) => (
                    <li key={diagnostic.id} className="card-item card-item-row">
                        <div>
                            <div className="card-item-title">{diagnostic.date}</div>
                            <div className="card-item-subtitle">
                                {diagnostic.zonesProblematiques} — {diagnostic.prestationsRecommandees}
                                {diagnostic.patient ? ` - ${diagnostic.patient.nom}` : ''}
                            </div>
                        </div>
                        {role === 'ADMIN' && (
                            <div className="card-item-actions">
                                <button className="btn-icon" onClick={() => ouvrirEdition(diagnostic)} title="Modifier">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                                <button className="btn-icon btn-icon-danger" onClick={() => handleSupprimer(diagnostic.id)} title="Supprimer">
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

export default DiagnosticPage;