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

export function modifierPaiement(id, paiement) {
    const token = localStorage.getItem('token');
    return axios.put(`${API_URL}/${id}`, paiement, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export function supprimerPaiement(id) {
    const token = localStorage.getItem('token');
    return axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}