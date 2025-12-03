import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { FaUser, FaDog, FaPaw, FaClipboardList, FaSearch } from "react-icons/fa";
import type { Usuario, Animal } from "../../types/types"; 

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

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
    const [busqueda, setBusqueda] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const itemsPorPagina = 5;
    const [cargando, setCargando] = useState(true);
    const [selectedMarker, setSelectedMarker] = useState<Animal | null>(null);

    const { isLoaded } = useJsApiLoader({ googleMapsApiKey: GOOGLE_MAPS_API_KEY });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setCargando(true);
                const [usuariosRes, animalesRes, adopcionesRes] = await Promise.all([
                    axios.get<Usuario[]>(`${API_URL}/usuarios`),
                    axios.get<Animal[]>(`${API_URL}/animales`),
                    axios.get<Adopcion[]>(`${API_URL}/adopciones`) 
                ]);
                setUsuarios(usuariosRes.data);
                setAnimales(animalesRes.data);
                setAdopciones(adopcionesRes.data);
            } catch (err) {
                console.error("Error al cargar datos:", err);
            } finally {
                setCargando(false);
            }
        };
        fetchData();
    }, []);

    const usuariosFiltrados = usuarios.filter(u =>
        u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.apellido_paterno.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.correo_electronico.toLowerCase().includes(busqueda.toLowerCase())
    );

    const indexUltimo = paginaActual * itemsPorPagina;
    const indexPrimero = indexUltimo - itemsPorPagina;
    const usuariosPagina = usuariosFiltrados.slice(indexPrimero, indexUltimo);
    const totalPaginas = Math.ceil(usuariosFiltrados.length / itemsPorPagina);

    const exportCSV = () => {
        const csvContent = "data:text/csv;charset=utf-8," +
            ["Nombre,Apellido,Correo"].concat(usuariosFiltrados.map(u => `${u.nombre},${u.apellido_paterno},${u.correo_electronico}`)).join("\n");
        saveAs(encodeURI(csvContent), "usuarios.csv");
    };
    const exportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(
            usuariosFiltrados.map(u => ({ Nombre: u.nombre, Apellido: u.apellido_paterno, Correo: u.correo_electronico }))
        );
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Usuarios");
        XLSX.writeFile(wb, "usuarios.xlsx");
    };
    const exportPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("Usuarios Registrados", doc.internal.pageSize.getWidth() / 2, 15, { align: "center" });
        (doc as any).autoTable({
            head: [["Nombre", "Apellido", "Correo"]],
            body: usuariosFiltrados.map(u => [u.nombre, u.apellido_paterno, u.correo_electronico]),
            startY: 25
        });
        doc.save("usuarios.pdf");
    };
    const mascotasDisponibles = animales.filter(a => a.estado_animal === "Disponible").length;
    const mascotasAdoptadas = animales.filter(a => a.estado_animal === "Adoptado").length;
    const puntosRescate = animales.filter(a => a.latitud && a.longitud);
    const solicitudesPendientes = adopciones.filter(a => 
        a.estado && a.estado.toLowerCase().trim() === "pendiente"
    ).length;

    const doughnutData = {
        labels: ["Disponibles", "Adoptadas"],
        datasets: [{
            data: [mascotasDisponibles, mascotasAdoptadas],
            backgroundColor: ["#22c55e", "#facc15"],
            hoverBackgroundColor: ["#16a34a", "#eab308"],
        }]
    };
    const barData = {
        labels: ["Usuarios"],
        datasets: [{
            label: "Cantidad de usuarios",
            data: [usuarios.length],
            backgroundColor: "#3b82f6",
        }]
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen space-y-6">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Reportes y Estadísticas</h1>

            {/* --- Cards Métricas --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-400 text-white p-8 rounded-2xl shadow-xl text-center transform hover:scale-105 transition">
                    <FaUser className="mx-auto text-6xl mb-2" />
                    <p className="font-semibold text-xl">Usuarios</p>
                    <p className="text-3xl font-bold">{usuarios.length}</p>
                </div>
                <div className="bg-green-400 text-white p-8 rounded-2xl shadow-xl text-center transform hover:scale-105 transition">
                    <FaDog className="mx-auto text-6xl mb-2" />
                    <p className="font-semibold text-xl">Mascotas Disponibles</p>
                    <p className="text-3xl font-bold">{mascotasDisponibles}</p>
                </div>
                <div className="bg-yellow-400 text-white p-8 rounded-2xl shadow-xl text-center transform hover:scale-105 transition">
                    <FaPaw className="mx-auto text-6xl mb-2" />
                    <p className="font-semibold text-xl">Mascotas Adoptadas</p>
                    <p className="text-3xl font-bold">{mascotasAdoptadas}</p>
                </div>
                <div className="bg-purple-400 text-white p-8 rounded-2xl shadow-xl text-center transform hover:scale-105 transition">
                    <FaClipboardList className="mx-auto text-6xl mb-2" />
                    <p className="font-semibold text-xl">Solicitudes Pendientes</p>
                    {/* EL CONTADOR DE SOLICITUDES PENDIENTES */}
                    <p className="text-3xl font-bold">{solicitudesPendientes}</p> 
                </div>
            </div>

            <hr className="my-6" />

            {/* --- Gráficos --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="font-semibold mb-4 text-gray-700 text-center">Estado de Mascotas</h3>
                    <Doughnut data={doughnutData} />
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="font-semibold mb-4 text-gray-700 text-center">Usuarios Registrados</h3>
                    <Bar data={barData} />
                </div>
            </div>

            <hr className="my-6" />

            {/* --- Tabla de Usuarios --- */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
                    <div className="relative w-full md:w-1/3">
                        <FaSearch className="absolute top-3 left-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar usuarios..."
                            className="pl-10 border px-4 py-2 rounded-full w-full shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                            value={busqueda}
                            onChange={e => { setBusqueda(e.target.value); setPaginaActual(1); }}
                        />
                    </div>
                    <div className="flex gap-2 mt-2 md:mt-0">
                        <button onClick={exportCSV} className="bg-cyan-200 px-4 py-2 rounded-full hover:bg-cyan-500 transition font-semibold">CSV</button>
                        <button onClick={exportExcel} className="bg-cyan-200 px-4 py-2 rounded-full hover:bg-cyan-500 transition font-semibold">Excel</button>
                        <button onClick={exportPDF} className="bg-cyan-200 px-4 py-2 rounded-full hover:bg-cyan-500 transition font-semibold">PDF</button>
                    </div>
                </div>

                {cargando ? <p className="text-center text-gray-500 py-10">Cargando usuarios...</p> : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 rounded-xl">
                            <thead className="bg-cyan-200 text-black">
                                <tr>
                                    <th className="px-6 py-3 text-left">Nombre</th>
                                    <th className="px-6 py-3 text-left">Apellido</th>
                                    <th className="px-6 py-3 text-left">Correo</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {usuariosPagina.map(u => (
                                    <tr key={u.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 flex items-center gap-2"><FaUser className="text-blue-500 text-xl" /> {u.nombre}</td>
                                        <td className="px-6 py-4">{u.apellido_paterno}</td>
                                        <td className="px-6 py-4">{u.correo_electronico}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex justify-center gap-3 mt-6">
                            <button disabled={paginaActual === 1} className="px-3 py-1 bg-white rounded-full shadow hover:bg-cyan-100 transition" onClick={() => setPaginaActual(paginaActual - 1)}>Anterior</button>
                            <span className="px-3 py-1 bg-white rounded-full shadow">{`${paginaActual} / ${totalPaginas}`}</span>
                            <button disabled={paginaActual === totalPaginas} className="px-3 py-1 bg-white rounded-full shadow hover:bg-cyan-100 transition" onClick={() => setPaginaActual(paginaActual + 1)}>Siguiente</button>
                        </div>
                    </div>
                )}
            </div>

            <hr className="my-6" />

            {/* --- Google Map --- */}
            {isLoaded && (
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="text-gray-700 font-semibold text-xl mb-4 text-center">Mapa de Rescates</h3>
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1 rounded-2xl overflow-hidden shadow-inner">
                            <GoogleMap mapContainerStyle={{ width: "100%", height: "600px" }} center={centerCoords} zoom={12}>
                                {puntosRescate.map(p => (
                                    <Marker key={p.id} position={{ lat: p.latitud!, lng: p.longitud! }} onClick={() => setSelectedMarker(p)} />
                                ))}
                                {selectedMarker && (
                                    <InfoWindow position={{ lat: selectedMarker.latitud!, lng: selectedMarker.longitud! }} onCloseClick={() => setSelectedMarker(null)}>
                                        <div className="text-gray-800 font-medium">{selectedMarker.nombre}</div>
                                    </InfoWindow>
                                )}
                            </GoogleMap>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportesAdmin;