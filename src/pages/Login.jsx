import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {login} from '../services/authService';
import Logo from '../components/Logo';

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
                <div style={{display: 'flex', justifyContent: 'center', marginBottom: '4px'}}>
                    <Logo size={56}/>
                </div>
                <h1 className="login-title">Centre Kine Forme</h1>
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
                <button onClick={handleLogin} className="login-button">
  <span className="login-button-icon">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <rect x="4" y="11" width="16" height="9" rx="2"/>
      <path d="M8 11V7a4 4 0 0 1 8 0v4" strokeLinecap="round"/>
    </svg>
  </span>
                    <span className="login-button-text">Se connecter</span>
                </button>
            </div>
        </div>
    );
}

export default Login;