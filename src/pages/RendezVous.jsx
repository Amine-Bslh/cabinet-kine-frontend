import { useState, useEffect } from 'react';
import { listerRendezVous, creerRendezVous } from '../services/rendezVousService';
import { listerPatients } from '../services/patientService';
import Menu from '../components/Menu';

function RendezVousPage() {
    const [rendezVous, setRendezVous] = useState([]);
    const [patients, setPatients] = useState([]);
    const [date, setDate] = useState('');
    const [statut, setStatut] = useState('prevu');
    const [patientId, setPatientId] = useState('');

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
        creerRendezVous({
            date,
            statut,
            patient: { id: patientId },
        })
            .then(() => {
                setDate('');
                setStatut('prevu');
                setPatientId('');
                charger();
            })
            .catch((error) => console.log('Erreur :', error));
    }

    return (
        <div>
            <Menu />
            <h1>Rendez-vous</h1>

            <h2>Creer un rendez-vous</h2>
            <select value={patientId} onChange={(e) => setPatientId(e.target.value)}>
                <option value="">-- Choisir un patient --</option>
                {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                        {patient.nom} {patient.prenom}
                    </option>
                ))}
            </select>
            <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
            <input
                type="text"
                placeholder="Statut"
                value={statut}
                onChange={(e) => setStatut(e.target.value)}
            />
            <button onClick={handleCreer}>Creer</button>

            <h2>Liste des rendez-vous</h2>
            <ul>
                {rendezVous.map((rdv) => (
                    <li key={rdv.id}>
                        {rdv.date} - {rdv.statut} {rdv.patient ? `- ${rdv.patient.nom}` : ''}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RendezVousPage;