import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireSuperUser = false }) => {
  const { isAuthenticated, isSuperUser } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireSuperUser && !isSuperUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
