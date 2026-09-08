import axios from 'axios';

const API_URL = 'http://localhost:8080/api/prestations';

export function listerPrestations() {
    const token = localStorage.getItem('token');
    return axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export function creerPrestation(prestation) {
    const token = localStorage.getItem('token');
    return axios.post(API_URL, prestation, {
        headers: { Authorization: `Bearer ${token}` },
    });
}