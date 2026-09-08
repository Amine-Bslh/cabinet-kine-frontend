import { useState, useEffect } from 'react';
import { listerCures, creerCure } from '../services/cureService';
import { listerPatients } from '../services/patientService';
import Menu from '../components/Menu';

function CurePage() {
    const [cures, setCures] = useState([]);
    const [patients, setPatients] = useState([]);
    const [dateDebut, setDateDebut] = useState('');
    const [nombreSeancesPrevues, setNombreSeancesPrevues] = useState('');
    const [statut, setStatut] = useState('en cours');
    const [patientId, setPatientId] = useState('');

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
        creerCure({
            dateDebut,
            nombreSeancesPrevues,
            statut,
            patient: { id: patientId },
        })
            .then(() => {
                setDateDebut('');
                setNombreSeancesPrevues('');
                setStatut('en cours');
                setPatientId('');
                charger();
            })
            .catch((error) => console.log('Erreur :', error));
    }

    return (
        <div>
            <Menu />
            <h1>Cures</h1>

            <h2>Creer une cure</h2>
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
                    <label>Date de debut</label>
                    <input
                        type="date"
                        value={dateDebut}
                        onChange={(e) => setDateDebut(e.target.value)}
                    />
                </div>
                <div className="form-field">
                    <label>Nb. seances prevues</label>
                    <input
                        type="number"
                        placeholder="Ex: 10"
                        value={nombreSeancesPrevues}
                        onChange={(e) => setNombreSeancesPrevues(e.target.value)}
                    />
                </div>
                <div className="form-field">
                    <label>Statut</label>
                    <select value={statut} onChange={(e) => setStatut(e.target.value)}>
                        <option value="en cours">En cours</option>
                        <option value="terminee">Terminee</option>
                        <option value="annulee">Annulee</option>
                    </select>
                </div>
                <button onClick={handleCreer}>Creer</button>
            </div>

            <h2>Liste des cures</h2>
            <ul className="liste-cards">
                {cures.map((cure) => (
                    <li key={cure.id} className="card-item">
                        <div className="card-item-title">
                            {cure.dateDebut}
                            <span className="card-badge">{cure.statut}</span>
                        </div>
                        <div className="card-item-subtitle">
                            {cure.nombreSeancesPrevues} seances prevues
                            {cure.patient ? ` - ${cure.patient.nom}` : ''}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CurePage;