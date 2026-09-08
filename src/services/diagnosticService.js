import axios from 'axios';

const API_URL = 'http://localhost:8080/api/diagnostics';

export function listerDiagnostics() {
    const token = localStorage.getItem('token');
    return axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export function creerDiagnostic(diagnostic) {
    const token = localStorage.getItem('token');
    return axios.post(API_URL, diagnostic, {
        headers: { Authorization: `Bearer ${token}` },
    });
}