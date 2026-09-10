import axios from 'axios';

const API_URL = 'http://localhost:8080/api/patients';

export function listerPatients() {
    const token = localStorage.getItem('token');

    return axios.get(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export function creerPatient(patient) {
    const token = localStorage.getItem('token');

    return axios.post(API_URL, patient, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export function modifierPatient(id, patient) {
    const token = localStorage.getItem('token');

    return axios.put(`${API_URL}/${id}`, patient, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export function supprimerPatient(id) {
    const token = localStorage.getItem('token');

    return axios.delete(`${API_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}