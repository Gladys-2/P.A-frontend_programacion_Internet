import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhone, FaCalendarAlt, FaUser } from "react-icons/fa";
import Confetti from "react-confetti";
import { useIdioma } from "../../context/idiomaContext";

const API_URL = import.meta.env.VITE_API_URL;

export interface Voluntario {
  id?: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  fechaNacimiento?: string;
  telefono?: string;
  correo_electronico: string;
  direccion?: string;
  areaAsignada?: string;
  disponibilidad?: string;
  estado?: "Activo" | "Inactivo";
}

const AREAS = [
  "Cuidado de animales",
  "Eventos y recaudación",
  "Educación y concientización",
  "Administración",
  "Transporte",
];

const VoluntariosUsuario: React.FC = () => {
  const { t: translate } = useIdioma();
  const [, setAnimar] = useState(false);
  const [confeti, setConfeti] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimar(true), 100);
  }, []);

  const [form, setForm] = useState<Voluntario>({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    fechaNacimiento: "",
    telefono: "",
    correo_electronico: "",
    direccion: "",
    areaAsignada: "",
    disponibilidad: "",
  });

  const [mensaje, setMensaje] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  // Validaciones en inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Nombres y apellidos solo letras y espacios
    if (["nombre", "apellido_paterno", "apellido_materno"].includes(name)) {
      if (!/^[a-zA-ZÀ-ÿ\s]*$/.test(value)) return;
    }

    // Teléfono solo números, máximo 8
    if (name === "telefono") {
      if (!/^\d{0,8}$/.test(value)) return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);

    // Validaciones
    if (
      !form.nombre.trim() ||
      !form.apellido_paterno.trim() ||
      !form.apellido_materno.trim() ||
      !form.correo_electronico.trim()
    ) {
      setMensaje("Por favor completa tu nombre, apellidos y correo.");
      return;
    }

    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(form.nombre)) {
      setMensaje("El nombre solo puede contener letras.");
      return;
    }
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(form.apellido_paterno)) {
      setMensaje("El apellido paterno solo puede contener letras.");
      return;
    }
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(form.apellido_materno)) {
      setMensaje("El apellido materno solo puede contener letras.");
      return;
    }
    if (form.telefono && !/^\d{8}$/.test(form.telefono)) {
      setMensaje("El teléfono debe tener exactamente 8 números.");
      return;
    }

    try {
      setCargando(true);
      const { data } = await axios.post(`${API_URL}/voluntarios/crear-voluntario`, form);

      setMensaje(data.message || "¡Gracias por unirte a nuestro equipo de voluntarios!");
      setConfeti(true);

      setForm({
        nombre: "",
        apellido_paterno: "",
        apellido_materno: "",
        fechaNacimiento: "",
        telefono: "",
        correo_electronico: "",
        direccion: "",
        areaAsignada: "",
        disponibilidad: "",
      });

      setTimeout(() => setConfeti(false), 5000);
    } catch (error: any) {
      console.error(error);
      // Si el backend devuelve mensaje, úsalo
      setMensaje(error.response?.data?.message || "Error al registrar. Intenta nuevamente.");
    } finally {
      setCargando(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
  };

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{
        backgroundImage:
          "url('https://www.tiendanimal.es/articulos/wp-content/uploads/2025/10/como-hacer-voluntariado-refugio-animales.jpg')",
      }}
    >
      {confeti && <Confetti recycle={false} numberOfPieces={300} />}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-5xl bg-white/90 backdrop-blur-md shadow-2xl rounded-xl overflow-hidden p-6"
        style={{ minHeight: "70vh" }}
      >
        <h2 className="text-3xl lg:text-4xl font-bold text-black mb-6 text-center">
          {translate("¡Hazte Voluntario!")}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <InputIcon
            icon={<FaUser />}
            placeholder={translate("Nombre")}
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
          />
          <InputIcon
            icon={<FaUser />}
            placeholder={translate("Apellido Paterno")}
            name="apellido_paterno"
            value={form.apellido_paterno}
            onChange={handleChange}
          />
          <InputIcon
            icon={<FaUser />}
            placeholder={translate("Apellido Materno")}
            name="apellido_materno"
            value={form.apellido_materno}
            onChange={handleChange}
          />
          <InputIcon
            icon={<FaCalendarAlt />}
            placeholder={translate("Fecha de nacimiento")}
            name="fechaNacimiento"
            type="date"
            value={form.fechaNacimiento || ""}
            onChange={handleChange}
          />
          <InputIcon
            icon={<FaPhone />}
            placeholder={translate("Teléfono")}
            name="telefono"
            type="tel"
            value={form.telefono || ""}
            onChange={handleChange}
          />
          <InputIcon
            icon={<FaEnvelope />}
            placeholder={translate("Correo electrónico")}
            name="correo_electronico"
            type="email"
            value={form.correo_electronico || ""}
            onChange={handleChange}
          />
          <InputIcon
            icon={<FaUser />}
            placeholder={translate("Dirección")}
            name="direccion"
            value={form.direccion || ""}
            onChange={handleChange}
          />

          <div className="flex flex-col border border-teal-500 rounded-md p-1 bg-white/20 shadow-inner">
            <label className="text-teal-500 font-medium text-sm mb-1">
              {translate("Área de interés")}
            </label>
            <select
              name="areaAsignada"
              value={form.areaAsignada}
              onChange={handleChange}
              className="p-1 rounded-md outline-none text-sm bg-white/20"
            >
              <option value="">{translate("Selecciona un área")}</option>
              {AREAS.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col border border-teal-500 rounded-md p-1 bg-white/20 shadow-inner">
            <label className="text-teal-500 font-medium text-sm mb-1">
              {translate("Disponibilidad")}
            </label>
            <input
              type="text"
              placeholder={translate("Escribe tu disponibilidad")}
              name="disponibilidad"
              value={form.disponibilidad || ""}
              onChange={handleChange}
              className="p-1 rounded-md outline-none text-sm bg-white/20"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="md:col-span-2 w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-md font-semibold shadow-md transition-all"
          >
            {cargando ? translate("Enviando...") : translate("Registrarme")}
          </button>
        </form>

        {mensaje && (
          <p
            className={`text-center font-semibold mt-3 p-2 rounded-md text-sm ${
              mensaje.includes("Gracias")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {mensaje}
          </p>
        )}
      </motion.div>
    </div>
  );
};

interface InputIconProps {
  icon: React.ReactNode;
  placeholder: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  type?: string;
}

const InputIcon: React.FC<InputIconProps> = ({
  icon,
  placeholder,
  name,
  value,
  onChange,
  type = "text",
}) => (
  <div className="relative flex items-center gap-2 border border-teal-500 rounded-md px-3 py-1.5 bg-white/20 shadow-inner text-sm">
    <span className="text-black text-base">{icon}</span>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full bg-transparent outline-none text-black text-sm pt-3 pb-1"
    />
    <label
      className={`absolute left-10 transition-all duration-300 pointer-events-none ${
        value ? "-top-1 text-xs text-black" : "top-2 text-sm text-gray-600"
      }`}
    >
      {placeholder}
    </label>
  </div>
);

export default VoluntariosUsuario;