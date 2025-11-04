import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ErSuperbruker, setErSuperbruker] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);


  // Kjør ved oppstart
useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await fetch("http://localhost:8800/brukere/verify", {
        credentials: "include", // send med cookies
      });
      const data = await res.json();
      if (res.ok && data.authenticated) {
        setIsAuthenticated(true);
        setErSuperbruker(Boolean(data.bruker?.ErSuperbruker));
        setCurrentUser(data.bruker);
      } else {
        setIsAuthenticated(false);
        setErSuperbruker(false);
        setCurrentUser(null);
      }
    } catch (err) {
      console.error("Feil ved verify:", err);
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  };
  checkAuth();
}, []);

const login = async (brukernavn, passord) => {
  try {
    const res = await fetch("http://localhost:8800/brukere/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", 
      body: JSON.stringify({ brukernavn, passord }),
    });

    const data = await res.json();
    
    if (res.ok && data.success) {
      setIsAuthenticated(true);
      setErSuperbruker(Boolean(data.bruker?.ErSuperbruker));
      setCurrentUser(data.bruker);
      return { success: true };
    } else {
      return { success: false, message: data.message || "Feil brukernavn/passord" };
    }
  } catch (err) {
    console.error("Login-feil:", err);
    return { success: false, message: "Serverfeil" };
  }
};


  const logout = async () => {
    await axios.post("http://localhost:8800/brukere/logout"); // Du kan lage en logout-route som sletter cookien
    setIsAuthenticated(false);
    setErSuperbruker(false);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        ErSuperbruker,
        currentUser,
        authLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
