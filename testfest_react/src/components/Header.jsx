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

  // Toggle menu for mobile
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu after navigation
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');

  };

  // Switch language between Norwegian and English (one button toggle)
  const isNorwegian = () => {
    const lng = i18n.language || '';
    return lng.startsWith('no') || lng.startsWith('nb');
  };

  const toggleLanguage = () => {
    const next = isNorwegian() ? 'en' : 'no';
    i18n.changeLanguage(next);
  };
  
  if (isLoading) {
    return <header>Laster...</header>; // or null
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
            <li><Link to="/veiledning" onClick={closeMenu}>{t('nav.veiledning')}</Link></li>
            {ErSuperbruker ? (
              <li><Link to="/admin" onClick={closeMenu}>{t('nav.admin')}</Link></li>
            ) : null}
            {isAuthenticated ? (
              <li>
                <button 
                  className="logout-btn"
                  onClick={handleLogout}
                  aria-label={t('nav.logout')}
                >
                  {t('nav.logout')}
                </button>
              </li>
            ) : (
              <li><Link to="/login" onClick={closeMenu}>{t('nav.login')}</Link></li>
            )}
            {/* Simple language selector */}
            <li>
              <button
                className="lang-toggle-btn"
                onClick={toggleLanguage}
                aria-label={isNorwegian() ? t('nav.lang_en') : t('nav.lang_no')}
              >{isNorwegian() ? 'NO' : 'EN'}</button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;