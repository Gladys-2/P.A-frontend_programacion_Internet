import React, { useEffect, useState } from "react";
import { IdiomaProvider } from "../src/context/idiomaContext";
import Login from "./pages/Login/Login";
import Registro from "./pages/Login/Registro";
import type { Usuario, Pantalla } from "./types/types";

// Administrador
import InicioAdmin from "./pages/Admin/InicioAdmin";
import Usuarios from "./pages/Admin/Usuarios";
import AnimalesAdmin from "./pages/Admin/AnimalesAdmin";
import ReportesAdmin from "./pages/Admin/ReportesAdmin";
import VoluntariosAdmin from "./pages/Admin/VoluntariosAdmin";
import TablaDonaciones from "./pages/Admin/donacionAdmin";
import AdopcionesAdmin from "./pages/Admin/adopcionesAdmin";

// Usuario
import InicioUsuario from "./pages/Usuario/Inicio";
import AnimalesUsuario from "./pages/Usuario/Animales";
import VoluntariosUsuario from "./pages/Usuario/Voluntarios";
import AdopcionesUsuario from "./pages/Usuario/Adopciones";
import DonacionesUsuario from "./pages/Usuario/donaciones";

import InicioPublico from "../src/componentes/InicioContenido";

import Navbar from "./componentes/Navbar";
import Sidebar from "./componentes/Sidebar";
import i18n from "./i18n";
import "./i18n";

const App: React.FC = () => {
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);
  const [pantalla, setPantalla] = useState<Pantalla>("inicioPublico");
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const handleLoginExitoso = (usuario: Usuario) => {
    setUsuarioActual(usuario);
    setPantalla("inicio");
  };

  const handleSalir = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUsuarioActual(null);
    setPantalla("inicioPublico");
  };

  const renderContenidoAdmin = () => {
    if (!usuarioActual) return null;

    switch (pantalla) {
      case "usuarios":
        return <Usuarios usuarioLogueado={usuarioActual} />;
      case "reportes":
        return <ReportesAdmin />;
      case "animalesAdmin":
        return <AnimalesAdmin usuarioLogueado={usuarioActual} />;
      case "voluntariosAdmin":
        return <VoluntariosAdmin usuarioLogueado={usuarioActual} />;
      case "donacionesAdmin":
        return <TablaDonaciones />;
      case "adopcionesAdmin":
        return <AdopcionesAdmin />;
      default:
        return <InicioAdmin usuario={usuarioActual} sidebarAbierto={sidebarAbierto} />;
    }
  };

  const renderContenidoUsuario = () => {
    if (!usuarioActual) return null;

    switch (pantalla) {
      case "inicio":
        return <InicioUsuario usuario={usuarioActual} sidebarAbierto={sidebarAbierto} />;
      case "adopciones":
        return <AdopcionesUsuario usuario={usuarioActual} />;
      case "animales":
        return <AnimalesUsuario usuario={usuarioActual} />;
      case "voluntarios":
        return <VoluntariosUsuario />;
      case "donaciones":
        return <DonacionesUsuario usuario={usuarioActual} />;
      default:
        return <InicioUsuario usuario={usuarioActual} sidebarAbierto={sidebarAbierto} />;
    }
  };

  return (
    <IdiomaProvider>
      <Navbar
        usuario={usuarioActual}
        sidebarAbierto={sidebarAbierto}
        setSidebarAbierto={setSidebarAbierto}
        setPantalla={setPantalla}
      />

      {!usuarioActual ? (
        <main className="pt-20 px-6 w-full">
          {pantalla === "inicioPublico" && <InicioPublico sidebarAbierto={false} />}
          {pantalla === "login" && (
            <Login
              mostrarRegistro={() => setPantalla("registro")}
              onLoginExitoso={handleLoginExitoso}
            />
          )}
          {pantalla === "registro" && (
            <Registro mostrarLogin={() => setPantalla("login")} />
          )}
        </main>
      ) : (
        <div className="flex w-full min-h-screen">
          {/* sidebar */}
          <Sidebar
            abierto={sidebarAbierto}
            toggleSidebar={() => setSidebarAbierto(!sidebarAbierto)}
            usuario={{ ...usuarioActual, rol: usuarioActual.rol ?? "usuario" }}
            setPantalla={setPantalla}
            handleSalir={handleSalir}
          />

          {/* contenido principal */}
          <div
            className={`flex-1 transition-all duration-300 ${
              sidebarAbierto ? "ml-60" : "ml-0"
            }`}
          >
            <main className="pt-20 px-6 w-full">
              {usuarioActual.rol === "administrador"
                ? renderContenidoAdmin()
                : renderContenidoUsuario()}
            </main>
          </div>
        </div>
      )}
    </IdiomaProvider>
  );
};

export default App;