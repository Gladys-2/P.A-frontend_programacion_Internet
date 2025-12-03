import React from "react";
import type { Donacion } from "../../types/types";
import { FaUser, FaMoneyBillWave, FaCalendarAlt, FaCreditCard, FaStickyNote, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface Props {
  donacion: Donacion;
  onClose: () => void;
}

const ModalDonacion: React.FC<Props> = ({ donacion, onClose }) => {
  const estadoIcon = (estado?: string) => {
    if (!estado) return <span className="text-gray-500">Pendiente</span>;
    switch (estado.toLowerCase()) {
      case "aprobada":
        return <span className="text-green-600 flex items-center gap-1"><FaCheckCircle /> Aprobada</span>;
      case "pendiente":
        return <span className="text-yellow-600 flex items-center gap-1"><FaTimesCircle /> Pendiente</span>;
      case "rechazada":
        return <span className="text-red-600 flex items-center gap-1"><FaTimesCircle /> Rechazada</span>;
      default:
        return <span className="text-gray-500">{estado}</span>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-xl border border-gray-200 animate-fade-in">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Detalle de Donación</h2>

        <div className="space-y-3 text-gray-700">
          <p className="flex items-center gap-2"><FaUser className="text-gray-500" /> <strong>Usuario:</strong> {donacion.usuario?.nombre || "Anónimo"}</p>
          <p className="flex items-center gap-2"><FaMoneyBillWave className="text-green-500" /> <strong>Monto:</strong> ${donacion.monto}</p>
          <p className="flex items-center gap-2"><FaCalendarAlt className="text-gray-500" /> <strong>Fecha:</strong> {donacion.fechaDonacion ? new Date(donacion.fechaDonacion).toLocaleString() : "No registrada"}</p>
          <p className="flex items-center gap-2"><FaCreditCard className="text-blue-500" /> <strong>Método:</strong> {donacion.metodo || "No especificado"}</p>
          {donacion.descripcion && <p className="flex items-start gap-2"><FaStickyNote className="text-yellow-500 mt-1" /> <strong>Descripción:</strong> {donacion.descripcion}</p>}
          {donacion.notasInternas && <p className="flex items-start gap-2"><FaStickyNote className="text-pink-500 mt-1" /> <strong>Notas internas:</strong> {donacion.notasInternas}</p>}
          {donacion.comprobante && <p className="flex items-center gap-2"><FaCreditCard className="text-purple-500" /> <strong>Comprobante:</strong> {donacion.comprobante}</p>}
          <p className="flex items-center gap-2"><strong>Estado:</strong> {estadoIcon(donacion.estado)}</p>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className="bg-cyan-300 px-6 py-2 rounded-xl hover:bg-cyan-400 text-cyan-900 font-semibold transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDonacion;