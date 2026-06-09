import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Navigate, useLocation } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactNode;
  perfisPermitidos?: string[];
}

export default function PrivateRoute({ children, perfisPermitidos }: PrivateRouteProps) {
  const { isAuthenticated, user } = useContext(AuthContext);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (
    Array.isArray(perfisPermitidos) &&
    perfisPermitidos.length > 0 &&
    (!user?.perfil || !perfisPermitidos.includes(user.perfil))
  ) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
