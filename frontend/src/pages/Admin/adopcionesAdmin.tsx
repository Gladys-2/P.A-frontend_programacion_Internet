import React, { useEffect, useState } from "react";
import axios from "axios";
import type { Adopcion } from "../../types/types";
import BandejaAdopcion from "../../componentes/Bandejas/BandejaAdopcion";
import ModalAdopcion from "../../componentes/Modal/ModalAdopcion";

const API_URL = import.meta.env.VITE_API_URL;

const AdopcionesAdmin: React.FC = () => {
  const [adopciones, setAdopciones] = useState<Adopcion[]>([]);
  const [modal, setModal] = useState<Adopcion | null>(null);
  const [cargando, setCargando] = useState(true);

  const fetchAdopciones = async () => {
    try {
      setCargando(true);
      const res = await axios.get(`${API_URL}/adopciones`);
      setAdopciones(res.data);
    } catch (err) {
      console.error("Error cargando adopciones:", err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchAdopciones();
  }, []);

  const handleAprobar = async (adopcion: Adopcion) => {
    try {
      await axios.put(`${API_URL}/adopciones/actualizar-estado/${adopcion.id}`, {
        estado: "Aprobada",
      });
      fetchAdopciones();
    } catch (err) {
      console.error("Error al aprobar adopción:", err);
    }
  };

  const handleRechazar = async (adopcion: Adopcion) => {
    const motivo = prompt("Ingrese motivo de rechazo:");
    if (!motivo) return;

    try {
      await axios.put(`${API_URL}/adopciones/actualizar-estado/${adopcion.id}`, {
        estado: "Rechazada",
        motivoRechazo: motivo,
      });
      fetchAdopciones();
    } catch (err) {
      console.error("Error al rechazar adopción:", err);
    }
  };

  if (cargando) {
    return <p className="text-center mt-10 text-xl font-semibold text-gray-400">Cargando adopciones...</p>;
  }

  if (!adopciones || adopciones.length === 0) {
    return <p className="text-center mt-10 text-xl text-gray-400">No hay adopciones registradas.</p>;
  }

  return (
    <div className="p-6 bg-black min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-6 text-center">Gestión de Adopciones</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {adopciones.map((a) => (
          <div
            key={a.id}
            className="relative bg-gray-900/90 p-4 rounded-2xl shadow-md transition-transform transform hover:scale-[1.05] hover:shadow-cyan-500/80 group"
          >
            {/* Brillo animado de cada tarjeta */}
            <span className="absolute inset-0 rounded-2xl bg-linear-to-r from-cyan-300 via-purple-400 to-pink-400 opacity-30 blur-2xl scale-95 group-hover:scale-105 group-hover:opacity-70 transition-all duration-500 pointer-events-none"></span>

            <BandejaAdopcion
              adopcion={a}
              onAprobar={() => handleAprobar(a)}
              onRechazar={() => handleRechazar(a)}
              onVerDetalle={() => setModal(a)}
            />
          </div>
        ))}
      </div>

      {modal && <ModalAdopcion adopcion={modal} onClose={() => setModal(null)} />}
    </div>
  );
};

export default AdopcionesAdmin;