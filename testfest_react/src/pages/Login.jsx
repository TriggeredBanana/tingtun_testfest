import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../assets/styles/login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    brukernavn: '',
    passord: ''
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

    if (!formData.brukernavn || !formData.passord) {
      setError('Vennligst fyll inn både brukernavn og passord');
      setIsLoading(false);
      return;
    }

    const result = await login(formData.brukernavn, formData.passord);

    if (result.success) {
      if (result.erSuperbruker) {
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
              <label htmlFor="brukernavn">Brukernavn</label>
              <input
                type="text"
                id="brukernavn"
                name="brukernavn"
                value={formData.brukernavn}
                onChange={handleInputChange}
                autoComplete="username"
                autoFocus
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="passord">Passord</label>
              <input
                type="password"
                id="passord"
                name="passord"
                value={formData.passord}
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
