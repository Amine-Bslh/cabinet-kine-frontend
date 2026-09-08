import axios from 'axios';

const API_URL = 'http://localhost:8080/api/rendezvous';

export function listerRendezVous() {
    const token = localStorage.getItem('token');
    return axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export function creerRendezVous(rendezVous) {
    const token = localStorage.getItem('token');
    return axios.post(API_URL, rendezVous, {
        headers: { Authorization: `Bearer ${token}` },
    });
}