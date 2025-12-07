import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import type { Animal, Usuario } from "../../types/types";

const COLOR_TITULO = "#000000";
const COLOR_BOTON = "#14B8A6";
const COLOR_BOTON_HOVER = "#0D9488"; 
const COLOR_VERDE = "#4CAF50";
const COLOR_CORAL = "#FF7E6B";
const COLOR_AMARILLO = "#FFC107";

const styleBotonAdoptar = `mt-4 w-full py-3 rounded-xl text-white font-semibold transition-all duration-300 shadow-md focus:outline-none focus:ring-4 focus:ring-opacity-50`;

interface AnimalesUsuarioProps {
  usuario: Usuario;
}

const API_URL = import.meta.env.VITE_API_URL;

const AnimalesUsuario: React.FC<AnimalesUsuarioProps> = ({ usuario }) => {
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [cargando, setCargando] = useState(true);
  const [likes, setLikes] = useState<Record<number, { liked: boolean; count: number }>>({});
  const [filtro, setFiltro] = useState<string>("Todos");
  const [tieneAdopcionActiva, setTieneAdopcionActiva] = useState(false);

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

  const cargarAdopcionesUsuario = async () => {
    try {
      const res = await fetch(`${API_URL}/adopciones/usuario/${usuario.id}`);
      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
      const data = await res.json();
      const activa = data.some(
        (a: any) => a.estado === "Pendiente" || a.estado === "Aprobada"
      );
      setTieneAdopcionActiva(activa);
    } catch (err) {
      console.error("Error al cargar adopciones del usuario:", err);
    }
  };

  useEffect(() => {
    cargarAnimales();
    cargarAdopcionesUsuario();
    const guardado = JSON.parse(localStorage.getItem("likes") || "{}");
    setLikes(guardado);
  }, [usuario.id]);

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

  const solicitarAdopcion = async (animalId: number) => {
    if (tieneAdopcionActiva) {
      alert("Solo puedes tener una adopción activa.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/adopciones/crear-adopcion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuarioId: usuario.id, animalId, estado: "Pendiente" }),
      });

      if (res.ok) {
        alert("Solicitud de adopción enviada correctamente!");
        cargarAnimales();
        cargarAdopcionesUsuario();
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

  const animalesFiltrados = (filtro === "Todos"
    ? animales
    : animales.filter(a => (a.especie?.toLowerCase() || "") === filtro.toLowerCase())
  ).filter(a => a.estado_animal === "Disponible"); // SOLO DISPONIBLES

  const getColorEstado = (estado: string) => {
    switch (estado) {
      case "Disponible":
        return { bg: "#E0F7FA", color: COLOR_VERDE, shadow: "0 0 10px #4CAF5070" };
      case "Adoptado":
        return { bg: "#FFE0E0", color: COLOR_CORAL, shadow: "0 0 10px #FF7E6B70" };
      case "En cuidado":
        return { bg: "#FFF8E1", color: COLOR_AMARILLO, shadow: "0 0 10px #FFC10770" };
      default:
        return { bg: "#F0F0F0", color: "#6B7280", shadow: "0 0 8px #6B728070" };
    }
  };

  return (
    <div className="p-6 min-h-screen bg-white">
      <h2 className="text-4xl font-serif font-extrabold text-center mb-4 pt-8" style={{ color: COLOR_TITULO }}>
        Albergue Patitas Felices – Animales
      </h2>

      {tieneAdopcionActiva && (
        <div className="text-center mb-6 p-4 bg-yellow-200 text-yellow-900 font-semibold rounded-lg shadow-md">
          Ya tienes una adopción activa. No puedes solicitar otra hasta que se complete o sea rechazada.
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-4 mb-12">
        <button
          onClick={() => setFiltro("Todos")}
          className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300 shadow-md ${
            filtro === "Todos" ? "bg-teal-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-teal-400 hover:text-white"
          }`}
        >
          Todos
        </button>
        {categorias.map(cat => (
          <button
            key={cat}
            onClick={() => setFiltro(cat)}
            className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300 shadow-md ${
              filtro === cat ? "bg-teal-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-teal-400 hover:text-white"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {animalesFiltrados.map((a, i) => {
          const likedData = a.id !== undefined ? likes[a.id] || { liked: false, count: 0 } : { liked: false, count: 0 };
          const colorEstado = getColorEstado(a.estado_animal || "");

          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ scale: 1.04, boxShadow: "0px 12px 25px rgba(0,0,0,0.2)" }}
              className="bg-white rounded-3xl overflow-hidden flex flex-col cursor-pointer border-2 border-transparent hover:border-teal-400 transition-all duration-300 shadow-lg"
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
                  className="absolute top-4 right-4 text-white text-2xl drop-shadow-md z-10 p-2 rounded-full backdrop-blur-sm bg-black/30"
                >
                  {likedData.liked ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-white" />}
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="text-2xl font-semibold mb-3" style={{ color: COLOR_TITULO }}>{a.nombre}</h4>
                  <p className="text-gray-600 text-sm"><span className="font-semibold">Raza:</span> {a.raza || "—"}</p>
                  <p className="text-gray-600 text-sm"><span className="font-semibold">Edad:</span> {a.edad ?? "—"} años</p>
                  <p className="text-gray-600 text-sm"><span className="font-semibold">Sexo:</span> {a.sexo || "—"}</p>
                  <p className="text-gray-600 text-sm"><span className="font-semibold">Tamaño:</span> {a.tamano || "—"}</p>
                  <p className="text-gray-600 text-sm"><span className="font-semibold">Peso:</span> {a.peso ?? "—"} kg</p>
                  <p className="text-gray-600 text-sm italic mt-2 line-clamp-2">{a.descripcion || "Sin descripción disponible"}</p>

                  <span
                    style={{ backgroundColor: colorEstado.bg, color: colorEstado.color, boxShadow: colorEstado.shadow }}
                    className="inline-block px-3 py-1 text-xs font-bold rounded-full mt-2"
                  >
                    {a.estado_animal}
                  </span>
                </div>

                <motion.button
                  style={{ backgroundColor: COLOR_BOTON }}
                  className={`${styleBotonAdoptar} ${a.estado_animal !== "Disponible" || tieneAdopcionActiva ? "opacity-50 cursor-not-allowed" : ""}`}
                  whileHover={a.estado_animal === "Disponible" && !tieneAdopcionActiva ? { backgroundColor: COLOR_BOTON_HOVER, scale: 1.02 } : {}}
                  whileTap={a.estado_animal === "Disponible" && !tieneAdopcionActiva ? { scale: 0.97 } : {}}
                  disabled={a.estado_animal !== "Disponible" || tieneAdopcionActiva}
                  onClick={() => a.estado_animal === "Disponible" && a.id !== undefined && solicitarAdopcion(a.id)}
                >
                  Adoptar
                </motion.button>

                <p className="mt-1 text-sm text-center text-gray-500 font-medium">
                  {likedData.count} {likedData.count === 1 ? "Corazón" : "Corazones"}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AnimalesUsuario;