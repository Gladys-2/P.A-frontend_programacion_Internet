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
  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-white shadow-2xl 
        transform transition-transform duration-300 ease-out z-40
        ${abierto ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full p-6">

          <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
            Menú
          </h2>

          <div className="flex flex-col gap-3">

            {/* ---------------------- USUARIO NORMAL ---------------------- */}
            {usuario.rol === "usuario" && (
              <>
                <button
                  onClick={() => {
                    setPantalla("adopciones");
                    toggleSidebar();
                  }}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-orange-100 transition-all"
                >
                  <FaUsers size={22} /> Adopciones
                </button>

                <button
                  onClick={() => {
                    setPantalla("animales");
                    toggleSidebar();
                  }}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-orange-100 transition-all"
                >
                  <FaPaw size={22} /> Animales
                </button>

                <button
                  onClick={() => {
                    setPantalla("voluntarios");
                    toggleSidebar();
                  }}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-orange-100 transition-all"
                >
                  <FaUsers size={22} /> Voluntarios
                </button>

                <button
                  onClick={() => {
                    setPantalla("donaciones");
                    toggleSidebar();
                  }}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-orange-100 transition-all"
                >
                  <FaHandHoldingHeart size={22} /> Donaciones
                </button>
              </>
            )}

            {/* ---------------------- ADMINISTRADOR ---------------------- */}
            {usuario.rol === "administrador" && (
              <>
                <button
                  onClick={() => {
                    setPantalla("usuarios");
                    toggleSidebar();
                  }}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-orange-100 transition-all"
                >
                  <FaUsers size={22} /> Usuarios
                </button>

                <button
                  onClick={() => {
                    setPantalla("animalesAdmin");
                    toggleSidebar();
                  }}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-orange-100 transition-all"
                >
                  <FaPaw size={22} /> Animales
                </button>

                <button
                  onClick={() => {
                    setPantalla("adopcionesAdmin");
                    toggleSidebar();
                  }}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-orange-100 transition-all"
                >
                  <FaUsers size={22} /> Adopciones
                </button>

                <button
                  onClick={() => {
                    setPantalla("voluntariosAdmin");
                    toggleSidebar();
                  }}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-orange-100 transition-all"
                >
                  <FaUsers size={22} /> Voluntarios
                </button>

                <button
                  onClick={() => {
                    setPantalla("donacionesAdmin");
                    toggleSidebar();
                  }}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-orange-100 transition-all"
                >
                  <FaHandHoldingHeart size={22} /> Donaciones
                </button>

                <button
                  onClick={() => {
                    setPantalla("reportes");
                    toggleSidebar();
                  }}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-orange-100 transition-all"
                >
                  <FaChartBar size={22} /> Reportes
                </button>
              </>
            )}
          </div>

          {/* ---------------------- SALIR ---------------------- */}
          <div className="mt-auto">
            <button
              onClick={() => {
                handleSalir();
                toggleSidebar();
              }}
              className="flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all"
            >
              <FaSignOutAlt size={22} /> Salir
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;