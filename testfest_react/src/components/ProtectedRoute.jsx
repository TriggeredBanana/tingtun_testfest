import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireSuperUser = false }) => {
  const { isAuthenticated, ErSuperbruker, authLoading } = useAuth();

  console.log("ProtectedRoute:", { isAuthenticated, ErSuperbruker, authLoading, requireSuperUser });

  if (authLoading) {
    return <div>Laster...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireSuperUser && !ErSuperbruker) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;