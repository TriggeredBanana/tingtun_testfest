import { createContext, useContext, useState, useEffect } from 'react';

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

  // Check authentication status on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('testfest_auth');
    const superUserStatus = localStorage.getItem('testfest_superuser');
    
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    if (superUserStatus === 'true') {
      setIsSuperUser(true);
    }
  }, []);

  const login = (username, password) => {
    // Super user credentials (in production, this should be handled by backend)
    const SUPER_USER = {
      username: 'admin',
      password: 'admin123' // This should be changed and stored securely
    };

    if (username === SUPER_USER.username && password === SUPER_USER.password) {
      setIsAuthenticated(true);
      setIsSuperUser(true);
      localStorage.setItem('testfest_auth', 'true');
      localStorage.setItem('testfest_superuser', 'true');
      return { success: true, isSuperUser: true };
    }

    // Check regular users
    const users = JSON.parse(localStorage.getItem('testfest_users') || '[]');
    const user = users.find(u => u.id === username && u.password === password);

    if (user) {
      setIsAuthenticated(true);
      setIsSuperUser(false);
      localStorage.setItem('testfest_auth', 'true');
      localStorage.setItem('testfest_superuser', 'false');
      return { success: true, isSuperUser: false };
    }

    return { success: false, message: 'Ugyldig brukernavn eller passord' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsSuperUser(false);
    localStorage.removeItem('testfest_auth');
    localStorage.removeItem('testfest_superuser');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isSuperUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
