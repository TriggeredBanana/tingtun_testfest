import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../assets/styles/login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.username || !formData.password) {
      setError('Vennligst fyll inn både brukernavn og passord');
      setIsLoading(false);
      return;
    }

    const result = login(formData.username, formData.password);

    if (result.success) {
      if (result.isSuperUser) {
        navigate('/admin');
      } else {
        navigate('/testfester');
      }
    } else {
      setError(result.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="container main-content">
      <div className="login-container">
        <div className="login-box">
          <h1>Logg inn</h1>
          <p className="login-subtitle">Logg inn for å få tilgang til administrasjonspanelet</p>

          {error && (
            <div className="error-banner" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Brukernavn</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                autoComplete="username"
                autoFocus
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Passord</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                autoComplete="current-password"
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-full-width"
              disabled={isLoading}
            >
              {isLoading ? 'Logger inn...' : 'Logg inn'}
            </button>
          </form>

          <div className="login-info">
            <h3>Standard påloggingsinformasjon</h3>
            <p><strong>Superbruker:</strong></p>
            <ul>
              <li>Brukernavn: <code>admin</code></li>
              <li>Passord: <code>admin123</code></li>
            </ul>
            <p className="info-note">
              <strong>Viktig:</strong> Dette er en demo :)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
