import React, { useState } from "react";
import type { Voluntario, Usuario } from "../../types/types";
import axios from "axios";

interface ModalProps {
  voluntario: Voluntario;
  usuarioLogueado: Usuario;
  onClose: () => void;
  onSave: () => Promise<void>;
}

const API_URL = import.meta.env.VITE_API_URL;

const ModalVoluntario: React.FC<ModalProps> = ({ voluntario, onClose, onSave }) => {
  const [formData, setFormData] = useState<Voluntario>({ ...voluntario });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (
        !formData.nombre ||
        !formData.apellido_paterno ||
        !formData.apellido_materno ||
        !formData.correo_electronico
      ) {
        alert("Por favor, completa todos los campos obligatorios");
        return;
      }

      if (formData.id && formData.id > 0) {
        await axios.put(`${API_URL}/voluntarios/actualizar-voluntario/${formData.id}`, formData);
      } else {
        await axios.post(`${API_URL}/voluntarios/crear-voluntario`, formData);
      }
      await onSave();
      onClose();
    } catch (err) {
      console.error("Error al guardar voluntario:", err);
      alert("No se pudo guardar el voluntario.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 flex flex-col gap-4 shadow-xl animate-scaleIn">
        <h2 className="text-2xl font-bold text-center">
          {voluntario.id ? "Editar Voluntario" : "Registrar Voluntario"}
        </h2>
        <p className="text-sm text-gray-500 text-center">Campos obligatorios</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FloatingInput label="Nombre" name="nombre" value={formData.nombre || ""} onChange={handleChange} />
          <FloatingInput label="Apellido Paterno" name="apellido_paterno" value={formData.apellido_paterno || ""} onChange={handleChange} />
          <FloatingInput label="Apellido Materno" name="apellido_materno" value={formData.apellido_materno || ""} onChange={handleChange} />
          <FloatingInput label="Correo Electrónico" name="correo_electronico" value={formData.correo_electronico || ""} onChange={handleChange} type="email" />
          <FloatingInput label="Teléfono" name="telefono" value={formData.telefono || ""} onChange={handleChange} />
          <FloatingInput label="Área Asignada" name="areaAsignada" value={formData.areaAsignada || ""} onChange={handleChange} />
          <FloatingInput label="Disponibilidad" name="disponibilidad" value={formData.disponibilidad || ""} onChange={handleChange} />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={handleSubmit} className={buttonGuardar}>
            {voluntario.id ? "Actualizar" : "Guardar"}
          </button>
          <button onClick={onClose} className={buttonCancelar}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

const FloatingInput: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  type?: string;
}> = ({ label, name, value, onChange, type = "text" }) => (
  <div className="relative flex-1">
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder=" "
      className="peer border border-gray-300 px-3 pt-5 pb-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all shadow-sm hover:shadow-cyan-200 text-gray-900 bg-white"
    />
    <label
      className={`absolute left-3 text-sm font-medium transition-all pointer-events-none
        ${value ? "-top-2 text-cyan-500 bg-white px-1" : "top-3 text-gray-400 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400"}`}
    >
      {label}
    </label>
  </div>
);

const buttonGuardar = "bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-cyan-300 transition-all transform hover:scale-105";
const buttonCancelar = "bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-xl font-semibold shadow-md transition-all transform hover:scale-105";

export default ModalVoluntario;