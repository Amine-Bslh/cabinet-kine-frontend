import { useState, useEffect } from 'react';
import { listerSeances, creerSeance } from '../services/seanceService';
import { listerRendezVous } from '../services/rendezVousService';
import Menu from '../components/Menu';

function SeancePage() {
    const [seances, setSeances] = useState([]);
    const [rendezVousListe, setRendezVousListe] = useState([]);
    const [date, setDate] = useState('');
    const [compteRendu, setCompteRendu] = useState('');
    const [rendezVousId, setRendezVousId] = useState('');

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
        creerSeance({
            date,
            compteRendu,
            rendezVous: { id: rendezVousId },
        })
            .then(() => {
                setDate('');
                setCompteRendu('');
                setRendezVousId('');
                charger();
            })
            .catch((error) => console.log('Erreur :', error));
    }

    return (
        <div>
            <Menu />
            <h1>Seances</h1>

            <h2>Creer une seance</h2>
            <select value={rendezVousId} onChange={(e) => setRendezVousId(e.target.value)}>
                <option value="">-- Choisir un rendez-vous --</option>
                {rendezVousListe.map((rdv) => (
                    <option key={rdv.id} value={rdv.id}>
                        {rdv.date} {rdv.patient ? `- ${rdv.patient.nom}` : ''}
                    </option>
                ))}
            </select>
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
            <input
                type="text"
                placeholder="Compte-rendu"
                value={compteRendu}
                onChange={(e) => setCompteRendu(e.target.value)}
            />
            <button onClick={handleCreer}>Creer</button>

            <h2>Liste des seances</h2>
            <ul>
                {seances.map((seance) => (
                    <li key={seance.id}>
                        {seance.date} - {seance.compteRendu}
                        {seance.rendezVous && seance.rendezVous.patient
                            ? ` - Patient : ${seance.rendezVous.patient.nom}`
                            : ''}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SeancePage;