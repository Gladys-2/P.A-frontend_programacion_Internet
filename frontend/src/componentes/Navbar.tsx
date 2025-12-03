import React, { useContext } from "react";
import { IdiomaContext } from "../context/idiomaContext";
import type { Usuario, Pantalla } from "../types/types";
import { useTranslation } from "react-i18next";

interface NavbarProps {
  usuario: Usuario | null;
  sidebarAbierto: boolean;
  setSidebarAbierto: (abierto: boolean) => void;
  setPantalla: (pantalla: Pantalla) => void;
}

const banderaBO = "https://upload.wikimedia.org/wikipedia/commons/4/48/Flag_of_Bolivia.svg";
const banderaUS = "https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg";

const coloresIniciales: Record<string, string> = {
  A: "from-yellow-400 to-orange-500",
  B: "from-red-400 to-pink-500",
  C: "from-green-400 to-lime-500",
  D: "from-blue-400 to-indigo-500",
  E: "from-purple-400 to-pink-500",
  F: "from-teal-400 to-cyan-500",
  G: "from-orange-400 to-red-500",
  H: "from-indigo-400 to-purple-500",
  I: "from-lime-400 to-green-500",
  J: "from-pink-400 to-red-500",
  K: "from-yellow-300 to-yellow-500",
  L: "from-blue-300 to-blue-500",
  M: "from-teal-300 to-teal-500",
  N: "from-purple-300 to-purple-500",
  O: "from-orange-300 to-orange-500",
  P: "from-red-300 to-red-500",
  Q: "from-green-300 to-green-500",
  R: "from-pink-300 to-pink-500",
  S: "from-indigo-300 to-indigo-500",
  T: "from-yellow-200 to-yellow-400",
  U: "from-blue-200 to-blue-400",
  V: "from-teal-200 to-teal-400",
  W: "from-purple-200 to-purple-400",
  X: "from-orange-200 to-orange-400",
  Y: "from-red-200 to-red-400",
  Z: "from-green-200 to-green-400",
};

const Navbar: React.FC<NavbarProps> = ({
  usuario,
  sidebarAbierto,
  setSidebarAbierto,
  setPantalla,
}) => {
  useContext(IdiomaContext);
  const { t, i18n } = useTranslation();

  const iniciales =
    usuario
      ? usuario.nombre.charAt(0).toUpperCase() +
        (usuario.apellido_paterno ? usuario.apellido_paterno.charAt(0).toUpperCase() : "")
      : "";

  const colorInicial =
    coloresIniciales[iniciales.charAt(0)] || "from-yellow-400 to-orange-500";

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-white dark:bg-gray-900 transition-colors duration-300">
      <nav className="w-full flex justify-between items-center px-6 py-4 shadow-md backdrop-blur-md bg-gray-200/80 dark:bg-gray-800/80 transition-colors duration-300">
        
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => usuario && setSidebarAbierto(!sidebarAbierto)}
        >
          <img src="../Logito.jpeg" className="w-8 h-8 rounded-full" alt={t("Logo Huellitas")} />
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("Huellitas")}
          </span>
        </div>

        {/* Botones para usuarios NO logueados */}
        {!usuario && (
          <div className="hidden md:flex gap-4">
            <button
              onClick={() => setPantalla("inicioPublico")}
              className="px-4 py-2 text-gray-900 border border-gray-700 rounded-md hover:bg-gray-300 transition"
            >
              {t("Inicio")}
            </button>

            <button
              onClick={() => setPantalla("login")}
              className="px-4 py-2 text-gray-900 border border-gray-700 rounded-md hover:bg-gray-300 transition"
            >
              {t("Iniciar Sesión")}
            </button>

            <button
              onClick={() => setPantalla("registro")}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
            >
              {t("Registrarse")}
            </button>
          </div>
        )}

        {/* Botones para usuario logueado */}
        {usuario?.rol === "usuario" && (
          <div className="hidden md:flex gap-6">
            <button onClick={() => setPantalla("inicio")} className="text-gray-900 dark:text-gray-200 hover:text-orange-600 transition-colors">{t("Inicio")}</button>
            <button onClick={() => setPantalla("adopciones")} className="text-gray-900 dark:text-gray-200 hover:text-orange-600 transition-colors">{t("Adopciones")}</button>
            <button onClick={() => setPantalla("animales")} className="text-gray-900 dark:text-gray-200 hover:text-orange-600 transition-colors">{t("Animales")}</button>
            <button onClick={() => setPantalla("voluntarios")} className="text-gray-900 dark:text-gray-200 hover:text-orange-600 transition-colors">{t("Voluntarios")}</button>
            <button onClick={() => setPantalla("donaciones")} className="text-gray-900 dark:text-gray-200 hover:text-orange-600 transition-colors">{t("Donaciones")}</button>
          </div>
        )}

        {/* Idiomas + Iniciales */}
        <div className="flex items-center gap-4">
          {/* Flags */}
          <img
            src={banderaBO}
            onClick={() => i18n.changeLanguage("es")}
            className={`w-7 h-7 rounded-md cursor-pointer border-2 ${
              i18n.language === "es"
                ? "border-orange-500 scale-110"
                : "border-gray-400"
            }`}
          />
          <img
            src={banderaUS}
            onClick={() => i18n.changeLanguage("en")}
            className={`w-7 h-7 rounded-md cursor-pointer border-2 ${
              i18n.language === "en"
                ? "border-orange-500 scale-110"
                : "border-gray-400"
            }`}
          />

          {/* Iniciales y mensaje de bienvenida */}
          {usuario && (
            <>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-linear-to-br ${colorInicial}`}
              >
                {iniciales}
              </div>

              <small className="text-gray-800 dark:text-gray-100 font-semibold">
                {t("Bienvenido")}{" "}
                {usuario.rol === "administrador" ? t("Administrador") : t("Usuario")}
              </small>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;