import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

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
      setError(t('login.error_required'));
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
          <h1>{t('login.title')}</h1>
          <p className="login-subtitle">{t('login.subtitle')}</p>

          {error && (
            <div className="error-banner" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="brukernavn">{t('login.username_label')}</label>
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
              <label htmlFor="passord">{t('login.password_label')}</label>
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
              {isLoading ? t('login.loading') : t('login.submit')}
            </button>
          </form>

          <div className="login-info">
            <h3>{t('login.info_title')}</h3>
            <p>
              {t('login.info_text')}
              <br></br> <br></br>
              {t('home.contact_phone_label')} 918 62 892 <br></br>
              {t('home.contact_email_label')} contact@tingtun.no
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
