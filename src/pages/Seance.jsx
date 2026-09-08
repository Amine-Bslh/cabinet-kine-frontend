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
            <div className="form-card">
                <div className="form-field">
                    <label>Rendez-vous</label>
                    <select value={rendezVousId} onChange={(e) => setRendezVousId(e.target.value)}>
                        <option value="">-- Choisir un rendez-vous --</option>
                        {rendezVousListe.map((rdv) => (
                            <option key={rdv.id} value={rdv.id}>
                                {rdv.date} {rdv.patient ? `- ${rdv.patient.nom}` : ''}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-field">
                    <label>Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <div className="form-field">
                    <label>Compte-rendu</label>
                    <input
                        type="text"
                        placeholder="Compte-rendu"
                        value={compteRendu}
                        onChange={(e) => setCompteRendu(e.target.value)}
                    />
                </div>
                <button onClick={handleCreer}>Creer</button>
            </div>

            <h2>Liste des seances</h2>
            <ul className="liste-cards">
                {seances.map((seance) => (
                    <li key={seance.id} className="card-item">
                        <div className="card-item-title">{seance.date}</div>
                        <div className="card-item-subtitle">
                            {seance.compteRendu}
                            {seance.rendezVous && seance.rendezVous.patient
                                ? ` - Patient : ${seance.rendezVous.patient.nom}`
                                : ''}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SeancePage;