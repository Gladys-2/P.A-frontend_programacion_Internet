import React, { useEffect, useState } from "react";
import axios from "axios";
import type { Donacion } from "../../types/types";
import ModalDonacion from "../../componentes/Modal/ModalDonacion";
import BandejaDonacion from "../../componentes/Bandejas/BandejasDonacion";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const DonacionesAdmin: React.FC = () => {
  const [donaciones, setDonaciones] = useState<Donacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [selectedDonacion, setSelectedDonacion] = useState<Donacion | null>(null);

  useEffect(() => {
    const fetchDonaciones = async () => {
      try {
        const res = await axios.get(`${API_URL}/donaciones`);
        setDonaciones(res.data.data); // Asegúrate que tu backend devuelve { data: [...] }
      } catch (error) {
        console.error("No se pudieron cargar las donaciones.", error);
      } finally {
        setCargando(false);
      }
    };
    fetchDonaciones();
  }, []);

  if (cargando) {
    return <p className="text-center mt-10 text-xl font-semibold text-gray-600">Cargando donaciones...</p>;
  }

  if (!donaciones || donaciones.length === 0) {
    return <p className="text-center mt-10 text-xl text-gray-600">No hay donaciones registradas.</p>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Donaciones Registradas</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {donaciones.map((d) => (
          <BandejaDonacion
            key={d.id}
            donacion={d}
            onVerDetalle={() => setSelectedDonacion(d)}
          />
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