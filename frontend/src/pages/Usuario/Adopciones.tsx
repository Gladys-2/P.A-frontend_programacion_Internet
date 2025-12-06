import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Adopcion, Usuario, Animal } from "../../types/types";
import { FaPaw, FaHeart, FaStar } from "react-icons/fa";

interface AdopcionesUsuarioProps {
  usuario: Usuario;
}

const API_URL = import.meta.env.VITE_API_URL;
const POLLING_INTERVAL = 5000; 

const AdopcionesUsuario: React.FC<AdopcionesUsuarioProps> = ({ usuario }) => {
  const [solicitudes, setSolicitudes] = useState<Adopcion[]>([]);
  const [prevSolicitudes, setPrevSolicitudes] = useState<Adopcion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string>("");

  const cargarSolicitudes = async () => {
    if (!usuario.id) return;
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
    const interval = setInterval(() => {
      cargarSolicitudes();
    }, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [usuario.id]);

  useEffect(() => {
    solicitudes.forEach((s) => {
      const prev = prevSolicitudes.find(p => p.id === s.id);
      if (prev?.estado !== s.estado) {
        if (s.estado === "Aprobada") {
          console.log(
            `¡Tu adopción de ${s.animal?.nombre} ha sido aprobada! Hora: ${
              s.fechaAprobacion ? new Date(s.fechaAprobacion).toLocaleString("es-BO") : "Desconocida"
            }`
          );
        }
        if (s.estado === "Rechazada") {
          console.log(
            `Lo sentimos, tu adopción de ${s.animal?.nombre} fue rechazada. Motivo: ${
              s.motivoRechazo ?? "No especificado"
            } Hora: ${s.fechaRechazo ? new Date(s.fechaRechazo).toLocaleString("es-BO") : "Desconocida"}`
          );
        }
      }
    });
    setPrevSolicitudes(solicitudes);
  }, [solicitudes, prevSolicitudes]);

  if (cargando)
    return (
      <p className="text-center mt-10 text-xl font-semibold text-gray-600">
        Cargando tus solicitudes...
      </p>
    );

  if (error)
    return (
      <p className="text-center mt-10 text-xl font-semibold text-red-500">{error}</p>
    );

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Mis Solicitudes de Adopción
      </h2>

      {solicitudes.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No tienes solicitudes de adopción aún.
        </p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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

            const estadoIcon =
              s.estado === "Pendiente" ? <FaPaw /> :
              s.estado === "Aprobada" ? <FaHeart /> :
              <FaStar />;

            const estadoColor =
              s.estado === "Pendiente" ? "bg-yellow-300 text-yellow-900" :
              s.estado === "Aprobada" ? "bg-green-300 text-green-900" :
              "bg-red-300 text-red-900";

            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative p-1 rounded-3xl hover:scale-105 transition-transform duration-300"
              >
                {/* Fondo brillante animado */}
                <div className="absolute inset-0 rounded-3xl bg-linear-to-tr from-cyan-400 via-purple-400 to-pink-400 blur-xl opacity-50 animate-pulse -z-10"></div>

                <div className="bg-white rounded-3xl p-6 shadow-2xl flex flex-col items-center relative">
                  {/* Imagen con halo */}
                  <div className="relative w-32 h-32 mb-4">
                    <div className="absolute inset-0 rounded-full bg-linear-to-tr from-cyan-400 via-purple-500 to-pink-400 opacity-40 blur-2xl animate-pulse"></div>
                    <img
                      src={urlImagen}
                      alt={animal.nombre}
                      onError={(e) =>
                        ((e.target as HTMLImageElement).src = "/placeholder-animal.png")
                      }
                      className="relative w-full h-full object-cover rounded-full border-4 border-white shadow-lg hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Datos del animal */}
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">{animal.nombre}</h3>
                  <p className="text-gray-700 mb-1">Edad: {animal.edad ?? "Desconocida"} años</p>
                  <p className="text-gray-700 mb-1">Raza: {animal.raza ?? "Desconocida"}</p>
                  {animal.color && <p className="text-gray-500 mb-1">Color: {animal.color}</p>}
                  {animal.tamano && <p className="text-gray-500 mb-1">Tamaño: {animal.tamano}</p>}
                  {animal.descripcion && (
                    <p className="text-gray-500 text-sm mb-2">{animal.descripcion}</p>
                  )}

                  {/* Estado con icono */}
                  <p
                    className={`mb-2 inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-lg ${estadoColor}`}
                  >
                    {estadoIcon} {s.estado}
                  </p>

                  {/* Motivo de rechazo */}
                  {s.estado === "Rechazada" && s.motivoRechazo && (
                    <p className="text-sm text-red-600 mt-1 font-medium text-center">
                      Motivo: {s.motivoRechazo}
                    </p>
                  )}

                  {/* Fecha */}
                  <p className="text-sm text-gray-500 mt-1">
                    Fecha: {fechaMostrar ? new Date(fechaMostrar).toLocaleString("es-BO") : "Desconocida"}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdopcionesUsuario;