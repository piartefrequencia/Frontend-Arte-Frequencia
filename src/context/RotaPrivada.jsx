

import { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

function RotasPrivadas({ children, perfisPermitidos }) {
  const { isAuthenticated, user } = useContext(AuthContext);
  const location = useLocation();

  if (!isAuthenticated) 
    { return <Navigate to="/" replace state={{ from: location }} />;} 
  

  if (
    Array.isArray(perfisPermitidos) &&
    perfisPermitidos.length > 0 &&
    (!user?.perfil || !perfisPermitidos.includes(user.perfil))
  ) 
   { return <Navigate to="/" replace state={{ from: location }} />; }
  


  return children;
}

export default RotasPrivadas;