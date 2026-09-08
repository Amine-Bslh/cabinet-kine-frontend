import axios from 'axios';

const API_URL = 'http://localhost:8080/api/cures';

export function listerCures() {
    const token = localStorage.getItem('token');
    return axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export function creerCure(cure) {
    const token = localStorage.getItem('token');
    return axios.post(API_URL, cure, {
        headers: { Authorization: `Bearer ${token}` },
    });
}