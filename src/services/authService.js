import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

export function login(email, motDePasse) {
    return axios.post(`${API_URL}/login`, {
        email: email,
        motDePasse: motDePasse,
    });
}