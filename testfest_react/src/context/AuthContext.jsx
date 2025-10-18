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
  const [isSuperUser, setIsSuperUser] = useState(false);
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
      setIsSuperUser(true);
    }
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  const login = async (username, password) => {
    try {
      // Kall backend API for autentisering
      const response = await loginUserAPI(username, password);
      
      if (response.success) {
        const { user } = response;
        
        setIsAuthenticated(true);
        setIsSuperUser(user.isSuperUser);
        setCurrentUser(user);
        
        localStorage.setItem('testfest_auth', 'true');
        localStorage.setItem('testfest_superuser', user.isSuperUser.toString());
        localStorage.setItem('testfest_user', JSON.stringify(user));
        
        return { success: true, isSuperUser: user.isSuperUser };
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
    setIsSuperUser(false);
    setCurrentUser(null);
    localStorage.removeItem('testfest_auth');
    localStorage.removeItem('testfest_superuser');
    localStorage.removeItem('testfest_user');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isSuperUser, 
      currentUser,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};