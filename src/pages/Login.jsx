import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

function Login() {
    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const navigate = useNavigate();

    function handleLogin() {
        login(email, motDePasse)
            .then((response) => {
                localStorage.setItem('token', response.data);
                navigate('/patients');
            })
            .catch((error) => {
                console.log('Erreur de connexion :', error);
            });
    }

    return (
        <div>
            <h1>Connexion</h1>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Mot de passe"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
            />
            <button onClick={handleLogin}>Se connecter</button>
        </div>
    );
}

export default Login;