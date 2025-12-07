import React, { useState, useEffect } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useIdioma } from "../../context/idiomaContext";
import type { Usuario } from "../../types/types";

interface LoginProps {
  mostrarRegistro: () => void;
  onLoginExitoso: (usuario: Usuario) => void;
  volverInicio: () => void;
}

const API_URL = import.meta.env.VITE_API_URL;

const Login: React.FC<LoginProps> = ({ mostrarRegistro, onLoginExitoso }) => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [loading, setLoading] = useState(false);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState("");
  const { t } = useIdioma();
  const [animar, setAnimar] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimar(true), 100);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMensaje("");

    try {
      const respuesta = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo_electronico: correo,
          contrasena: contrasena,
        }),
      });

      const data = await respuesta.json();

      if (respuesta.ok && data.usuario) {
        const usuario: Usuario = data.usuario;

        // Asignar rol válido
        const rolValido: "usuario" | "administrador" = usuario.id === 3 ? "administrador" : "usuario";
        usuario.rol = rolValido;

        // Guardar en localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("rol", rolValido);
        localStorage.setItem("usuario", JSON.stringify(usuario));

        onLoginExitoso(usuario);
      } else {
        setErrorMensaje(data.error || data.mensaje || "Correo o contraseña incorrectos");
      }
    } catch (error) {
      console.error(error);
      setErrorMensaje("Error con el servidor. Intenta de nuevo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center w-full min-h-screen font-poppins bg-cover bg-center overflow-hidden px-4"
      style={{
        backgroundImage:
          'url(https://cdn.shopify.com/s/files/1/0742/6437/9704/files/blog_genesis_trabajo_1024x1024.png?v=1708552728)',
      }}
    >
      <div
        className={`bg-white/20 backdrop-blur-xl rounded-2xl p-10 max-w-[380px] w-full flex flex-col items-center shadow-xl border border-white/30 transition-all duration-700
        ${animar ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <img src="/LOGITO (2).jpeg" alt="Logo Huellitas" className="w-24 h-24 mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-1 text-center">
          {t("Bienvenido a Huellitas")}
        </h2>

        <form className="flex flex-col gap-4 w-full" onSubmit={handleLogin}>
          <div className="flex items-center gap-2 p-3 rounded-md bg-white/40 border border-white/50">
            <FaEnvelope className="text-gray-700" />
            <input
              type="email"
              placeholder={t("Correo Electrónico")}
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-900"
              required
            />
          </div>

          <div className="relative flex items-center gap-2 p-3 rounded-md bg-white/40 border border-white/50">
            <FaLock className="text-gray-700" />
            <input
              type={mostrarContrasena ? "text" : "password"}
              placeholder={t("Contraseña")}
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-900 pr-10"
              required
            />
            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-black hover:text-yellow-400"
              onClick={() => setMostrarContrasena(!mostrarContrasena)}
            >
              {mostrarContrasena ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-linear-to-r from-[#77f5e0] to-[#3c8c77] text-white py-3 rounded-md font-semibold shadow-md"
          >
            {loading ? t("Cargando...") : t("Iniciar Sesión")}
          </button>

          {errorMensaje && (
            <p className="text-red-600 font-semibold text-center mt-2">{errorMensaje}</p>
          )}
        </form>

        <p className="text-gray-900 mt-4 text-lg">
          {t("¿No tienes cuenta?")}{" "}
          <button
            className="font-bold underline text-white hover:text-yellow-400"
            onClick={mostrarRegistro}
          >
            {t("Crear cuenta")}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;