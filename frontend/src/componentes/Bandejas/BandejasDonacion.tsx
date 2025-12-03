import React from "react";
import type { Donacion } from "../../types/types";
import { FaUser, FaMoneyBillWave, FaCalendarAlt, FaEye } from "react-icons/fa";

interface Props {
  donacion: Donacion;
  onVerDetalle: () => void;
}

const BandejaDonacion: React.FC<Props> = ({ donacion, onVerDetalle }) => {
  const colorTipo = (tipo?: string) => {
    if (!tipo) return "bg-gray-100 text-gray-700";
    const t = tipo.toLowerCase();
    if (t.includes("dinero")) return "bg-green-100 text-green-700";
    if (t.includes("comida")) return "bg-yellow-100 text-yellow-700";
    if (t.includes("ropa")) return "bg-blue-100 text-blue-700";
    if (t.includes("juguete")) return "bg-pink-100 text-pink-700";
    return "bg-gray-100 text-gray-700";
  };

  const colorEstado = (estado?: string) => {
    if (!estado) return "bg-gray-100 text-gray-700";
    const e = estado.toLowerCase();
    if (e === "aprobada") return "bg-green-200 text-green-800";
    if (e === "pendiente") return "bg-yellow-200 text-yellow-800";
    if (e === "rechazada") return "bg-red-200 text-red-800";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg border border-gray-200 cursor-pointer transition transform hover:-translate-y-1">
      <h3 className="font-bold text-gray-800 text-lg mb-2 flex items-center gap-2">
        <FaUser className="text-gray-500" /> {donacion.usuario?.nombre || "Anónimo"}
      </h3>

      <p className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${colorTipo(donacion.tipo)}`}>
        {donacion.tipo || "-"}
      </p>

      <p className="mt-2 flex items-center gap-2">
        <FaMoneyBillWave className="text-green-500" /> ${donacion.monto}
      </p>

      <p className="mt-1 flex items-center gap-2">
        <FaCalendarAlt className="text-gray-500" /> {donacion.fechaDonacion ? new Date(donacion.fechaDonacion).toLocaleDateString() : "-"}
      </p>

      <p className={`mt-1 inline-block px-2 py-1 rounded-full text-sm font-medium ${colorEstado(donacion.estado)}`}>
        {donacion.estado}
      </p>

      <button
        className="mt-3 w-full flex items-center justify-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-xl hover:bg-blue-600 transition"
        onClick={onVerDetalle}
      >
        <FaEye /> Ver detalle
      </button>
    </div>
  );
};

export default BandejaDonacion;