import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface PrivateRouteProps {
  children: React.ReactNode;
  rolPermitido?: "usuario" | "administrador";
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, rolPermitido }) => {
  const { usuario, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;

  if (!usuario) return <Navigate to="/login" replace />;

  if (rolPermitido && usuario.rol !== rolPermitido) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default PrivateRoute;