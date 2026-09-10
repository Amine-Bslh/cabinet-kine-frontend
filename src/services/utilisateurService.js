import axios from 'axios';

const API_URL = 'http://localhost:8080/api/utilisateurs';

export function listerUtilisateurs() {
    const token = localStorage.getItem('token');

    return axios.get(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export function creerUtilisateur(utilisateur) {
    const token = localStorage.getItem('token');

    return axios.post(API_URL, utilisateur, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export function modifierUtilisateur(id, utilisateur) {
    const token = localStorage.getItem('token');
    return axios.put(`${API_URL}/${id}`, utilisateur, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export function supprimerUtilisateur(id) {
    const token = localStorage.getItem('token');
    return axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}