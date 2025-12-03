import React, { useState, useEffect } from "react";
import axios from "axios";
import type { Animal, Usuario } from "../../types/types";
import BandejaAnimales from "../../componentes/Bandejas/BandejasAnimales";
import ModalAnimal from "../../componentes/Modal/ModalAnimal";

interface AnimalesProps {
  usuarioLogueado: Usuario;
}

const API_URL = import.meta.env.VITE_API_URL;

const Animales: React.FC<AnimalesProps> = ({ usuarioLogueado }) => {
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
    <div className="p-4">
      <BandejaAnimales
        animales={animales}
        usuarioLogueado={usuarioLogueado}
        onEdit={handleEditar}
        onAdd={handleAgregar}
        onToggle={handleToggleEstado}
      />

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

export default Animales;