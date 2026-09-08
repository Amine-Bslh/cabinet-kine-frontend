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
        <div className="login-page">
            <div className="login-card">
                <h1 className="login-title">Cabinet Kine</h1>
                <p className="login-subtitle">Connectez-vous a votre espace</p>

                <div className="form-field">
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-field">
                    <label>Mot de passe</label>
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={motDePasse}
                        onChange={(e) => setMotDePasse(e.target.value)}
                    />
                </div>
                <button onClick={handleLogin} className="login-button">Se connecter</button>
            </div>
        </div>
    );
}

export default Login;