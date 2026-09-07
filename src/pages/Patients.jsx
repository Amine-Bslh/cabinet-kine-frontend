import { useState, useEffect } from 'react';
import { listerPatients } from '../services/patientService';

function Patients() {
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        listerPatients()
            .then((response) => {
                setPatients(response.data);
            })
            .catch((error) => {
                console.log('Erreur lors du chargement des patients :', error);
            });
    }, []);

    return (
        <div>
            <h1>Liste des patients</h1>
            <ul>
                {patients.map((patient) => (
                    <li key={patient.id}>
                        {patient.nom} {patient.prenom} - {patient.telephone}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Patients;