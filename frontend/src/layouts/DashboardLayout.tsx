import React, { useContext, useState } from "react";
import Sidebar from "../componentes/Sidebar";
import Navbar from "../componentes/Navbar";
import { IdiomaContext } from "../context/idiomaContext";
import type { Usuario, Pantalla } from "../types/types";

interface DashboardLayoutProps {
  usuario: Usuario;
  pantalla: Pantalla;
  setPantalla: (pantalla: Pantalla) => void;
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ usuario, setPantalla, children }) => {
  const { modoOscuro } = useContext(IdiomaContext);
  const [sidebarAbierto, setSidebarAbierto] = useState(true);

  const handleSalir = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  return (
    <div className={`${modoOscuro ? "dark" : ""} w-full min-h-screen flex bg-gray-100 dark:bg-gray-900 transition-colors duration-300`}>
      
      {/* Sidebar fijo */}
      <Sidebar
        abierto={sidebarAbierto}
        toggleSidebar={() => setSidebarAbierto(!sidebarAbierto)}
        usuario={usuario}
        setPantalla={setPantalla}
        handleSalir={handleSalir}
      />

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col relative">
        {/* Navbar fijo */}
        <Navbar
          usuario={usuario}
          sidebarAbierto={sidebarAbierto}
          setSidebarAbierto={setSidebarAbierto}
          setPantalla={setPantalla}
        />

        {/* Main */}
        <main className="flex-1 w-full h-full overflow-hidden relative">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;