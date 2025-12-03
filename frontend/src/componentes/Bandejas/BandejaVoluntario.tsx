import React from "react";
import type { Voluntario } from "../../types/types";
import { FaEdit, FaToggleOn, FaToggleOff } from "react-icons/fa";

interface Props {
  voluntario: Voluntario;
  onEdit: () => void;
  onToggle: () => void;
}

const BandejaVoluntario: React.FC<Props> = ({ voluntario, onEdit, onToggle }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 cursor-pointer p-4">
      <div className="flex items-center gap-4 border-b pb-3 mb-3">
        <div className="bg-cyan-400 text-white w-14 h-14 flex items-center justify-center rounded-full font-bold text-lg">
          {voluntario.id}
        </div>
        <h3 className="font-semibold text-gray-800 text-xl">{`${voluntario.nombre} ${voluntario.apellido_paterno} ${voluntario.apellido_materno}`}</h3>
      </div>

      <div className="grid grid-cols-2 gap-2 text-gray-700 text-sm">
        <div className="flex gap-1"><span className="font-medium">Correo:</span> {voluntario.correo_electronico}</div>
        <div className="flex gap-1"><span className="font-medium">Teléfono:</span> {voluntario.telefono || "-"}</div>
        <div className="flex gap-1"><span className="font-medium">Área:</span> {voluntario.areaAsignada || "-"}</div>
        <div className="flex gap-1"><span className="font-medium">Disponibilidad:</span> {voluntario.disponibilidad || "-"}</div>
        <div className="flex gap-1"><span className="font-medium">Estado:</span> 
          <span className={voluntario.estado === "Activo" ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>
            {voluntario.estado}
          </span>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <button onClick={onEdit} className="flex items-center gap-1 text-cyan-500 hover:text-cyan-700 font-semibold">
          <FaEdit /> Editar
        </button>
        <button
          onClick={onToggle}
          className={`flex items-center gap-1 font-semibold ${
            voluntario.estado === "Activo" ? "text-green-500 hover:text-green-700" : "text-red-500 hover:text-red-700"
          }`}
        >
          {voluntario.estado === "Activo" ? <FaToggleOn /> : <FaToggleOff />}
          {voluntario.estado === "Activo" ? "Activo" : "Inactivo"}
        </button>
      </div>
    </div>
  );
};

export default BandejaVoluntario;