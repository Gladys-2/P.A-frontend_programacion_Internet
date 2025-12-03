import React, { useState, useEffect } from "react";
import type { Voluntario, Usuario } from "../../types/types";
import ModalVoluntario from "../../componentes/Modal/ModalVoluntarios";
import BandejaVoluntario from "../../componentes/Bandejas/BandejaVoluntario";
import axios from "axios";
import { FaSearch } from "react-icons/fa";

interface VoluntariosProps {
  usuarioLogueado: Usuario;
}

const API_URL = import.meta.env.VITE_API_URL;

const VoluntariosAdmin: React.FC<VoluntariosProps> = ({ usuarioLogueado }) => {
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [modalVoluntario, setModalVoluntario] = useState<Voluntario | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  const fetchVoluntarios = async () => {
    try {
      setCargando(true);
      const res = await axios.get(`${API_URL}/voluntarios/listar-voluntarios`);
      setVoluntarios(res.data.data.map((v: Voluntario) => ({ ...v, estado: v.estado ?? "Activo" })));
    } catch (err) {
      console.error("Error al obtener voluntarios:", err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { fetchVoluntarios(); }, []);

  const handleEdit = (voluntario: Voluntario) => setModalVoluntario(voluntario);

  const handleCreate = () => setModalVoluntario({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    correo_electronico: "",
    telefono: "",
    areaAsignada: "",
    disponibilidad: "",
    estado: "Activo",
  });

  const handleToggle = async (voluntario: Voluntario) => {
    if (!voluntario.id) return;
    const nuevoEstado = voluntario.estado === "Activo" ? "Inactivo" : "Activo";

    try {
      await axios.put(`${API_URL}/voluntarios/actualizar-voluntario/${voluntario.id}`, { estado: nuevoEstado });
      setVoluntarios(prev => prev.map(v => (v.id === voluntario.id ? { ...v, estado: nuevoEstado } : v)));
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      alert("No se pudo cambiar el estado del voluntario.");
    }
  };

  const handleSave = async () => {
    await fetchVoluntarios();
    setModalVoluntario(null);
  };

  const voluntariosFiltrados = voluntarios.filter(v =>
    v.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    v.apellido_paterno.toLowerCase().includes(busqueda.toLowerCase()) ||
    v.correo_electronico.toLowerCase().includes(busqueda.toLowerCase()) ||
    (v.areaAsignada?.toLowerCase().includes(busqueda.toLowerCase()) ?? false)
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Voluntarios</h1>

      <div className="flex flex-col md:flex-row md:justify-between mb-4 gap-2 items-center">
        <div className="relative w-full md:w-1/3">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar voluntarios..."
            className="border px-10 py-2 rounded-3xl w-full shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>
        <button
          onClick={handleCreate}
          className="bg-cyan-200 hover:bg-cyan-400 text-white px-5 py-2 rounded-3xl shadow-xl font-semibold transition-transform transform hover:scale-105"
        >
          + Agregar Voluntario
        </button>
      </div>

      {cargando ? (
        <div className="text-center py-20 text-gray-500">Cargando voluntarios...</div>
      ) : voluntariosFiltrados.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No hay voluntarios para mostrar.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {voluntariosFiltrados.map(v => (
            <BandejaVoluntario
              key={v.id}
              voluntario={v}
              onEdit={() => handleEdit(v)}
              onToggle={() => handleToggle(v)}
            />
          ))}
        </div>
      )}

      {modalVoluntario && (
        <ModalVoluntario
          voluntario={modalVoluntario}
          usuarioLogueado={usuarioLogueado}
          onClose={() => setModalVoluntario(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default VoluntariosAdmin;