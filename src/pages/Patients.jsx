import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { listerPatients } from '../services/patientService';

function Patients() {
    const [patients, setPatients] = useState([]);

    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const role = decoded.role;

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
            <p>Connecte en tant que : {role}</p>

            {role === 'ADMIN' && (
                <button>Gestion des utilisateurs</button>
            )}

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