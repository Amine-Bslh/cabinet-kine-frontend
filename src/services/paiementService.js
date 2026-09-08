import axios from 'axios';

const API_URL = 'http://localhost:8080/api/paiements';

export function listerPaiements() {
    const token = localStorage.getItem('token');
    return axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export function creerPaiement(paiement) {
    const token = localStorage.getItem('token');
    return axios.post(API_URL, paiement, {
        headers: { Authorization: `Bearer ${token}` },
    });
}