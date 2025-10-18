import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser as loginUserAPI } from '../services/brukerService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [erSuperbruker, setErSuperbruker] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Sjekk autentiseringsstatus ved montering
  useEffect(() => {
    const authStatus = localStorage.getItem('testfest_auth');
    const superUserStatus = localStorage.getItem('testfest_superuser');
    const userData = localStorage.getItem('testfest_user');
    
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    if (superUserStatus === 'true') {
      setErSuperbruker(true);
    }
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  const login = async (brukernavn, passord) => {
    try {
      // Kall backend API for autentisering
      const response = await loginUserAPI(brukernavn, passord);
      
      if (response.success) {
        const { bruker } = response;
        
        setIsAuthenticated(true);
        setErSuperbruker(bruker.erSuperbruker);
        setCurrentUser(bruker);
        
        localStorage.setItem('testfest_auth', 'true');
        localStorage.setItem('testfest_superuser', bruker.erSuperbruker.toString());
        localStorage.setItem('testfest_user', JSON.stringify(bruker));
        
        return { success: true, erSuperbruker: bruker.erSuperbruker };
      }
      
      return { success: false, message: 'Login feilet' };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.message || 'Ugyldig brukernavn eller passord' 
      };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setErSuperbruker(false);
    setCurrentUser(null);
    localStorage.removeItem('testfest_auth');
    localStorage.removeItem('testfest_superuser');
    localStorage.removeItem('testfest_user');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      erSuperbruker, 
      currentUser,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};