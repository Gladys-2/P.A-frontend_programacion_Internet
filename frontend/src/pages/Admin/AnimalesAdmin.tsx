import React, { useState, useEffect } from "react";
import axios from "axios";
import type { Animal, Usuario } from "../../types/types";
import BandejaAnimales from "../../componentes/Bandejas/BandejasAnimales";
import ModalAnimal from "../../componentes/Modal/ModalAnimal";

interface AnimalesAdminProps {
  usuarioLogueado: Usuario;
}

const API_URL = import.meta.env.VITE_API_URL;

const AnimalesAdmin: React.FC<AnimalesAdminProps> = ({ usuarioLogueado }) => {
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [animalSeleccionado, setAnimalSeleccionado] = useState<Animal | null>(null);

  const cargarAnimales = async () => {
    try {
      const res = await axios.get(`${API_URL}/animales`);
      setAnimales(res.data);
    } catch (err) {
      console.error("Error al cargar animales:", err);
    }
  };

  useEffect(() => {
    cargarAnimales();
  }, []);

  const handleEditar = (animal: Animal) => {
    setAnimalSeleccionado(animal);
    setModalAbierto(true);
  };

  const handleAgregar = () => {
    setAnimalSeleccionado(null);
    setModalAbierto(true);
  };

  const handleGuardar = async (animal: Animal) => {
    try {
      if (animal.id) {
        await axios.put(`${API_URL}/animales/editar-animal/${animal.id}`, animal);
      } else {
        await axios.post(`${API_URL}/animales/crear-animal`, animal);
      }
      setModalAbierto(false);
      cargarAnimales();
    } catch (err) {
      console.error("Error al guardar animal:", err);
      alert("No se pudo guardar el animal, intenta de nuevo.");
    }
  };

  const handleToggleEstado = async (animal: Animal) => {
    try {
      await axios.patch(`${API_URL}/animales/${animal.id}/cambiar-estado-animal`);
      cargarAnimales();
    } catch (err) {
      console.error("Error al cambiar estado:", err);
    }
  };

  return (
    <div className="w-full min-h-screen bg-black p-6">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">
        Animales registrados
      </h1>

      {/* Contenedor con borde brillante */}
      <div className="relative p-2 rounded-3xl">
        {/* Brillo alrededor de la tabla */}
        <span className="absolute inset-0 rounded-3xl bg-linear-to-r from-cyan-400 via-purple-500 to-pink-400 opacity-30 blur-2xl animate-pulse pointer-events-none"></span>

        {/* Contenido de la tabla */}
        <div className="relative z-10">
          <BandejaAnimales
            animales={animales}
            usuarioLogueado={usuarioLogueado}
            onEdit={handleEditar}
            onAdd={handleAgregar}
            onToggle={handleToggleEstado}
          />
        </div>
      </div>

      {modalAbierto && (
        <ModalAnimal
          animal={animalSeleccionado}
          onClose={() => setModalAbierto(false)}
          onSave={handleGuardar}
        />
      )}
    </div>
  );
};

export default AnimalesAdmin;