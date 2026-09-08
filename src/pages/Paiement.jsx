import { useState, useEffect } from 'react';
import { listerPaiements, creerPaiement } from '../services/paiementService';
import { listerRendezVous } from '../services/rendezVousService';
import Menu from '../components/Menu';

function PaiementPage() {
    const [paiements, setPaiements] = useState([]);
    const [rendezVousListe, setRendezVousListe] = useState([]);
    const [montant, setMontant] = useState('');
    const [moyen, setMoyen] = useState('especes');
    const [date, setDate] = useState('');
    const [rendezVousId, setRendezVousId] = useState('');

    useEffect(() => {
        charger();
        listerRendezVous().then((response) => setRendezVousListe(response.data));
    }, []);

    function charger() {
        listerPaiements()
            .then((response) => setPaiements(response.data))
            .catch((error) => console.log('Erreur :', error));
    }

    function handleCreer() {
        creerPaiement({
            montant,
            moyen,
            date,
            rendezVous: { id: rendezVousId },
        })
            .then(() => {
                setMontant('');
                setMoyen('especes');
                setDate('');
                setRendezVousId('');
                charger();
            })
            .catch((error) => console.log('Erreur :', error));
    }

    return (
        <div>
            <Menu />
            <h1>Paiements</h1>

            <h2>Creer un paiement</h2>
            <select value={rendezVousId} onChange={(e) => setRendezVousId(e.target.value)}>
                <option value="">-- Choisir un rendez-vous --</option>
                {rendezVousListe.map((rdv) => (
                    <option key={rdv.id} value={rdv.id}>
                        {rdv.date} {rdv.patient ? `- ${rdv.patient.nom}` : ''}
                    </option>
                ))}
            </select>
            <input
                type="number"
                placeholder="Montant"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
            />
            <select value={moyen} onChange={(e) => setMoyen(e.target.value)}>
                <option value="especes">Especes</option>
                <option value="carte">Carte</option>
                <option value="cheque">Cheque</option>
            </select>
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
            <button onClick={handleCreer}>Creer</button>

            <h2>Liste des paiements</h2>
            <ul>
                {paiements.map((paiement) => (
                    <li key={paiement.id}>
                        {paiement.montant} DT - {paiement.moyen} - {paiement.date}
                        {paiement.rendezVous && paiement.rendezVous.patient
                            ? ` - Patient : ${paiement.rendezVous.patient.nom}`
                            : ''}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PaiementPage;