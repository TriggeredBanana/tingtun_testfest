import { useState } from 'react';
import { Link } from 'react-router-dom';
import testfestLogo from '../assets/images/testfest_logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
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
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;