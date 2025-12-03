import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaHeart, FaRegHeart, FaPaw } from "react-icons/fa";
import type { Animal, Usuario } from "../../types/types";

const COLOR_TITULO = "#1E3A8A";
const COLOR_BOTON = "#4DA6FF";
const COLOR_BOTON_HOVER = "#3399FF";
const COLOR_VERDE = "#8AA85B";
const COLOR_CORAL = "#FF7E6B";
const COLOR_AMARILLO = "#FFC107"; 
const COLOR_FONDO = "#E6F7FF";

const styleBotonAdoptar = `mt-4 w-full py-3 rounded-xl text-white font-semibold transition-all duration-300 shadow-md focus:outline-none focus:ring-4 focus:ring-opacity-50`;

interface AnimalesUsuarioProps {
  usuario: Usuario;
}

const API_URL = import.meta.env.VITE_API_URL;

const AnimalesUsuario: React.FC<AnimalesUsuarioProps> = ({ usuario }) => {
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [cargando, setCargando] = useState(true);
  const [likes, setLikes] = useState<Record<number, { liked: boolean; count: number }>>({});

  // Cargar animales desde backend
  const cargarAnimales = async () => {
    try {
      const res = await fetch(`${API_URL}/animales`);
      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
      const data: Animal[] = await res.json();
      setAnimales(data.map(a => ({ ...a, liked: a.liked ?? false, likes: 0 })));
    } catch (err) {
      console.error("Error al cargar animales:", err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarAnimales();
    const guardado = JSON.parse(localStorage.getItem("likes") || "{}");
    setLikes(guardado);
  }, []);

  // Likes
  const toggleLike = (id?: number) => {
    if (id === undefined) return;

    setAnimales(prev =>
      prev.map(a => {
        if (a.id === id) {
          const nuevoLiked = !a.liked;
          const currentCount = likes[id]?.count ?? 0;
          const nuevoCount = nuevoLiked ? currentCount + 1 : Math.max(currentCount - 1, 0);
          return { ...a, liked: nuevoLiked, likes: nuevoCount };
        }
        return a;
      })
    );

    const currentData = likes[id] || { liked: false, count: 0 };
    const nuevoLiked = !currentData.liked;
    const nuevoCount = nuevoLiked ? currentData.count + 1 : Math.max(currentData.count - 1, 0);

    const nuevoLikes = { ...likes, [id]: { liked: nuevoLiked, count: nuevoCount } };
    setLikes(nuevoLikes);
    localStorage.setItem("likes", JSON.stringify(nuevoLikes));
  };

  // Solicitar adopción
  const solicitarAdopcion = async (animalId: number) => {
    try {
      const res = await fetch(`${API_URL}/adopciones/crear-adopcion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuarioId: usuario.id, animalId, estado: "Pendiente" }),
      });

      if (res.ok) {
        alert("Solicitud de adopción enviada correctamente!");
        cargarAnimales();
      } else {
        const errData = await res.json();
        alert(`Error al enviar la solicitud: ${errData.message || res.status}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error al enviar la solicitud");
    }
  };

  if (cargando)
    return <p className="text-center mt-20 text-xl font-semibold text-gray-600">Cargando animales...</p>;

  const categorias = Array.from(new Set(animales.map(a => a.especie?.toLowerCase() || ""))).filter(cat => cat !== "");

  const getColorEstado = (estado: string) => {
    switch (estado) {
      case "Disponible":
        return { bg: `${COLOR_VERDE}20`, color: COLOR_VERDE };
      case "Adoptado":
        return { bg: "#FEE2E2", color: COLOR_CORAL };
      case "En cuidado":
        return { bg: `${COLOR_AMARILLO}30`, color: COLOR_AMARILLO };
      default:
        return { bg: "#E5E7EB", color: "#6B7280" };
    }
  };

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: COLOR_FONDO }}>
      <h2 className="text-4xl font-serif font-extrabold text-center mb-16 pt-8" style={{ color: COLOR_TITULO }}>
        Albergue Patitas Felices – Animales
      </h2>

      {categorias.map(cat => (
        <div key={cat} className="mb-16">
          <h3 className="text-3xl font-bold capitalize mb-8 flex items-center" style={{ color: COLOR_TITULO }}>
            <FaPaw className="mr-3 text-2xl text-blue-400" /> {cat}s en Adopción
          </h3>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {animales
              .filter(a => (a.especie?.toLowerCase() || "") === cat)
              .map((a, i) => {
                const likedData = a.id !== undefined ? likes[a.id] || { liked: false, count: 0 } : { liked: false, count: 0 };
                const colorEstado = getColorEstado(a.estado_animal || "");

                return (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    whileHover={{ scale: 1.03, boxShadow: "0px 12px 25px rgba(0,0,0,0.15)" }}
                    className="bg-white rounded-3xl overflow-hidden flex flex-col shadow-md cursor-pointer transition-shadow duration-300"
                  >
                    <div className="overflow-hidden h-60 relative rounded-t-3xl">
                      <motion.img
                        src={a.foto?.startsWith("http") ? a.foto : `${API_URL}/${a.foto}`}
                        alt={a.nombre}
                        className="w-full h-full object-cover transition-transform duration-500"
                        whileHover={{ scale: 1.05 }}
                      />
                      <button
                        onClick={e => { e.stopPropagation(); toggleLike(a.id); }}
                        className="absolute top-4 right-4 text-white text-2xl drop-shadow-md z-10 p-2 rounded-full backdrop-blur-sm bg-black/20"
                      >
                        {likedData.liked ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-white" />}
                      </button>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-2xl font-semibold mb-1" style={{ color: COLOR_TITULO }}>{a.nombre}</h4>
                        <p className="text-gray-600 text-sm mb-2">
                          Raza: {a.raza || "—"} | Edad: {a.edad ?? "—"} años
                        </p>
                        <p className="text-gray-600 text-sm italic mb-3 line-clamp-2">
                          {a.descripcion || "Sin descripción disponible"}
                        </p>
                        <span
                          style={{ backgroundColor: colorEstado.bg, color: colorEstado.color }}
                          className="inline-block px-3 py-1 text-xs font-bold rounded-full"
                        >
                          {a.estado_animal}
                        </span>
                      </div>

                      <motion.button
                        style={{ backgroundColor: COLOR_BOTON }}
                        className={`${styleBotonAdoptar} ${a.estado_animal !== "Disponible" ? "opacity-50 cursor-not-allowed" : ""}`}
                        whileHover={a.estado_animal === "Disponible" ? { backgroundColor: COLOR_BOTON_HOVER, scale: 1.02 } : {}}
                        whileTap={a.estado_animal === "Disponible" ? { scale: 0.97 } : {}}
                        disabled={a.estado_animal !== "Disponible"}
                        onClick={() => a.estado_animal === "Disponible" && a.id !== undefined && solicitarAdopcion(a.id)}
                      >
                        Adoptar
                      </motion.button>

                      <p className="mt-3 text-sm text-center text-gray-500 font-medium">
                        {likedData.count} {likedData.count === 1 ? "Corazón" : "Corazones"} de interés
                      </p>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnimalesUsuario;