import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useLayoutEffect } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import FAQ from './pages/FAQ';
import Veiledning from './pages/Veiledning';
import Testfester from './pages/Testfester';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import TestfestDetaljer from './pages/TestfestDetaljer';
import AddTestfester from './pages/AddTestfester';

import './assets/styles/styles.css';
import './assets/styles/index.css';

// Start at the top when changing pages
const Wrapper = ({ children }) => {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Wrapper>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/testfester" element={<Testfester />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/veiledning" element={<Veiledning />} /> 
            <Route path="/login" element={<Login />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireSuperUser={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/testfester/:TestfestID" element={<TestfestDetaljer />} />
            <Route path="/addTestfester" element={<AddTestfester />} />
            <Route path="/addTestfester/:TestfestID" element={<AddTestfester />} />
          </Routes>
        </div>
        </Wrapper>
      </Router>
    </AuthProvider>
  );
}

export default App;