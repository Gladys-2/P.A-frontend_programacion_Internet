import React from "react";
import type { Adopcion } from "../../types/types";
import { FaCheck, FaTimes, FaEye, FaDog, FaUser, FaCalendarAlt } from "react-icons/fa";

interface Props {
  adopcion: Adopcion;
  onAprobar: () => void;
  onRechazar: () => void;
  onVerDetalle: () => void;
}

const BandejaAdopcion: React.FC<Props> = ({
  adopcion,
  onAprobar,
  onRechazar,
  onVerDetalle,
}) => {
  const estadoColor =
    adopcion.estado === "Pendiente"
      ? "text-yellow-800 bg-yellow-100"
      : adopcion.estado === "Aprobada"
      ? "text-green-800 bg-green-100"
      : "text-red-800 bg-red-100";

  return (
    <div
      className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 cursor-pointer transition-transform transform hover:-translate-y-1"
      onClick={onVerDetalle}
    >
      {/* Nombre del animal */}
      <h3 className="font-bold text-gray-800 dark:text-gray-100 text-xl mb-3 flex items-center gap-3">
        <FaDog className="text-cyan-500" /> {adopcion.animal?.nombre}
      </h3>

      {/* Usuario */}
      <p className="text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-1">
        <FaUser className="text-indigo-500" /> {adopcion.usuario?.nombre}
      </p>

      {/* Fecha de solicitud */}
      <p className="text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
        <FaCalendarAlt className="text-purple-500" /> {new Date(adopcion.fechaSolicitud!).toLocaleDateString()}
      </p>

      {/* Estado */}
      <span
        className={`inline-block px-3 py-1 rounded-full font-semibold mt-2 ${estadoColor} text-sm`}
      >
        {adopcion.estado}
      </span>

      {/* Botones de aprobar/rechazar solo si está pendiente */}
      {adopcion.estado === "Pendiente" && (
        <div className="flex gap-3 mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm("¿Aprobar adopción?")) onAprobar();
            }}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl shadow-md transition transform hover:scale-105"
          >
            <FaCheck /> Aprobar
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm("¿Rechazar adopción?")) onRechazar();
            }}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl shadow-md transition transform hover:scale-105"
          >
            <FaTimes /> Rechazar
          </button>
        </div>
      )}

      {/* Botón ver detalle */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onVerDetalle();
        }}
        className="flex items-center gap-2 mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl shadow-md transition transform hover:scale-105"
      >
        <FaEye /> Ver mas detalles
      </button>
    </div>
  );
};

export default BandejaAdopcion;