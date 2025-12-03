import React, { useEffect } from "react";

const Salir: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  useEffect(() => {
    if (onLogout) onLogout();
  }, []);

  return <p>Cerrando sesión...</p>;
};

export default Salir;