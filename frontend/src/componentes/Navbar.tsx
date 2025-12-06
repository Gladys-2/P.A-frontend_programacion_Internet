import React, { useContext, useState } from "react";
import { IdiomaContext } from "../context/idiomaContext";
import type { Usuario, Pantalla } from "../types/types";
import { useTranslation } from "react-i18next";
import { FaBars } from "react-icons/fa";

interface NavbarProps {
  usuario: Usuario | null;
  sidebarAbierto: boolean;
  setSidebarAbierto: (abierto: boolean) => void;
  setPantalla: (pantalla: Pantalla) => void;
}

const banderaBO =
  "https://upload.wikimedia.org/wikipedia/commons/4/48/Flag_of_Bolivia.svg";
const banderaUS =
  "https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg";

const coloresIniciales: Record<string, string> = {
  A: "from-teal-300 to-green-400",
  B: "from-green-400 to-emerald-500",
  C: "from-emerald-300 to-teal-400",
  D: "from-teal-400 to-teal-600",
  E: "from-green-200 to-emerald-400",
  F: "from-emerald-300 to-lime-400",
  G: "from-teal-300 to-green-500",
  H: "from-lime-400 to-green-500",
  I: "from-emerald-400 to-teal-500",
  J: "from-green-300 to-emerald-500",
  K: "from-teal-200 to-teal-400",
  L: "from-emerald-200 to-emerald-400",
  M: "from-green-200 to-green-400",
  N: "from-teal-300 to-teal-500",
  O: "from-green-200 to-emerald-400",
  P: "from-teal-200 to-teal-300",
  Q: "from-emerald-200 to-green-300",
  R: "from-green-200 to-lime-300",
  S: "from-teal-200 to-green-300",
  T: "from-emerald-200 to-teal-400",
  U: "from-green-300 to-emerald-400",
  V: "from-teal-200 to-teal-300",
  W: "from-green-100 to-teal-200",
  X: "from-lime-200 to-green-300",
  Y: "from-emerald-200 to-teal-200",
  Z: "from-teal-100 to-green-200",
};

const Navbar: React.FC<NavbarProps> = ({
  usuario,
  sidebarAbierto,
  setSidebarAbierto,
  setPantalla,
}) => {
  useContext(IdiomaContext);
  const { t, i18n } = useTranslation();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const initialActiveButton = usuario
    ? usuario.rol === "administrador"
      ? "inicioAdmin"
      : "inicio" 
    : "inicioPublico";
    
  const [botonActivo, setBotonActivo] = useState<string>(initialActiveButton);

  const iniciales =
    usuario
      ? usuario.nombre.charAt(0).toUpperCase() +
        (usuario.apellido_paterno
          ? usuario.apellido_paterno.charAt(0).toUpperCase()
          : "")
      : "";

  const colorInicial =
    coloresIniciales[iniciales.charAt(0)] || "from-teal-300 to-green-200";

  
  const enlacesPublicos = ["inicioPublico", "login", "registro"];
  
  const enlacesUsuario = ["inicio", "adopciones", "animales", "voluntarios", "donaciones"];

  const enlacesAdmin = [
    "inicio",
    "usuarios",
    "animalesAdmin",
    "adopcionesAdmin",
    "voluntariosAdmin",
    "donacionesAdmin",
    "reportes", 
  ];
  const obtenerEnlaces = () => {
      if (!usuario) return enlacesPublicos;
      if (usuario.rol === "administrador") return enlacesAdmin;
      return enlacesUsuario;
  }
  
  const enlacesActuales = obtenerEnlaces();

  const handleNavClick = (pant: string) => {
    const pantallaNombre = 
        pant === "inicioPublico" || pant === "login" || pant === "registro" 
        ? pant 
        : pant as Pantalla;
        
    setPantalla(pantallaNombre as Pantalla);
    setBotonActivo(pant);
  };

  const renderNavButton = (pant: string, isMobile: boolean = false) => {
    const isPublicButton = enlacesPublicos.includes(pant);
    const textKey = pant.charAt(0).toUpperCase() + pant.slice(1);
    
    let baseClasses = `transition text-teal-600 font-semibold`;
    let activeClasses = "ring-2 ring-teal-400 shadow-lg animate-pulse";
    
    if (isMobile) {
        baseClasses = `py-2 text-teal-700 border-b border-gray-300`;
        if (pant === "registro") {
            baseClasses = `py-2 bg-teal-500 text-white rounded-md`;
        }
    } else if (isPublicButton) {
        baseClasses = `px-4 py-2 text-teal-600 border border-teal-500 rounded-md transition hover:bg-teal-50`;
        if (pant === "registro") { 
            baseClasses = `px-4 py-2 bg-teal-500 text-white rounded-md transition hover:bg-teal-600`;
        }
    } else {
        baseClasses = `hover:text-teal-500 transition`;
        activeClasses += " px-3 py-2 rounded-md";
    }

    return (
      <button
        key={pant}
        onClick={() => handleNavClick(pant)}
        className={`${baseClasses} ${
          botonActivo === pant ? activeClasses : ""
        }`}
      >
        {t(textKey)}
      </button>
    );
  };
 
  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-white shadow-lg">
      <nav className="w-full flex justify-between items-center px-6 py-4 bg-white">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => usuario && setSidebarAbierto(!sidebarAbierto)}
        >
          <img
            src="../LOGITO (2).jpeg"
            className="w-10 h-10 rounded-full border-2 border-teal-400 shadow-sm"
            alt={t("Logo Huellitas")}
          />
          <span className="text-2xl font-extrabold text-teal-600">
            {t("Huellitas")}
          </span>
        </div>

        {/* Hamburguesa móvil */}
        <div className="md:hidden">
          <FaBars
            size={28}
            className="text-teal-600 cursor-pointer"
            onClick={() => setMenuAbierto(!menuAbierto)}
          />
        </div>

        {/* NAV Desktop – Público, Usuario o Admin */}
        <div className="hidden md:flex gap-10">
            {enlacesActuales.map((pant) => renderNavButton(pant))}
        </div>

        {/* banderas y tambien iniciales */}
        <div className="hidden md:flex items-center gap-4">
          <img
            src={banderaBO}
            onClick={() => i18n.changeLanguage("es")}
            className="w-7 h-7 rounded-md cursor-pointer border border-teal-500"
            alt="Bandera de Bolivia"
          />

          <img
            src={banderaUS}
            onClick={() => i18n.changeLanguage("en")}
            className="w-7 h-7 rounded-md cursor-pointer border border-teal-500"
            alt="Bandera de Estados Unidos"
          />

          {usuario && (
            <>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-linear-to-br ${colorInicial}`}
              >
                {iniciales}
              </div>

              <small className="text-teal-700 font-semibold">
                {t("Bienvenido")}{" "}
                {usuario.rol === "administrador"
                  ? t("Administrador")
                  : t("Usuario")}
              </small>
            </>
          )}
        </div>
      </nav>

      {/* menu del movil */}
      {menuAbierto && (
        <div className="md:hidden bg-white w-full shadow-xl px-6 py-4 flex flex-col gap-4">
            {/* Enlaces en móvil */}
            {enlacesActuales.map((pant) => renderNavButton(pant, true))}

            {/* Banderas móvil */}
            <div className="flex gap-4 pt-4 border-t border-gray-300">
                <img
                    src={banderaBO}
                    onClick={() => i18n.changeLanguage("es")}
                    className="w-7 h-7 rounded-md cursor-pointer border border-teal-500"
                    alt="Bandera de Bolivia"
                />
                <img
                    src={banderaUS}
                    onClick={() => i18n.changeLanguage("en")}
                    className="w-7 h-7 rounded-md cursor-pointer border border-teal-500"
                    alt="Bandera de Estados Unidos"
                />
            </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;