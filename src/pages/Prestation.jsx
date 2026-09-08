import { useState, useEffect } from 'react';
import { listerPrestations, creerPrestation } from '../services/prestationService';
import Menu from '../components/Menu';

function PrestationPage() {
    const [prestations, setPrestations] = useState([]);
    const [nom, setNom] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        charger();
    }, []);

    function charger() {
        listerPrestations()
            .then((response) => setPrestations(response.data))
            .catch((error) => console.log('Erreur :', error));
    }

    function handleCreer() {
        creerPrestation({ nom, description })
            .then(() => {
                setNom('');
                setDescription('');
                charger();
            })
            .catch((error) => console.log('Erreur :', error));
    }

    return (
        <div>
            <Menu />
            <h1>Prestations</h1>

            <h2>Creer une prestation</h2>
            <input
                type="text"
                placeholder="Nom (ex: Cryo)"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
            />
            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <button onClick={handleCreer}>Creer</button>

            <h2>Liste des prestations</h2>
            <ul>
                {prestations.map((prestation) => (
                    <li key={prestation.id}>
                        <b>{prestation.nom}</b> - {prestation.description}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PrestationPage;