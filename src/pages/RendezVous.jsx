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
            <div className="form-card">
                <div className="form-field">
                    <label>Patient</label>
                    <select value={patientId} onChange={(e) => setPatientId(e.target.value)}>
                        <option value="">-- Choisir un patient --</option>
                        {patients.map((patient) => (
                            <option key={patient.id} value={patient.id}>
                                {patient.nom} {patient.prenom}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-field">
                    <label>Date et heure</label>
                    <input
                        type="datetime-local"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <div className="form-field">
                    <label>Statut</label>
                    <input
                        type="text"
                        placeholder="Statut"
                        value={statut}
                        onChange={(e) => setStatut(e.target.value)}
                    />
                </div>
                <button onClick={handleCreer}>Creer</button>
            </div>

            <h2>Liste des rendez-vous</h2>
            <ul className="liste-cards">
                {rendezVous.map((rdv) => (
                    <li key={rdv.id} className="card-item">
                        <div className="card-item-title">
                            {rdv.date}
                            <span className="card-badge">{rdv.statut}</span>
                        </div>
                        <div className="card-item-subtitle">
                            {rdv.patient ? `${rdv.patient.nom} ${rdv.patient.prenom}` : ''}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RendezVousPage;