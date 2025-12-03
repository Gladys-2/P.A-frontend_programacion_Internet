import React, { useState, useEffect } from "react";
import type { Animal } from "../../types/types.ts";
import axios from "axios";

interface ModalAnimalProps {
  animal: Animal | null;
  onClose: () => void;
  onSave: (animal: Animal) => void;
}

const API_URL = import.meta.env.VITE_API_URL;

const ModalAnimal: React.FC<ModalAnimalProps> = ({ animal, onClose, onSave }) => {
  const [nombre, setNombre] = useState("");
  const [especie, setEspecie] = useState("");
  const [raza, setRaza] = useState("");
  const [edad, setEdad] = useState("");
  const [sexo, setSexo] = useState<"Macho" | "Hembra">("Macho");
  const [descripcion, setDescripcion] = useState("");
  const [tamano, setTamano] = useState<"Pequeño" | "Mediano" | "Grande" | "">("");
  const [peso, setPeso] = useState("");
  const [vacunado, setVacunado] = useState(false);
  const [esterilizado, setEsterilizado] = useState(false);
  const [estadoAnimal, setEstadoAnimal] = useState<"Disponible" | "Adoptado" | "En cuidado">("Disponible");
  const [foto, setFoto] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (animal) {
      setNombre(animal.nombre ?? "");
      setEspecie(animal.especie ?? "");
      setRaza(animal.raza ?? "");
      setEdad(animal.edad?.toString() ?? "");
      setSexo(animal.sexo ?? "Macho");
      setDescripcion(animal.descripcion ?? "");
      setTamano(animal.tamano ?? "");
      setPeso(animal.peso?.toString() ?? "");
      setVacunado(animal.vacunado ?? false);
      setEsterilizado(animal.esterilizado ?? false);
      setEstadoAnimal(
        ["Disponible", "Adoptado", "En cuidado"].includes(animal.estado_animal ?? "")
          ? (animal.estado_animal as "Disponible" | "Adoptado" | "En cuidado")
          : "Disponible"
      );
      setFoto(animal.foto ?? "");
    } else {
      setNombre("");
      setEspecie("");
      setRaza("");
      setEdad("");
      setSexo("Macho");
      setDescripcion("");
      setTamano("");
      setPeso("");
      setVacunado(false);
      setEsterilizado(false);
      setEstadoAnimal("Disponible");
      setFoto("");
    }
    setErrorMessage("");
  }, [animal]);

  const handleSubmit = async () => {
    setErrorMessage("");

    if (!nombre || !especie || !raza || !edad || !descripcion || !foto) {
      setErrorMessage("Por favor, completa todos los campos obligatorios");
      return;
    }

    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜ\s]+$/;
    if (!regex.test(nombre)) return setErrorMessage("El nombre solo debe contener letras");
    if (!regex.test(especie)) return setErrorMessage("La especie solo debe contener letras");
    if (!regex.test(raza)) return setErrorMessage("La raza solo debe contener letras");

    const animalPayload: Animal = {
      id: animal?.id,
      nombre,
      especie,
      raza,
      edad: Number(edad),
      sexo,
      descripcion,
      tamano: tamano || undefined,
      peso: peso ? Number(peso) : undefined,
      vacunado,
      esterilizado,
      estado_animal: estadoAnimal,
      foto,
      refugio_id: animal?.refugio_id || 1,
      longitud: 0,
      latitud: 0,
      liked: undefined,
      imagen: undefined
    };

    try {
      setGuardando(true);
      let resAnimal: Animal;
      if (animal?.id) {
        const res = await axios.put(`${API_URL}/animales/editar-animal/${animal.id}`, animalPayload);
        resAnimal = res.data.data;
      } else {
        const res = await axios.post(`${API_URL}/animales/crear-animal`, animalPayload);
        resAnimal = res.data.data;
      }
      onSave(resAnimal);
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMessage("No se pudo guardar el animal. Intenta nuevamente.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg p-6 flex flex-col gap-4 shadow-xl animate-scaleIn">
        <h2 className="text-2xl font-bold text-center">
          {animal ? "Editar Animal" : "Registrar Animal"}
        </h2>
        <p className="text-sm text-gray-500 text-center">Campos con son obligatorios</p>

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded-xl text-sm font-medium">
            <strong>Error:</strong> {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FloatingInput label="Nombre" value={nombre} onChange={setNombre} />
          <FloatingInput label="Especie" value={especie} onChange={setEspecie} />
          <FloatingInput label="Raza" value={raza} onChange={setRaza} />
          <FloatingInput label="Edad " value={edad} onChange={setEdad} type="number" />
        </div>

        <FloatingInput label="URL de la foto " value={foto} onChange={setFoto} />
        {foto && <img src={foto} alt="preview" className="w-full h-36 object-cover rounded-lg" />}
        <FloatingTextarea label="Descripción " value={descripcion} onChange={setDescripcion} />

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <FloatingSelect label="Sexo" value={sexo} onChange={(e) => setSexo(e.target.value as "Macho" | "Hembra")} options={[
            { value: "Macho", label: "Macho" }, { value: "Hembra", label: "Hembra" }
          ]} />

          <FloatingSelect label="Tamaño" value={tamano} onChange={(e) => setTamano(e.target.value as "Pequeño" | "Mediano" | "Grande")} options={[
            { value: "", label: "Sin especificar", disabled: true },
            { value: "Pequeño", label: "Pequeño" },
            { value: "Mediano", label: "Mediano" },
            { value: "Grande", label: "Grande" },
          ]} />

          <FloatingSelect label="Estado" value={estadoAnimal} onChange={(e) => setEstadoAnimal(e.target.value as "Disponible" | "Adoptado" | "En cuidado")} options={[
            { value: "Disponible", label: "Disponible" },
            { value: "Adoptado", label: "Adoptado" },
            { value: "En cuidado", label: "En cuidado" },
          ]} />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <FloatingSelect label="Vacunado" value={vacunado ? "true" : "false"} onChange={(e) => setVacunado(e.target.value === "true")} options={[
            { value: "true", label: "Sí" }, { value: "false", label: "No" }
          ]} />
          <FloatingSelect label="Esterilizado" value={esterilizado ? "true" : "false"} onChange={(e) => setEsterilizado(e.target.value === "true")} options={[
            { value: "true", label: "Sí" }, { value: "false", label: "No" }
          ]} />
          <FloatingInput label="Peso (kg)" value={peso} onChange={setPeso} type="number" />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={handleSubmit} disabled={guardando} className={`${buttonGuardar} ${guardando ? "opacity-50 cursor-not-allowed" : ""}`}>
            {guardando ? "Guardando..." : "Guardar Registro"}
          </button>
          <button onClick={onClose} disabled={guardando} className={buttonCancelar}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};
// --- Componentes Reutilizables con estilo mejorado ---
const FloatingInput: React.FC<{ label: string; value: string; onChange: (val: string) => void; type?: string }> = ({ label, value, onChange, type = "text" }) => (
  <div className="relative flex-1">
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
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

const FloatingTextarea: React.FC<{ label: string; value: string; onChange: (val: string) => void }> = ({ label, value, onChange }) => (
  <div className="relative w-full">
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder=" "
      className="peer border border-gray-300 px-3 pt-5 pb-2 rounded-xl w-full h-24 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all shadow-sm hover:shadow-cyan-200 text-gray-900 resize-none bg-white"
    />
    <label
      className={`absolute left-3 text-sm font-medium transition-all pointer-events-none
        ${value ? "-top-2 text-cyan-500 bg-white px-1" : "top-3 text-gray-400 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400"}`}
    >
      {label}
    </label>
  </div>
);

const FloatingSelect: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: { value: string; label: string; disabled?: boolean }[] }> = ({ label, value, onChange, options }) => (
  <div className="relative flex-1">
    <label className="absolute -top-2 left-3 text-xs font-semibold text-cyan-500 bg-white px-1">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="border border-gray-300 px-3 pt-4 pb-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all shadow-sm hover:shadow-cyan-200 text-gray-900 appearance-none bg-white font-medium"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} disabled={opt.disabled}>
          {opt.label}
        </option>
      ))}
    </select>
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </div>
  </div>
);

// --- Botones con estilo más estético ---
const buttonGuardar = "bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-cyan-300 transition-all transform hover:scale-105";
const buttonCancelar = "bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-xl font-semibold shadow-md transition-all transform hover:scale-105";

export default ModalAnimal;