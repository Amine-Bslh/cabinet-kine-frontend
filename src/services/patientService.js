import axios from 'axios';

const API_URL = 'http://localhost:8080/api/patients';

export function listerPatients() {
    const token = localStorage.getItem('token');

    return axios.get(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}