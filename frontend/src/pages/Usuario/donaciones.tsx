import React, { useEffect, useState } from "react";
import type { Donacion, Usuario } from "../../types/types";
import { FaMoneyBillWave, FaUtensils, FaTshirt, FaGift } from "react-icons/fa";
import QRCode from "react-qr-code";

interface DonacionesUsuarioProps {
  usuario: Usuario;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const DonacionesUsuario: React.FC<DonacionesUsuarioProps> = ({ usuario }) => {
  const [donaciones, setDonaciones] = useState<Donacion[]>([]);
  const [cargando, setCargando] = useState(true);

  const [nuevoTipo, setNuevoTipo] = useState("");
  const [nuevoMonto, setNuevoMonto] = useState<number | "">("");

  const opcionesSugeridas = [
    { tipo: "Croquetas", img: "https://www.cocinadelirante.com/800x600/filters:format(webp):quality(75)/sites/default/files/images/2020/01/de-que-estan-hechas-las-croquetas-para-perro-croquetas.jpg" },
    { tipo: "Ropa / Mantita", img: "https://images.ctfassets.net/denf86kkcx7r/7cBBhgXWEPikoqMnUAMp4J/d02af392eca9efbdb3bb8614514c9abe/ropaperros-78" },
    { tipo: "Juguete", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFdf1pBlcRlCnPJYNTjoNlGX9CpUSclVMdAg&s" },
    { tipo: "Dinero", img: "https://www.bolivianfullexplorer.com/wp-content/uploads/2022/11/dinero-1-1.jpg" },
  ];

  const cargarDonaciones = async () => {
    if (!usuario?.id) return;
    try {
      const res = await fetch(`${API_URL}/api/donaciones/usuario/${usuario.id}`);
      const dataRaw: any[] = await res.json();
      // Llenamos todas las propiedades obligatorias
      const data: Donacion[] = dataRaw.map(d => ({
        id: d.Donacion_id,
        monto: d.Donacion_monto,
        tipo: d.Donacion_tipo,
        fecha: d.Donacion_fecha,
        nombreUsuario: d.nombreUsuario ?? "",
        comprobante: d.comprobante ?? undefined,
        notasInternas: d.notasInternas ?? undefined,
        descripcion: d.descripcion ?? undefined,
        metodo: d.metodo ?? "",
        fechaDonacion: d.fechaDonacion ?? undefined,
        usuarioId: d.usuarioId ?? usuario.id,
        estado: d.estado ?? "Pendiente"
      }));
      setDonaciones(data);
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
    if (!usuario?.id) return;
    if (!nuevoTipo.trim()) return alert("Por favor ingresa el tipo de donación");
    if (nuevoTipo.toLowerCase() === "dinero" && (!nuevoMonto || nuevoMonto <= 0))
      return alert("Ingresa un monto válido para dinero");

    try {
      const nuevaDonacion: Donacion = {
        id: Date.now(),
        tipo: nuevoTipo,
        monto: nuevoMonto || 0,
        fecha: new Date().toISOString(),
        usuarioId: usuario.id,
        nombreUsuario: usuario.nombre,
        comprobante: undefined,
        notasInternas: undefined,
        descripcion: "",
        metodo: nuevoTipo.toLowerCase() === "dinero" ? "Efectivo" : "",
        fechaDonacion: new Date(),
        estado: "Pendiente"
      };

      setDonaciones(prev => [nuevaDonacion, ...prev]);
      alert(`¡Gracias por donar, ${usuario.nombre}! \nTipo: ${nuevoTipo}\nMonto: $${nuevoMonto || 0}`);

      setNuevoTipo("");
      setNuevoMonto("");
    } catch (err) {
      console.error(err);
    }
  };

  const iconoTipo = (tipo: string) => {
    const t = tipo?.toLowerCase();
    if (t.includes("dinero")) return <FaMoneyBillWave className="text-green-500 w-8 h-8" />;
    if (t.includes("comida") || t.includes("croquetas")) return <FaUtensils className="text-yellow-500 w-8 h-8" />;
    if (t.includes("ropa") || t.includes("mantita")) return <FaTshirt className="text-blue-500 w-8 h-8" />;
    if (t.includes("juguete")) return <FaGift className="text-pink-500 w-8 h-8" />;
    return <FaGift className="text-gray-500 w-8 h-8" />;
  };

  const colorTipo = (tipo?: string) => {
    const t = tipo?.toLowerCase();
    if (!t) return "bg-gray-100 text-gray-700";
    if (t.includes("dinero")) return "bg-green-100 text-green-700";
    if (t.includes("comida") || t.includes("croquetas")) return "bg-yellow-100 text-yellow-700";
    if (t.includes("ropa") || t.includes("mantita")) return "bg-blue-100 text-blue-700";
    if (t.includes("juguete")) return "bg-pink-100 text-pink-700";
    return "bg-gray-100 text-gray-700";
  };

  if (cargando) return <p className="text-center mt-10 text-xl font-semibold text-gray-600">Cargando tus donaciones... ⏳</p>;

  return (
    <div className="p-6 bg-[#E6F7FF] min-h-screen flex flex-col lg:flex-row gap-8">
      {/* Panel nueva donación */}
      <div className="lg:w-1/3 bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-[#1E3A8A] mb-2">Nueva Donación ✨</h2>

        <input
          type="text"
          placeholder="¿Qué deseas donar? (Ej: Croquetas, Peluche)"
          className="p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-300"
          value={nuevoTipo}
          onChange={e => setNuevoTipo(e.target.value)}
        />

        {nuevoTipo.toLowerCase() === "dinero" && (
          <input
            type="number"
            min={0}
            placeholder="Monto a donar ($)"
            className="p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-300"
            value={nuevoMonto}
            onChange={e => setNuevoMonto(parseFloat(e.target.value))}
          />
        )}

        <div className="flex gap-3 flex-wrap mt-2">
          {opcionesSugeridas.map(op => (
            <div
              key={op.tipo}
              className={`cursor-pointer flex flex-col items-center border rounded-xl p-2 hover:shadow-lg transition-all ${nuevoTipo.toLowerCase() === op.tipo.toLowerCase() ? "border-blue-500" : "border-gray-300"}`}
              onClick={() => setNuevoTipo(op.tipo)}
            >
              <img src={op.img} alt={op.tipo} className="w-16 h-16 object-cover rounded-lg mb-1" />
              <span className="text-sm font-medium">{op.tipo}</span>
            </div>
          ))}
        </div>

        <button
          className="mt-4 px-6 py-3 bg-[#4DA6FF] hover:bg-[#3399FF] text-white font-bold text-lg rounded-xl shadow-md transition-all"
          onClick={agregarDonacion}
        >
          {nuevoTipo ? `Donar ${nuevoTipo} ` : "Donar Ahora"}
        </button>
      </div>

      {/* Historial */}
      <div className="lg:w-2/3 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-[#1E3A8A] mb-2">Historial de Donaciones 📜</h2>

        {donaciones.length === 0 ? (
          <p className="text-gray-600 text-lg">Aún no has realizado donaciones. ¡Anímate a ayudar!</p>
        ) : (
          <div className="flex flex-col gap-4">
            {donaciones.map(d => (
              <div key={d.id} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col sm:flex-row overflow-hidden">
                <div className="sm:w-1/4 h-32 sm:h-auto flex items-center justify-center bg-gray-50">
                  {iconoTipo(d.tipo || "")}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {d.id !== undefined && <p className="text-gray-500 text-sm mb-1"><strong>ID:</strong> {d.id}</p>}
                    {d.monto !== undefined && <p className="text-gray-700 text-lg font-semibold mb-2">Monto: ${d.monto}</p>}
                    {d.tipo && <p className={`mb-2 inline-block px-3 py-1 rounded-full font-medium text-sm ${colorTipo(d.tipo)}`}>{d.tipo}</p>}
                    {d.fecha && <p className="text-gray-500 text-sm mb-3">Fecha: {new Date(d.fecha).toLocaleDateString("es-BO")}</p>}
                    {d.estado && <p className="text-sm font-semibold text-gray-700">Estado: {d.estado}</p>}
                  </div>

                  {d.tipo?.toLowerCase() === "dinero" && (
                    <div className="mb-3 p-2 bg-gray-50 rounded-lg flex flex-col items-center">
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
                    className="w-full py-2 bg-[#4DA6FF] hover:bg-[#3399FF] text-white font-semibold rounded-xl shadow-md transition-all mt-2"
                    onClick={() => alert(`Donar nuevamente a ${d.tipo}`)}
                  >
                    Donar nuevamente
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonacionesUsuario;