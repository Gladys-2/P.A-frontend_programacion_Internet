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
  const [animar, setAnimar] = useState(false);
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);

    if (
      !form.nombre.trim() ||
      !form.apellido_paterno.trim() ||
      !form.correo_electronico.trim()
    ) {
      setMensaje("Por favor completa tu nombre, apellido paterno y correo.");
      return;
    }

    try {
      setCargando(true);
      await axios.post(`${API_URL}/voluntarios/crear-voluntario`, form);
      setMensaje("¡Gracias por unirte a nuestro equipo de voluntarios!");
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
    } catch (error) {
      console.error(error);
      setMensaje("Error al registrar. Intenta nuevamente.");
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
      className="w-full min-h-screen flex items-center justify-center bg-cover bg-center p-6"
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
        className="flex flex-col lg:flex-row w-full max-w-6xl bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden"
        style={{ minHeight: "80vh" }}
      >
        {/* Formulario */}
        <div className="lg:w-1/1 p-10 flex flex-col justify-center bg-white/0">
          <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6 text-center">
            {translate("¡Hazte Voluntario!")}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
            <InputIcon
              icon={<FaUser />}
              placeholder={translate("Nombre")}
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              animar={animar}
            />

            <InputIcon
              icon={<FaUser />}
              placeholder={translate("Apellido Paterno")}
              name="apellido_paterno"
              value={form.apellido_paterno}
              onChange={handleChange}
              animar={animar}
            />

            <InputIcon
              icon={<FaUser />}
              placeholder={translate("Apellido Materno")}
              name="apellido_materno"
              value={form.apellido_materno}
              onChange={handleChange}
              animar={animar}
            />

            <InputIcon
              icon={<FaCalendarAlt />}
              placeholder={translate("Fecha de nacimiento")}
              name="fechaNacimiento"
              type="date"
              value={form.fechaNacimiento || ""}
              onChange={handleChange}
              animar={animar}
            />

            <InputIcon
              icon={<FaPhone />}
              placeholder={translate("Teléfono")}
              name="telefono"
              type="tel"
              value={form.telefono || ""}
              onChange={handleChange}
              animar={animar}
            />

            <InputIcon
              icon={<FaEnvelope />}
              placeholder={translate("Correo electrónico")}
              name="correo_electronico"
              type="email"
              value={form.correo_electronico || ""}
              onChange={handleChange}
              animar={animar}
            />

            <InputIcon
              icon={<FaUser />}
              placeholder={translate("Dirección")}
              name="direccion"
              value={form.direccion || ""}
              onChange={handleChange}
              animar={animar}
            />

            {/* Área de interés */}
            <div
              className={`flex flex-col border border-teal-500 rounded-lg p-2 bg-white/20 backdrop-blur-sm shadow-inner transition-all duration-900 ${
                animar ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <label className="text-teal-500 font-medium mb-1">
                {translate("Área de interés")}
              </label>
              <select
                name="areaAsignada"
                value={form.areaAsignada}
                onChange={handleChange}
                className="p-2 rounded-lg outline-none bg-white/20"
              >
                <option value="">{translate("Selecciona un área")}</option>
                {AREAS.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            {/* Disponibilidad */}
            <div
              className={`flex flex-col border border-teal-500 rounded-lg p-2 bg-white/20 backdrop-blur-sm shadow-inner transition-all duration-700 ${
                animar ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <label className="text-teal-500 font-medium mb-1">
                {translate("Disponibilidad")}
              </label>
              <input
                type="text"
                placeholder={translate("Escribe tu disponibilidad")}
                name="disponibilidad"
                value={form.disponibilidad || ""}
                onChange={handleChange}
                className="p-2 rounded-lg outline-none bg-white/20"
              />
            </div>

            <button
              type="submit"
              disabled={cargando}
              className={`w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-md font-semibold shadow-md transition-all duration-500 ${
                animar ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {cargando ? translate("Enviando...") : translate("Registrarme")}
            </button>
          </form>

          {mensaje && (
            <p
              className={`text-center font-semibold mt-4 p-2 rounded-lg ${
                mensaje.includes("Gracias")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {mensaje}
            </p>
          )}
        </div>
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
  animar?: boolean;
}

const InputIcon: React.FC<InputIconProps> = ({
  icon,
  placeholder,
  name,
  value,
  onChange,
  type = "text",
  animar = false,
}) => (
  <div
    className={`relative flex items-center gap-4 border border-teal-500 rounded-lg px-4 py-2 bg-white/20 backdrop-blur-sm shadow-inner transition-all duration-700 ${
      animar ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
    }`}
  >
    <span className="text-black-700 text-lg">{icon}</span>

    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full bg-transparent outline-none text-black text-base pt-4 pb-1"
    />

    {/* label flotante */}
    <label
      className={`absolute left-12 transition-all duration-400 pointer-events-none ${
        value ? "-top-1 text-xs text-black-700" : "top-3 text-base text-gray-600"
      }`}
    >
      {placeholder}
    </label>
  </div>
);

export default VoluntariosUsuario;