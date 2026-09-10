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

export function modifierRendezVous(id, rendezVous) {
    const token = localStorage.getItem('token');
    return axios.put(`${API_URL}/${id}`, rendezVous, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export function supprimerRendezVous(id) {
    const token = localStorage.getItem('token');
    return axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}