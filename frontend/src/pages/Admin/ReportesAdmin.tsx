import React, { useState, useEffect } from "react";
import axios from "axios";
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
import { FaUser, FaDog, FaPaw, FaClipboardList } from "react-icons/fa";
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

const ReportesAdmin: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [adopciones, setAdopciones] = useState<Adopcion[]>([]);
  const [, setCargando] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState<Animal | null>(null);

  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: GOOGLE_MAPS_API_KEY });

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
        <div className="p-6 rounded-2xl shadow-2xl text-center bg-linear-to-br from-blue-900/40 to-blue-800/40">
          <FaUser className="mx-auto text-4xl mb-2 text-blue-400" />
          <p className="font-semibold text-xl text-blue-200">Usuarios Registrados</p>
          <p className="text-2xl font-extrabold text-white">{usuarios.length}</p>
        </div>
        <div className="p-6 rounded-2xl shadow-2xl text-center bg-linear-to-br from-green-900/40 to-lime-900/40">
          <FaDog className="mx-auto text-4xl mb-2 text-green-400" />
          <p className="font-semibold text-xl text-green-200">Mascotas Disponibles</p>
          <p className="text-2xl font-extrabold text-white">{mascotasDisponibles}</p>
        </div>
        <div className="p-6 rounded-2xl shadow-2xl text-center bg-linear-to-br from-yellow-900/40 to-orange-900/40">
          <FaPaw className="mx-auto text-4xl mb-2 text-yellow-400" />
          <p className="font-semibold text-xl text-yellow-200">Mascotas Adoptadas</p>
          <p className="text-2xl font-extrabold text-white">{mascotasAdoptadas}</p>
        </div>
        <div className="p-6 rounded-2xl shadow-2xl text-center bg-linear-to-br from-purple-900/40 to-pink-900/40">
          <FaClipboardList className="mx-auto text-4xl mb-2 text-purple-400" />
          <p className="font-semibold text-xl text-purple-200">Solicitudes Pendientes</p>
          <p className="text-2xl font-extrabold text-white">{solicitudesPendientes}</p>
        </div>
      </div>

      <hr className="my-6 border-gray-700/50" />

      {/* --- Gráficos --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800/70 p-6 rounded-2xl shadow-xl border border-gray-700/50 flex flex-col items-center justify-center" style={{ height: '400px' }}>
          <h3 className="font-semibold mb-4 text-cyan-300 text-center text-xl">Estado de Mascotas</h3>
          <div className="w-full h-full flex items-center justify-center">
            <Doughnut 
              data={doughnutData} 
              options={{ maintainAspectRatio: false, plugins: { legend: { labels: { color: "#e5e7eb" } } } }} 
            />
          </div>
        </div>

        <div className="bg-gray-800/70 p-6 rounded-2xl shadow-xl border border-gray-700/50 flex flex-col items-center justify-center" style={{ height: '400px' }}>
          <h3 className="font-semibold mb-4 text-purple-300 text-center text-xl">Usuarios Registrados</h3>
          <div className="w-full h-full flex items-center justify-center">
            <Bar 
              data={barData} 
              options={{ ...chartOptions, maintainAspectRatio: false }} 
            />
          </div>
        </div>
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