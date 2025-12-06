import React from "react";
import {
  FaUsers,
  FaPaw,
  FaChartBar,
  FaSignOutAlt,
  FaHandHoldingHeart,
} from "react-icons/fa";
import type { Usuario, Pantalla } from "../types/types";

interface SidebarProps {
  abierto: boolean;
  toggleSidebar: () => void;
  usuario: Usuario;
  setPantalla: (pantalla: Pantalla) => void;
  handleSalir: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  abierto,
  toggleSidebar,
  usuario,
  setPantalla,
  handleSalir,
}) => {
  
  const botonClase =
    "flex items-center px-5 py-4 rounded-xl gap-4 text-gray-800 font-semibold " +
    "relative overflow-hidden transition-all " +
    "hover:shadow-[0_0_18px_rgba(34,211,238,0.8)] " +
    "hover:bg-cyan-50/40 " +
    "before:absolute before:inset-0 before:bg-gradient-to-r " +
    "before:from-cyan-400/0 before:via-fuchsia-400/30 before:to-yellow-300/0 " +
    "before:-translate-x-full before:animate-slideLight";

  const botonSalirClase =
    "flex items-center px-5 py-4 rounded-xl text-red-500 font-semibold " +
    "hover:bg-red-600 hover:text-white transition-all gap-4 " +
    "relative overflow-hidden hover:shadow-[0_0_18px_rgba(255,80,80,0.8)] " +
    "before:absolute before:inset-0 before:bg-gradient-to-r " +
    "before:from-red-200/0 before:via-red-300/40 before:to-red-200/0 " +
    "before:-translate-x-full before:animate-slideLight";

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl 
      transform transition-transform duration-300 ease-out z-40
      ${abierto ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="flex flex-col h-full p-8">

        <h2 className="text-3xl font-extrabold text-gray-900 mb-10">
          Menú
        </h2>

        <div className="flex flex-col gap-5">

          {usuario.rol === "usuario" && (
            <>
              <button
                onClick={() => {
                  setPantalla("adopciones");
                  toggleSidebar();
                }}
                className={botonClase}
              >
                <FaUsers size={28} className="ml-1 text-teal-500" /> Adopciones
              </button>

              <button
                onClick={() => {
                  setPantalla("animales");
                  toggleSidebar();
                }}
                className={botonClase}
              >
                <FaPaw size={28} className="ml-1 text-teal-500" /> Animales
              </button>

              <button
                onClick={() => {
                  setPantalla("voluntarios");
                  toggleSidebar();
                }}
                className={botonClase}
              >
                <FaUsers size={28} className="ml-1 text-teal-500" /> Voluntarios
              </button>

              <button
                onClick={() => {
                  setPantalla("donaciones");
                  toggleSidebar();
                }}
                className={botonClase}
              >
                <FaHandHoldingHeart size={28} className="ml-1 text-teal-500" /> Donaciones
              </button>
            </>
          )}

          {usuario.rol === "administrador" && (
            <>
              <button
                onClick={() => {
                  setPantalla("usuarios");
                  toggleSidebar();
                }}
                className={botonClase}
              >
                <FaUsers size={28} className="ml-1 text-teal-500" /> Usuarios
              </button>

              <button
                onClick={() => {
                  setPantalla("animalesAdmin");
                  toggleSidebar();
                }}
                className={botonClase}
              >
                <FaPaw size={28} className="ml-1 text-teal-500" /> Animales
              </button>

              <button
                onClick={() => {
                  setPantalla("adopcionesAdmin");
                  toggleSidebar();
                }}
                className={botonClase}
              >
                <FaUsers size={28} className="ml-1 text-teal-500" /> Adopciones
              </button>

              <button
                onClick={() => {
                  setPantalla("voluntariosAdmin");
                  toggleSidebar();
                }}
                className={botonClase}
              >
                <FaUsers size={28} className="ml-1 text-teal-500" /> Voluntarios
              </button>

              <button
                onClick={() => {
                  setPantalla("donacionesAdmin");
                  toggleSidebar();
                }}
                className={botonClase}
              >
                <FaHandHoldingHeart size={28} className="ml-1 text-teal-500" /> Donaciones
              </button>

              <button
                onClick={() => {
                  setPantalla("reportes");
                  toggleSidebar();
                }}
                className={botonClase}
              >
                <FaChartBar size={28} className="ml-1 text-teal-500" /> Reportes
              </button>
            </>
          )}
        </div>

        <div className="mt-auto">
          <button
            onClick={() => {
              handleSalir();
              toggleSidebar();
            }}
            className={botonSalirClase}
          >
            <FaSignOutAlt size={28} className="ml-1" /> Salir
          </button>
        </div>
      </div>

      {/* Animación del brillo */}
      <style>
        {`
          @keyframes slideLight {
            0% { transform: translateX(-150%); }
            50% { transform: translateX(150%); }
            100% { transform: translateX(150%); }
          }
        `}
      </style>
    </aside>
  );
};

export default Sidebar;