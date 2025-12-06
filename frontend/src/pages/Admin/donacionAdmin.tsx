import React, { useEffect, useState } from "react";
import axios from "axios";
import type { Donacion } from "../../types/types";
import ModalDonacion from "../../componentes/Modal/ModalDonacion";
import BandejaDonacion from "../../componentes/Bandejas/BandejasDonacion";

const API_URL = import.meta.env.VITE_API_URL;

const DonacionesAdmin: React.FC = () => {
  const [donaciones, setDonaciones] = useState<Donacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [selectedDonacion, setSelectedDonacion] = useState<Donacion | null>(null);

  useEffect(() => {
    const fetchDonaciones = async () => {
      try {
        const res = await axios.get(`${API_URL}/donaciones`);
        setDonaciones(res.data.data);
      } catch (error) {
        console.error("No se pudieron cargar las donaciones.", error);
      } finally {
        setCargando(false);
      }
    };
    fetchDonaciones();
  }, []);

  if (cargando) {
    return <p className="text-center mt-10 text-xl font-semibold text-gray-400">Cargando donaciones...</p>;
  }

  if (!donaciones || donaciones.length === 0) {
    return <p className="text-center mt-10 text-xl text-gray-400">No hay donaciones registradas.</p>;
  }

  return (
    <div className="p-6 bg-black min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-white text-center">Donaciones Registradas</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {donaciones.map((d) => (
          <div
            key={d.id}
            className="relative bg-gray-900/90 p-4 rounded-2xl shadow-md transition-transform transform hover:scale-[1.05] hover:shadow-cyan-500/80 group"
          >
            {/* Brillo animado */}
            <span className="absolute inset-0 rounded-2xl bg-linear-to-r from-cyan-200 via-purple-400 to-pink-300 opacity-30 blur-2xl scale-95 group-hover:scale-105 group-hover:opacity-70 transition-all duration-500 pointer-events-none"></span>
            
            <BandejaDonacion
              donacion={d}
              onVerDetalle={() => setSelectedDonacion(d)}
            />
          </div>
        ))}
      </div>

      {selectedDonacion && (
        <ModalDonacion
          donacion={selectedDonacion}
          onClose={() => setSelectedDonacion(null)}
        />
      )}
    </div>
  );
};

export default DonacionesAdmin;