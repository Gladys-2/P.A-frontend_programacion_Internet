import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Salir: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={container}>
      <h1 style={title}>Hasta pronto</h1>
      <p style={subtitle}>
        Gracias por visitar nuestra web. Tu sesión se ha cerrado correctamente.
      </p>
      <p style={info}>
        Serás redirigido al inicio de sesión en unos segundos. ¡Esperamos verte de nuevo pronto!
      </p>
    </div>
  );
};

const container: React.CSSProperties = {
  padding: "50px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#f9faff",
  minHeight: "100vh",
  textAlign: "center",
};

const title: React.CSSProperties = {
  fontSize: "36px",
  fontWeight: 700,
  color: "#137497",
  marginBottom: "20px",
};

const subtitle: React.CSSProperties = {
  fontSize: "18px",
  color: "#555",
  marginBottom: "10px",
};

const info: React.CSSProperties = {
  fontSize: "16px",
  color: "#888",
};

export default Salir;