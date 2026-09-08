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
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
            />
            <input
                type="number"
                placeholder="Nombre de seances prevues"
                value={nombreSeancesPrevues}
                onChange={(e) => setNombreSeancesPrevues(e.target.value)}
            />
            <input
                type="text"
                placeholder="Statut"
                value={statut}
                onChange={(e) => setStatut(e.target.value)}
            />
            <button onClick={handleCreer}>Creer</button>

            <h2>Liste des cures</h2>
            <ul>
                {cures.map((cure) => (
                    <li key={cure.id}>
                        {cure.dateDebut} - {cure.nombreSeancesPrevues} seances - {cure.statut}
                        {cure.patient ? ` - ${cure.patient.nom}` : ''}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CurePage;