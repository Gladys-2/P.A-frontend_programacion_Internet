import React, { useEffect, useState } from "react";
import type { Donacion, Usuario } from "../../types/types";
import QRCode from "react-qr-code";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import axios from "axios";

interface DonacionesUsuarioProps {
  usuario: Usuario;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const DonacionesUsuario: React.FC<DonacionesUsuarioProps> = ({ usuario }) => {
  const [donaciones, setDonaciones] = useState<Donacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [nuevoTipo, setNuevoTipo] = useState("");
  const [nuevoMonto, setNuevoMonto] = useState<number | undefined>(undefined);
  const [nuevaCantidad, setNuevaCantidad] = useState<number | undefined>(undefined);
  const [mostrarConfetti, setMostrarConfetti] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");

  const opcionesSugeridas = [
    { tipo: "Croquetas", img: "https://www.cocinadelirante.com/800x600/filters:format(webp)/sites/default/files/images/2020/01/de-que-estan-hechas-las-croquetas-para-perro-croquetas.jpg" },
    { tipo: "Ropa / Mantita", img: "https://images.ctfassets.net/denf86kkcx7r/7cBBhgXWEPikoqMnUAMp4J/d02af392eca9efbdb3bb8614514c9abe/ropaperros-78" },
    { tipo: "Juguete", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFdf1pBlcRlCnPJYNTjoNlGX9CpUSclVMdAg&s" },
    { tipo: "Dinero", img: "https://www.bolivianfullexplorer.com/wp-content/uploads/2022/11/dinero-1-1.jpg" },
    { tipo: "Medicamentos", img: "https://www.eltelegrafo.com.ec/media/k2/items/cache/417c984d3ee918344edc327e033cfb2c_XL.jpg" },
    { tipo: "Accesorios / Collares", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5ZCYbm1QIlCIdyfxfnsiG95rLNbQcWJUumg&s" },
    { tipo: "Higiene / Champú", img: "https://dog-lovers.es/wp-content/uploads/2024/03/www.Dog-Lover.es-blog-descubre-los-mejores-productos-de-higiene-para-perros.jpg" },
    { tipo: "Cama / Casita", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdIcdK3qCDLSZktc0P9qt2a5_KWhLl3Ox_TQ&s" },
  ];

  const cargarDonaciones = async () => {
    if (!usuario?.id) return;
    try {
      const res = await axios.get(`${API_URL}/donaciones?usuarioId=${usuario.id}`);
      setDonaciones(res.data.data || []);
    } catch (err) {
      console.error("Error cargando donaciones:", err);
      setDonaciones([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDonaciones();
  }, [usuario?.id]);

  const agregarDonacion = async () => {
    if (!nuevoTipo.trim()) return alert("Selecciona un tipo de donación");

    if (nuevoTipo.toLowerCase() === "dinero") {
      if (!nuevoMonto || nuevoMonto <= 0) return alert("Ingresa un monto válido para dinero");
    } else {
      if (!nuevaCantidad || nuevaCantidad <= 0) return alert(`Ingresa cantidad válida para ${nuevoTipo}`);
    }

    const nuevaDonacion: Partial<Donacion> = {
      tipo: nuevoTipo,
      monto: nuevoTipo.toLowerCase() === "dinero" ? nuevoMonto : 0,
      cantidad: nuevoTipo.toLowerCase() === "dinero" ? 1 : nuevaCantidad,
      usuarioId: usuario.id,
      nombreUsuario: usuario.nombre,
      metodo: nuevoTipo.toLowerCase() === "dinero" ? "Efectivo" : "Objeto",
      estado: "Pendiente",
    };

    try {
      const res = await axios.post(`${API_URL}/donaciones/crear-donacion`, nuevaDonacion, {
        headers: { "Content-Type": "application/json" },
      });

      const donacionCreada: Donacion = {
        ...res.data.data,
        fechaDonacion: res.data.data.fechaDonacion || new Date().toISOString(),
      };

      setDonaciones(prev => [donacionCreada, ...prev]);

      setMensajeExito(`¡Felicidades ${usuario.nombre}! Donaste ${nuevaDonacion.cantidad} de ${nuevoTipo}`);
      setMostrarConfetti(true);
      setTimeout(() => setMostrarConfetti(false), 4000);
      setTimeout(() => setMensajeExito(""), 4000);

      setNuevoTipo("");
      setNuevoMonto(undefined);
      setNuevaCantidad(undefined);
    } catch (err) {
      console.error("Error al registrar donación:", err);
      alert("Error al registrar donación. Intenta nuevamente.");
    }
  };

  const colorTipo = (tipo?: string) => {
    const t = tipo?.toLowerCase();
    if (!t) return "bg-gray-100 text-gray-700";
    if (t.includes("dinero")) return "bg-green-100 text-green-700";
    if (t.includes("croquetas")) return "bg-yellow-100 text-yellow-700";
    if (t.includes("ropa")) return "bg-blue-100 text-blue-700";
    if (t.includes("juguete")) return "bg-pink-100 text-pink-700";
    if (t.includes("medicamentos")) return "bg-purple-100 text-purple-700";
    if (t.includes("accesorios")) return "bg-orange-100 text-orange-700";
    if (t.includes("higiene")) return "bg-teal-100 text-teal-700";
    return "bg-gray-100 text-gray-700";
  };

  if (cargando) return <p className="text-center mt-10 text-xl font-semibold text-gray-600">Cargando tus donaciones... ⏳</p>;

  return (
    <div className="min-h-screen p-6 flex flex-col lg:flex-row gap-8 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558788353-f76d92427f16?fit=crop&w=1950&q=80')" }}>
      
      {/* Confetti + mensaje */}
      {mostrarConfetti && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <Confetti numberOfPieces={200} recycle={false} />
          <div className="absolute bg-white/80 p-4 rounded-xl shadow-lg font-bold text-lg text-center">
            {mensajeExito}
          </div>
        </div>
      )}

      {/* Panel nueva donación */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="lg:w-1/3 bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-6 flex flex-col gap-6"
      >
        <h2 className="text-2xl font-bold text-[#050505] mb-2 text-center">Realiza tu nueva Donación</h2>

        <div className="flex gap-3 flex-wrap mt-2">
          {opcionesSugeridas.map(op => (
            <motion.div
              key={op.tipo}
              whileHover={{ scale: 1.05 }}
              className={`cursor-pointer flex flex-col items-center border-2 rounded-2xl p-2 transition-all ${nuevoTipo.toLowerCase() === op.tipo.toLowerCase() ? "border-blue-500" : "border-gray-300"}`}
              onClick={() => setNuevoTipo(op.tipo)}
            >
              <img src={op.img} alt={op.tipo} className="w-20 h-20 object-cover rounded-xl mb-1" />
              <span className="text-sm font-semibold text-center">{op.tipo}</span>
            </motion.div>
          ))}
        </div>

        {nuevoTipo.toLowerCase() === "dinero" ? (
          <input
            type="number"
            min={0}
            placeholder="Monto a donar ($)"
            className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-300 outline-none transition-all"
            value={nuevoMonto ?? ""}
            onChange={e => setNuevoMonto(parseFloat(e.target.value))}
          />
        ) : nuevoTipo ? (
          <input
            type="number"
            min={1}
            placeholder="Cantidad a donar"
            className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-300 outline-none transition-all"
            value={nuevaCantidad ?? ""}
            onChange={e => setNuevaCantidad(parseInt(e.target.value))}
          />
        ) : null}

        <button
          className="mt-4 px-6 py-3 bg-linear-to-r from-blue-400 to-teal-400 hover:from-blue-500 hover:to-teal-500 text-white font-bold text-lg rounded-2xl shadow-lg transition-all"
          onClick={agregarDonacion}
        >
          {nuevoTipo ? `Donar ${nuevoTipo}` : "Donar Ahora"}
        </button>
      </motion.div>

      {/* Historial */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="lg:w-2/3 flex flex-col gap-6"
      >
        <h2 className="text-2xl font-bold text-[#06070a] mb-2 text-center">Historial de las Donaciones</h2>

        {donaciones.length === 0 ? (
          <p className="text-gray-700 text-lg text-center">Aún no has realizado donaciones. ¡Anímate a ayudar!</p>
        ) : (
          <div className="flex flex-col gap-5">
            {donaciones.map(d => (
              <motion.div
                key={d.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white/90 backdrop-blur-md rounded-3xl shadow-lg hover:shadow-2xl transition-all flex flex-col sm:flex-row overflow-hidden"
              >
                <div className="sm:w-1/4 h-36 sm:h-auto flex items-center justify-center bg-gray-50/70">
                  <img
                    src={opcionesSugeridas.find(op => op.tipo.toLowerCase() === (d.tipo || "").toLowerCase())?.img}
                    alt={d.tipo}
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-gray-500 text-sm mb-1"><strong>ID:</strong> {d.id}</p>
                    <p className="text-gray-500 text-sm mb-1"><strong>Usuario:</strong> {d.nombreUsuario || usuario.nombre}</p>
                    <p className="text-gray-800 text-lg font-semibold mb-2">Donaste: {d.cantidad || 1} de {d.tipo}</p>
                    {d.tipo && <p className={`mb-2 inline-block px-3 py-1 rounded-full font-medium text-sm ${colorTipo(d.tipo)}`}>{d.tipo}</p>}
                    {d.fechaDonacion && <p className="text-gray-500 text-sm mb-3">Fecha: {new Date(d.fechaDonacion).toLocaleString("es-BO")}</p>}
                    {d.metodo && <p className="text-sm font-semibold text-gray-700">Método: {d.metodo}</p>}
                    {d.estado && <p className="text-sm font-semibold text-gray-700">Estado: {d.estado}</p>}
                  </div>

                  {d.tipo?.toLowerCase() === "dinero" && (
                    <div className="mb-3 p-2 bg-gray-50/70 rounded-xl flex flex-col items-center">
                      <QRCode
                        value={`${API_URL}/donar/${usuario.id}?monto=${d.monto}`}
                        size={128}
                      />
                      <p className="text-gray-600 text-sm mt-2 text-center">
                        Escanea para donar ${d.monto} directamente al banco
                      </p>
                    </div>
                  )}

                  <button
                    className="w-full py-2 bg-linear-to-r from-blue-400 to-teal-400 hover:from-blue-500 hover:to-teal-500 text-white font-semibold rounded-2xl shadow-md transition-all mt-2"
                    onClick={() => alert(`Donar nuevamente a ${d.tipo}`)}
                  >
                    Donar nuevamente
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DonacionesUsuario;