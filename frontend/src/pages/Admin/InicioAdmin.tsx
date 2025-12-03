import React from "react";
import type { Usuario } from "../../types/types";
import InicioContenido from "../../componentes/InicioContenido";

interface InicioAdminProps {
  usuario: Usuario;
  sidebarAbierto: boolean;
}

const InicioAdmin: React.FC<InicioAdminProps> = ({  }) => {
  return (
    <div className="w-full h-full">
      <InicioContenido sidebarAbierto={false} />
    </div>
  );
};

export default InicioAdmin;