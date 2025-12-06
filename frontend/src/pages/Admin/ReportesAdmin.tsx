import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { FaUser, FaDog, FaPaw, FaClipboardList, FaSearch } from "react-icons/fa";
import type { Usuario, Animal } from "../../types/types";

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);
Chart.defaults.color = "#e0f7fa";
Chart.defaults.borderColor = "rgba(255, 255, 255, 0.1)";

const API_URL = import.meta.env.VITE_API_URL;
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const centerCoords = { lat: -16.500, lng: -68.150 };

interface Adopcion {
  id: number;
  id_usuario: number;
  id_animal: number;
  estado: string;
  fecha_solicitud: string;
}

const getAvatarColor = (index: number) => {
  const colors = [
    "bg-red-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-orange-500",
  ];
  return colors[index % colors.length];
};

const ReportesAdmin: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [adopciones, setAdopciones] = useState<Adopcion[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 5;
  const [cargando, setCargando] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState<Animal | null>(null);

  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: GOOGLE_MAPS_API_KEY });

  // --- CARGA DE DATOS ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setCargando(true);
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

        const [usuariosRes, animalesRes, adopcionesRes] = await Promise.all([
          axios.get<Usuario[]>(`${API_URL}/usuarios`, { headers }),
          axios.get<Animal[]>(`${API_URL}/animales`, { headers }),
          axios.get<Adopcion[]>(`${API_URL}/adopciones`, { headers }),
        ]);

        setUsuarios(usuariosRes.data || []);
        setAnimales(animalesRes.data || []);
        setAdopciones(adopcionesRes.data || []);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        alert("No se pudo cargar la información. Revisa la conexión o el token.");
      } finally {
        setCargando(false);
      }
    };
    fetchData();
  }, []);

  // --- FILTRO Y PAGINACIÓN ---
  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.apellido_paterno?.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.correo_electronico.toLowerCase().includes(busqueda.toLowerCase())
  );

  const indexUltimo = paginaActual * itemsPorPagina;
  const indexPrimero = indexUltimo - itemsPorPagina;
  const usuariosPagina = usuariosFiltrados.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(usuariosFiltrados.length / itemsPorPagina);

  // --- EXPORTACIONES ---
  const exportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Nombre,Apellido,Correo"]
        .concat(
          usuariosFiltrados.map(
            (u) => `${u.nombre},${u.apellido_paterno},${u.correo_electronico}`
          )
        )
        .join("\n");
    saveAs(encodeURI(csvContent), "usuarios.csv");
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      usuariosFiltrados.map((u) => ({
        Nombre: u.nombre,
        Apellido: u.apellido_paterno,
        Correo: u.correo_electronico,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Usuarios");
    XLSX.writeFile(wb, "usuarios.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFontSize(18);
    doc.text("Usuarios Registrados", doc.internal.pageSize.getWidth() / 2, 30, {
      align: "center",
    });
    (doc as any).autoTable({
      head: [["Nombre", "Apellido", "Correo"]],
      body: usuariosFiltrados.map((u) => [u.nombre, u.apellido_paterno, u.correo_electronico]),
      startY: 50,
      theme: "striped",
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      bodyStyles: { textColor: [0, 0, 0] },
      alternateRowStyles: { fillColor: [241, 245, 249] },
    });
    doc.save("usuarios.pdf");
  };

  // --- MÉTRICAS ---
  const mascotasDisponibles = animales.filter(
    (a) => a.estado_animal?.toLowerCase() === "disponible"
  ).length;
  const mascotasAdoptadas = animales.filter(
    (a) => a.estado_animal?.toLowerCase() === "adoptado"
  ).length;
  const solicitudesPendientes = adopciones.filter(
    (a) => a.estado?.toLowerCase().trim() === "pendiente"
  ).length;
  const puntosRescate = animales.filter((a) => !!a.latitud && !!a.longitud);

  // --- CHART DATA ---
  const doughnutData = {
    labels: ["Disponibles", "Adoptadas"],
    datasets: [
      {
        data: [mascotasDisponibles, mascotasAdoptadas],
        backgroundColor: ["#10b981", "#3b82f6"],
        hoverBackgroundColor: ["#059669", "#2563eb"],
      },
    ],
  };

  const barData = {
    labels: ["Usuarios Registrados"],
    datasets: [
      {
        label: "Cantidad de usuarios",
        data: [usuarios.length],
        backgroundColor: "rgba(168, 85, 247, 0.7)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        ticks: { color: "#9ca3af" },
        grid: { color: "rgba(156, 163, 175, 0.1)" },
      },
      x: {
        ticks: { color: "#9ca3af" },
        grid: { color: "rgba(156, 163, 175, 0.1)" },
      },
    },
    plugins: {
      legend: { labels: { color: "#e5e7eb" } },
    },
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen space-y-8 text-gray-100">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-500">
        Panel de Reportes y Estadísticas
      </h1>

      {/* --- Cards Métricas --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-8 rounded-2xl shadow-2xl text-center bg-linear-to-br from-blue-900/40 to-blue-800/40">
          <FaUser className="mx-auto text-6xl mb-2 text-blue-400" />
          <p className="font-semibold text-xl text-blue-200">Usuarios Registrados</p>
          <p className="text-4xl font-extrabold text-white">{usuarios.length}</p>
        </div>
        <div className="p-8 rounded-2xl shadow-2xl text-center bg-linear-to-br from-green-900/40 to-lime-900/40">
          <FaDog className="mx-auto text-6xl mb-2 text-green-400" />
          <p className="font-semibold text-xl text-green-200">Mascotas Disponibles</p>
          <p className="text-4xl font-extrabold text-white">{mascotasDisponibles}</p>
        </div>
        <div className="p-8 rounded-2xl shadow-2xl text-center bg-linear-to-br from-yellow-900/40 to-orange-900/40">
          <FaPaw className="mx-auto text-6xl mb-2 text-yellow-400" />
          <p className="font-semibold text-xl text-yellow-200">Mascotas Adoptadas</p>
          <p className="text-4xl font-extrabold text-white">{mascotasAdoptadas}</p>
        </div>
        <div className="p-8 rounded-2xl shadow-2xl text-center bg-linear-to-br from-purple-900/40 to-pink-900/40">
          <FaClipboardList className="mx-auto text-6xl mb-2 text-purple-400" />
          <p className="font-semibold text-xl text-purple-200">Solicitudes Pendientes</p>
          <p className="text-4xl font-extrabold text-white">{solicitudesPendientes}</p>
        </div>
      </div>

      <hr className="my-6 border-gray-700/50" />

      {/* --- Gráficos --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800/70 p-6 rounded-2xl shadow-xl border border-gray-700/50">
          <h3 className="font-semibold mb-4 text-cyan-300 text-center text-xl">Estado de Mascotas</h3>
          <Doughnut data={doughnutData} options={{ plugins: { legend: { labels: { color: "#e5e7eb" } } } }} />
        </div>
        <div className="bg-gray-800/70 p-6 rounded-2xl shadow-xl border border-gray-700/50">
          <h3 className="font-semibold mb-4 text-purple-300 text-center text-xl">Usuarios Registrados</h3>
          <Bar data={barData} options={chartOptions} />
        </div>
      </div>

      <hr className="my-6 border-gray-700/50" />

      {/* --- Tabla de Usuarios --- */}
      <div className="bg-gray-800/70 p-6 rounded-2xl shadow-xl border border-gray-700/50 space-y-6">
        <h2 className="text-2xl font-bold text-white">Lista de Usuarios</h2>

        {/* Controles de Búsqueda y Exportación */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
          <div className="relative w-full md:w-1/3">
            <FaSearch className="absolute top-3 left-3 text-cyan-400" />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              className="pl-10 border bg-gray-900 border-gray-700 px-4 py-2 rounded-full w-full shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 transition text-white placeholder-gray-500"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPaginaActual(1);
              }}
            />
          </div>
          <div className="flex gap-2 mt-2 md:mt-0">
            <button onClick={exportCSV} className="bg-cyan-600/70 text-white px-4 py-2 rounded-full hover:bg-cyan-500 transition font-semibold shadow-md ring-1 ring-cyan-500">CSV</button>
            <button onClick={exportExcel} className="bg-purple-600/70 text-white px-4 py-2 rounded-full hover:bg-purple-500 transition font-semibold shadow-md ring-1 ring-purple-500">Excel</button>
            <button onClick={exportPDF} className="bg-pink-600/70 text-white px-4 py-2 rounded-full hover:bg-pink-500 transition font-semibold shadow-md ring-1 ring-pink-500">PDF</button>
          </div>
        </div>

        {/* Tabla */}
        {cargando ? (
          <p className="text-center text-cyan-400 py-10">Cargando usuarios...</p>
        ) : (
          <div className="overflow-x-auto border border-gray-700 rounded-xl">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700 text-white/90 border-b border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-sm font-medium tracking-wider">Apellido</th>
                  <th className="px-6 py-3 text-left text-sm font-medium tracking-wider">Correo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {usuariosPagina.map((u, index) => {
                  const iniciales = `${u.nombre[0] ?? ""}${u.apellido_paterno?.[0] ?? ""}`.toUpperCase();
                  const avatarColor = getAvatarColor(index);

                  return (
                    <tr key={u.id} className="bg-gray-800/50 hover:bg-gray-700/70 transition">
                      <td className="px-6 py-4 flex items-center gap-3 whitespace-nowrap text-white">
                        <div className={`w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center text-white font-semibold text-xs shadow-md`}>
                          {iniciales}
                        </div>
                        {u.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">{u.apellido_paterno}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-cyan-300 font-medium">{u.correo_electronico}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Paginación */}
            <div className="flex justify-center gap-3 mt-6 pb-4">
              <button
                disabled={paginaActual === 1}
                className="px-4 py-2 bg-gray-700 rounded-full shadow-lg text-cyan-300 hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setPaginaActual(paginaActual - 1)}
              >
                ← Anterior
              </button>
              <span className="px-4 py-2 bg-gray-700 rounded-full shadow-lg text-white font-bold">{`${paginaActual} / ${totalPaginas}`}</span>
              <button
                disabled={paginaActual === totalPaginas}
                className="px-4 py-2 bg-gray-700 rounded-full shadow-lg text-cyan-300 hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setPaginaActual(paginaActual + 1)}
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}
      </div>

      <hr className="my-6 border-gray-700/50" />

      {/* --- Google Maps --- */}
      {isLoaded && puntosRescate.length > 0 && (
        <div className="bg-gray-800/70 p-6 rounded-2xl shadow-xl border border-gray-700/50">
          <h3 className="text-purple-300 font-semibold text-xl mb-4 text-center">Mapa de Rescates Reportados</h3>
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "600px" }}
            center={centerCoords}
            zoom={12}
          >
            {puntosRescate.map((p) => (
              <Marker
                key={p.id}
                position={{ lat: p.latitud!, lng: p.longitud! }}
                onClick={() => setSelectedMarker(p)}
                icon={{ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }}
              />
            ))}
            {selectedMarker && (
              <InfoWindow
                position={{ lat: selectedMarker.latitud!, lng: selectedMarker.longitud! }}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div className="text-gray-900 font-bold p-1">
                  <p className="text-sm font-semibold">Rescate: {selectedMarker.nombre}</p>
                  <p className="text-xs text-gray-600">Estado: {selectedMarker.estado_animal}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>
      )}
    </div>
  );
};

export default ReportesAdmin;