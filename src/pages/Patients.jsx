import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { listerPatients, creerPatient, modifierPatient, supprimerPatient } from '../services/patientService';
import Layout from '../components/Layout';
import BoutonCreer from '../components/BoutonCreer';

function Patients() {
    const [patients, setPatients] = useState([]);
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [telephone, setTelephone] = useState('');
    const [formulaireOuvert, setFormulaireOuvert] = useState(false);
    const [patientEnEdition, setPatientEnEdition] = useState(null);

    const token = localStorage.getItem('token');
    const role = jwtDecode(token).role;

    useEffect(() => {
        charger();
    }, []);

    function charger() {
        listerPatients()
            .then((response) => setPatients(response.data))
            .catch((error) => console.log('Erreur lors du chargement des patients :', error));
    }

    function handleCreer() {
        creerPatient({ nom, prenom, telephone })
            .then(() => {
                setNom('');
                setPrenom('');
                setTelephone('');
                setFormulaireOuvert(false);
                charger();
            })
            .catch((error) => console.log('Erreur :', error));
    }

    function ouvrirEdition(patient) {
        setPatientEnEdition(patient);
        setNom(patient.nom);
        setPrenom(patient.prenom);
        setTelephone(patient.telephone);
        setFormulaireOuvert(true);
    }

    function handleModifier() {
        modifierPatient(patientEnEdition.id, { nom, prenom, telephone })
            .then(() => {
                setPatientEnEdition(null);
                setNom('');
                setPrenom('');
                setTelephone('');
                setFormulaireOuvert(false);
                charger();
            })
            .catch((error) => console.log('Erreur :', error));
    }

    function handleSupprimer(id) {
        if (window.confirm('Supprimer ce patient ?')) {
            supprimerPatient(id)
                .then(() => charger())
                .catch((error) => {
                    const message = error.response?.data?.message || 'Erreur lors de la suppression';
                    alert(message);
                });
        }
    }

    function annuler() {
        setPatientEnEdition(null);
        setNom('');
        setPrenom('');
        setTelephone('');
        setFormulaireOuvert(false);
    }

    return (
        <Layout>
            <h1>Patients</h1>

            <div style={{ padding: '0 24px', marginBottom: '8px' }}>
                <button className="btn-ouvrir-formulaire" onClick={() => (formulaireOuvert ? annuler() : setFormulaireOuvert(true))}>
                    {formulaireOuvert ? 'Annuler' : '+ Ajouter un patient'}
                </button>
            </div>

            {formulaireOuvert && (
                <div className="form-card">
                    <div className="form-field">
                        <label>Nom</label>
                        <input type="text" placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} />
                    </div>
                    <div className="form-field">
                        <label>Prenom</label>
                        <input type="text" placeholder="Prenom" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
                    </div>
                    <div className="form-field">
                        <label>Telephone</label>
                        <input type="text" placeholder="Telephone" value={telephone} onChange={(e) => setTelephone(e.target.value)} />
                    </div>
                    <BoutonCreer
                        onClick={patientEnEdition ? handleModifier : handleCreer}
                        label={patientEnEdition ? 'Enregistrer' : 'Creer'}
                    />
                </div>
            )}

            <h2>Liste des patients</h2>
            <ul className="liste-cards">
                {patients.map((patient) => (
                    <li key={patient.id} className="card-item card-item-row">
                        <div>
                            <div className="card-item-title">{patient.nom} {patient.prenom}</div>
                            <div className="card-item-subtitle">{patient.telephone}</div>
                        </div>
                        {role === 'ADMIN' && (
                            <div className="card-item-actions">
                                <button className="btn-icon" onClick={() => ouvrirEdition(patient)} title="Modifier">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                                <button className="btn-icon btn-icon-danger" onClick={() => handleSupprimer(patient.id)} title="Supprimer">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </Layout>
    );
}

export default Patients;