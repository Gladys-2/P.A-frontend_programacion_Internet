import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaPaw } from "react-icons/fa";

const COLOR_AZUL = "#4DA6FF";
const COLOR_AZUL_HOVER = "#3399FF";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface FormVoluntario {
  nombre: string;
  telefono?: string;
  correo: string;
}

const VoluntariosUsuario: React.FC = () => {
  const [form, setForm] = useState<FormVoluntario>({ nombre: "", telefono: "", correo: "" });
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);

    if (!form.nombre.trim() || !form.correo.trim()) {
      setMensaje("Por favor, completa tu nombre y correo.");
      return;
    }

    try {
      setCargando(true);
      await axios.post(`${API_URL}/api/voluntarios/crear-voluntario`, form);
      setMensaje("¡Gracias! Tu inscripción como voluntario se ha registrado correctamente.");
      setForm({ nombre: "", telefono: "", correo: "" });
    } catch (error) {
      console.error(error);
      setMensaje("Error al registrar tu inscripción. Intenta nuevamente.");
    } finally {
      setCargando(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delayChildren: 0.2, staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-linear-to-br from-[#E6F7FF] to-[#D0F0FF] flex items-center justify-center p-4 lg:p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col lg:flex-row w-full max-w-6xl rounded-2xl shadow-lg overflow-hidden bg-white"
      >
        {/* Imagen */}
        <motion.div
          variants={itemVariants}
          className="lg:w-1/2 relative min-h-[300px] flex items-center justify-center overflow-hidden"
          whileHover={{ rotateY: 3, rotateX: 2, scale: 1.02 }}
        >
          <motion.img
            src="https://content.elmueble.com/medio/2024/11/08/mujer-abrazada-a-su-perro_d6867514_1771257680_241108103917_900x900.webp"
            alt="Voluntario abrazando un perro feliz"
            className="w-full h-full object-cover lg:rounded-l-2xl max-w-full"
            initial={{ scale: 1.05 }}
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6 }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent flex items-end p-4 lg:p-6">
            <h3 className="text-white text-2xl font-extrabold leading-snug drop-shadow-md">
              Tu tiempo es el abrazo que transforma vidas.
            </h3>
          </div>
        </motion.div>

        {/* Formulario */}
        <motion.div
          variants={itemVariants}
          className="lg:w-1/2 p-6 md:p-8 flex flex-col justify-center space-y-4 bg-white"
        >
          <motion.h2
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-serif font-extrabold text-center mb-3 text-blue-500 drop-shadow-sm flex justify-center items-center gap-2"
          >
            ¡Únete a la Familia!
          </motion.h2>

          <p className="text-center text-gray-600 mb-4 font-light text-sm">
            Conviértete en parte de nuestra familia de voluntarios y ayuda a los
            animales a encontrar un hogar. Tu apoyo es vital.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {["nombre", "telefono", "correo"].map((campo) => (
              <div key={campo} className="relative">
                <motion.input
                  variants={itemVariants}
                  type={campo === "correo" ? "email" : "text"}
                  name={campo}
                  value={(form as any)[campo]}
                  onChange={handleChange}
                  placeholder={campo === "nombre" ? "Nombre completo" : campo === "telefono" ? "Teléfono" : "Correo electrónico"}
                  className="peer placeholder-transparent p-3 border-2 border-blue-200 rounded-lg w-full focus:outline-none focus:ring-3 focus:ring-blue-300 focus:ring-opacity-50 shadow-sm transition-all duration-200 hover:shadow-md text-sm"
                />
                <label className="absolute left-3 top-3 text-gray-400 text-xs transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-blue-400 peer-focus:text-[10px]">
                  {campo === "nombre" ? "Nombre completo *" : campo === "telefono" ? "Teléfono" : "Correo electrónico *"}
                </label>
              </div>
            ))}

            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={cargando}
              style={{ backgroundColor: COLOR_AZUL }}
              className={`text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-md ${cargando ? "opacity-70 cursor-not-allowed" : "hover:shadow-lg text-sm"}`}
              whileHover={cargando ? {} : { scale: 1.03, backgroundColor: COLOR_AZUL_HOVER, boxShadow: "0px 8px 18px rgba(77,166,255,0.3)" }}
              whileTap={{ scale: 0.96 }}
            >
              {cargando ? (
                <span className="flex items-center justify-center gap-2 text-sm">
                  <FaPaw className="animate-spin" /> Registrando...
                </span>
              ) : (
                "Quiero Inscribirme"
              )}
            </motion.button>
          </form>

          {mensaje && (
            <motion.p
              initial={{ y: -15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 120 }}
              className={`mt-4 text-center font-medium text-sm ${mensaje.includes("Gracias") ? "text-green-600" : "text-red-500"}`}
            >
              {mensaje}
            </motion.p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VoluntariosUsuario;