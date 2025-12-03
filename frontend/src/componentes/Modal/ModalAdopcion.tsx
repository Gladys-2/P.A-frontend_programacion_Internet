import React from "react";
import type { Adopcion } from "../../types/types";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";

interface Props {
  adopcion: Adopcion;
  onClose: () => void;
}

const ModalAdopcion: React.FC<Props> = ({ adopcion, onClose }) => {
  // Función para obtener ícono según el estado
  const getEstadoIcon = () => {
    switch (adopcion.estado) {
      case "Aprobada":
        return <FaCheckCircle className="text-green-500 text-xl" />;
      case "Rechazada":
        return <FaTimesCircle className="text-red-500 text-xl" />;
      default:
        return <FaClock className="text-yellow-500 text-xl" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md p-6 shadow-2xl border border-gray-200 dark:border-gray-700 transform scale-95 transition-transform duration-300 hover:scale-100">
        {/* Encabezado */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {getEstadoIcon()}
          <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 text-center">
            Detalle de Adopción
          </h2>
        </div>

        {/* Contenido */}
        <div className="space-y-3 text-gray-700 dark:text-gray-200">
          <p>
            <span className="font-semibold text-cyan-600">Animal:</span> {adopcion.animal?.nombre}
          </p>
          <p>
            <span className="font-semibold text-cyan-600">Usuario:</span> {adopcion.usuario?.nombre}
          </p>
          <p>
            <span className="font-semibold text-cyan-600">Estado:</span> {adopcion.estado}
          </p>
          <p>
            <span className="font-semibold text-cyan-600">Fecha solicitud:</span> {new Date(adopcion.fechaSolicitud!).toLocaleString()}
          </p>

          {adopcion.estado === "Aprobada" && adopcion.fechaAprobacion && (
            <p>
              <span className="font-semibold text-green-600">Fecha aprobación:</span> {new Date(adopcion.fechaAprobacion).toLocaleString()}
            </p>
          )}

          {adopcion.estado === "Rechazada" && (
            <>
              {adopcion.fechaRechazo && (
                <p>
                  <span className="font-semibold text-red-600">Fecha rechazo:</span> {new Date(adopcion.fechaRechazo).toLocaleString()}
                </p>
              )}
              {adopcion.motivoRechazo && (
                <p>
                  <span className="font-semibold text-red-600">Motivo rechazo:</span> {adopcion.motivoRechazo}
                </p>
              )}
            </>
          )}

          {adopcion.comentarios && (
            <p>
              <span className="font-semibold text-cyan-600">Comentarios:</span> {adopcion.comentarios}
            </p>
          )}
        </div>

        {/* Botón Cerrar */}
        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-105"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAdopcion;