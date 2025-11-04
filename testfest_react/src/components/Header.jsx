import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import testfestLogo from '../assets/images/testfest_logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, ErSuperbruker, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // Veksle menyen for mobil
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Lukk menyen etter navigasjon
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Håndter utlogging
  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');

  };

  // Bytt språk mellom norsk og engelsk (én knapp som toggler)
  const isNorwegian = () => {
    const lng = i18n.language || '';
    return lng.startsWith('no') || lng.startsWith('nb');
  };

  const toggleLanguage = () => {
    const next = isNorwegian() ? 'en' : 'no';
    i18n.changeLanguage(next);
  };
  
  if (isLoading) {
    return <header>Laster...</header>; // eller null
  }
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo-img">
            <Link to="/" onClick={closeMenu}>
              <img src={testfestLogo} alt="Testfest" style={{maxWidth:'200px', height:'auto'}} />
            </Link>
          </div>
          <button 
            className="menu-toggle" 
            aria-expanded={isMenuOpen} 
            aria-label="Åpne navigasjonsmeny"
            onClick={toggleMenu}
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
          <ul className={`menu ${isMenuOpen ? 'active' : ''}`}>
            <li><Link to="/" onClick={closeMenu}>{t('nav.home')}</Link></li>
            <li><Link to="/testfester" onClick={closeMenu}>{t('nav.testfester')}</Link></li>
            <li><Link to="/faq" onClick={closeMenu}>{t('nav.faq')}</Link></li>
            <li><Link to="/metode" onClick={closeMenu}>{t('nav.metode')}</Link></li>
            {ErSuperbruker ? (
              <li><Link to="/admin" onClick={closeMenu}>{t('nav.admin')}</Link></li>
            ) : null}
            {isAuthenticated ? (
              <li>
                <button 
                  onClick={handleLogout}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '1rem 1.5rem',
                    cursor: 'pointer',
                    color: 'inherit',
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    width: '100%',
                    textAlign: 'left'
                  }}
                  aria-label={t('nav.logout')}
                >
                  {t('nav.logout')}
                </button>
              </li>
            ) : (
              <li><Link to="/login" onClick={closeMenu}>{t('nav.login')}</Link></li>
            )}
            {/* Enkel språkvelger */}
            <li>
              <div style={{ padding: '0.5rem 1rem' }}>
                <button
                  className="lang-toggle-btn"
                  onClick={toggleLanguage}
                  aria-label={isNorwegian() ? t('nav.lang_en') : t('nav.lang_no')}
                >{isNorwegian() ? 'NO' : 'EN'}</button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;