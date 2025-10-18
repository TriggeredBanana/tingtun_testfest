import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import testfestLogo from '../assets/images/testfest_logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, erSuperbruker, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
  };

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
            <li><Link to="/" onClick={closeMenu}>Hjem</Link></li>
            <li><Link to="/testfester" onClick={closeMenu}>Testfester</Link></li>
            <li><Link to="/faq" onClick={closeMenu}>Spørsmål og svar</Link></li>
            <li><Link to="/metode" onClick={closeMenu}>Metode</Link></li>
            {erSuperbruker ? (
              <li><Link to="/admin" onClick={closeMenu}>Admin</Link></li>
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
                >
                  Logg ut
                </button>
              </li>
            ) : (
              <li><Link to="/login" onClick={closeMenu}>Logg inn</Link></li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;