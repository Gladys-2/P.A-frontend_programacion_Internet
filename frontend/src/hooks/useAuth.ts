import { useState, useEffect } from "react";
import type { Usuario } from "../types/types";

export const useAuth = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol") as "usuario" | "administrador" | null;

    if (token && rol) {
      setUsuario({
        id: 0,
        nombre: "",
        apellido_paterno: "",
        apellido_materno: "",
        correo_electronico: "",
        estado: "Activo",
        rol: rol ?? "usuario",
        foto: "",
      });
    }
    setLoading(false);
  }, []);

  const login = (usuarioData: Usuario, token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("rol", usuarioData.rol ?? "usuario");
    localStorage.setItem("usuario", JSON.stringify(usuarioData));
    setUsuario(usuarioData);
  };

  const logout = () => {
    localStorage.clear();
    setUsuario(null);
  };

  return { usuario, login, logout, loading };
};