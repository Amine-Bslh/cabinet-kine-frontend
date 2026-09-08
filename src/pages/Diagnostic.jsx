import { useState, useEffect } from 'react';
import { listerDiagnostics, creerDiagnostic } from '../services/diagnosticService';
import { listerPatients } from '../services/patientService';
import { listerPrestations } from '../services/prestationService';
import Menu from '../components/Menu';

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
                setDate('');
                setZonesSelectionnees([]);
                setPrestationsSelectionnees([]);
                setPatientId('');
                charger();
            })
            .catch((error) => console.log('Erreur :', error));
    }

    return (
        <div>
            <Menu />
            <h1>Diagnostics corporels</h1>

            <h2>Creer un diagnostic</h2>
            <select value={patientId} onChange={(e) => setPatientId(e.target.value)}>
                <option value="">-- Choisir un patient --</option>
                {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                        {patient.nom} {patient.prenom}
                    </option>
                ))}
            </select>
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />

            <h3>Zones problematiques</h3>
            <div className="checkbox-grid">
                {ZONES_DISPONIBLES.map((zone) => (
                    <label
                        key={zone}
                        className={`checkbox-chip ${zonesSelectionnees.includes(zone) ? 'selected' : ''}`}
                    >
                        <input
                            type="checkbox"
                            checked={zonesSelectionnees.includes(zone)}
                            onChange={() => toggleZone(zone)}
                        />
                        {zone}
                    </label>
                ))}
            </div>

            <h3>Prestations recommandees</h3>
            <div className="checkbox-grid">
                {prestations.map((prestation) => (
                    <label
                        key={prestation.id}
                        className={`checkbox-chip ${prestationsSelectionnees.includes(prestation.nom) ? 'selected' : ''}`}
                    >
                        <input
                            type="checkbox"
                            checked={prestationsSelectionnees.includes(prestation.nom)}
                            onChange={() => togglePrestation(prestation.nom)}
                        />
                        {prestation.nom}
                    </label>
                ))}
            </div>

            <button onClick={handleCreer}>Creer</button>

            <h2>Liste des diagnostics</h2>
            <ul>
                {diagnostics.map((diagnostic) => (
                    <li key={diagnostic.id}>
                        {diagnostic.date} - {diagnostic.zonesProblematiques} - {diagnostic.prestationsRecommandees}
                        {diagnostic.patient ? ` - ${diagnostic.patient.nom}` : ''}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DiagnosticPage;