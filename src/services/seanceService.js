import axios from 'axios';

const API_URL = 'http://localhost:8080/api/seances';

export function listerSeances() {
    const token = localStorage.getItem('token');
    return axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export function creerSeance(seance) {
    const token = localStorage.getItem('token');
    return axios.post(API_URL, seance, {
        headers: { Authorization: `Bearer ${token}` },
    });


}

export function modifierSeance(id, seance) {
    const token = localStorage.getItem('token');
    return axios.put(`${API_URL}/${id}`, seance, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export function supprimerSeance(id) {
    const token = localStorage.getItem('token');
    return axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}