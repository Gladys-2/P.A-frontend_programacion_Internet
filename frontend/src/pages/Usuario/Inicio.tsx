import React from "react";
import type { Usuario } from "../../types/types";
import InicioContenido from "../../componentes/InicioContenido";

interface InicioUsuarioProps {
  usuario: Usuario;
  sidebarAbierto: boolean; 
}

const Inicio: React.FC<InicioUsuarioProps> = ({ sidebarAbierto }) => {
  return (
    <div className={`transition-all duration-300`}>
      <InicioContenido sidebarAbierto={sidebarAbierto} />
    </div>
  );
};

export default Inicio;