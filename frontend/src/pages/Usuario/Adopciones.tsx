import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Adopcion, Usuario, Animal } from "../../types/types";

interface AdopcionesUsuarioProps {
  usuario: Usuario;
}

const API_URL = import.meta.env.VITE_API_URL;

const AdopcionesUsuario: React.FC<AdopcionesUsuarioProps> = ({ usuario }) => {
  const [solicitudes, setSolicitudes] = useState<Adopcion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string>("");

  const cargarSolicitudes = async () => {
    if (!usuario.id) return;
    setCargando(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/adopciones/usuario/${usuario.id}`);
      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
      const data: Adopcion[] = await res.json();
      setSolicitudes(data);
    } catch (err) {
      console.error("Error al cargar solicitudes:", err);
      setError("No se pudo cargar tus solicitudes. Intenta más tarde.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarSolicitudes();
  }, [usuario.id]);

  if (cargando)
    return (
      <p className="text-center mt-10 text-xl font-semibold text-gray-600">
        Cargando tus solicitudes...
      </p>
    );

  if (error)
    return (
      <p className="text-center mt-10 text-xl font-semibold text-red-500">
        {error}
      </p>
    );

  return (
    <div className="p-6 min-h-screen bg-cyan-200">
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-900">
        Mis Solicitudes de Adopción
      </h2>

      {solicitudes.length === 0 ? (
        <p className="text-center text-gray-700">
          No tienes solicitudes de adopción aún.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {solicitudes.map((s, i) => {
            const animal: Animal = s.animal as Animal;

            const fechaMostrar =
              s.estado === "Pendiente"
                ? s.fechaSolicitud
                : s.estado === "Aprobada"
                ? s.fechaAprobacion
                : s.fechaRechazo;
            const urlImagen =
              animal.foto?.startsWith("http") ? animal.foto : "/placeholder-animal.png";

            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white rounded-2xl p-4 shadow-lg flex flex-col items-center hover:scale-105 transition-transform"
              >
                <img
                  src={urlImagen}
                  alt={animal.nombre}
                  onError={(e) =>
                    ((e.target as HTMLImageElement).src = "/placeholder-animal.png")
                  }
                  className="w-32 h-32 object-cover rounded-xl mb-3"
                />
                <h3 className="text-xl font-semibold mb-1">{animal.nombre}</h3>
                <p className="text-gray-600 mb-2">
                  {animal.raza} | {animal.edad ?? "—"} años
                </p>
                <p>
                  <strong>Estado:</strong>{" "}
                  <span
                    className={
                      s.estado === "Pendiente"
                        ? "text-orange-500 font-bold"
                        : s.estado === "Aprobada"
                        ? "text-green-500 font-bold"
                        : "text-red-500 font-bold"
                    }
                  >
                    {s.estado}
                  </span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Fecha:{" "}
                  {fechaMostrar
                    ? new Date(fechaMostrar).toLocaleDateString("es-BO")
                    : "—"}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdopcionesUsuario;