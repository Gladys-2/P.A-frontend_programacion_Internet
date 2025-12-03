import React, { useState, useEffect } from "react";
import axios from "axios";
import type { Adopcion } from "../../types/types";
import BandejaAdopcion from "../../componentes/Bandejas/BandejaAdopcion";
import ModalAdopcion from "../../componentes/Modal/ModalAdopcion";

const API_URL = import.meta.env.VITE_API_URL;

const AdopcionesAdmin: React.FC = () => {
  const [adopciones, setAdopciones] = useState<Adopcion[]>([]);
  const [modal, setModal] = useState<Adopcion | null>(null);

  const fetchAdopciones = async () => {
    try {
      const res = await axios.get(`${API_URL}/adopciones`);
      setAdopciones(res.data);
    } catch (err) {
      console.error("Error cargando adopciones:", err);
    }
  };

  useEffect(() => {
    fetchAdopciones();
  }, []);

  const handleAprobar = async (adopcion: Adopcion) => {
    try {
      await axios.put(`${API_URL}/adopciones/actualizar-estado/${adopcion.id}`, {
        estado: "Aprobada"
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
        motivoRechazo: motivo
      });
      fetchAdopciones();
    } catch (err) {
      console.error("Error al rechazar adopción:", err);
    }
  };

  return (
    <div className="p-6 bg-cyan-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-cyan-20">
        Gestión de Adopciones
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {adopciones.map((a) => (
          <BandejaAdopcion
            key={a.id}
            adopcion={a}
            onAprobar={() => handleAprobar(a)}
            onRechazar={() => handleRechazar(a)}
            onVerDetalle={() => setModal(a)}
          />
        ))}
      </div>

      {modal && <ModalAdopcion adopcion={modal} onClose={() => setModal(null)} />}
    </div>
  );
};

export default AdopcionesAdmin;