import React, { useState, useEffect } from "react";
import type { Usuario } from "../../types/types";
import ModalUsuario from "../../componentes/Modal/ModalUsuario";
import axios from "axios";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  FaEdit,
  FaToggleOn,
  FaToggleOff,
  FaSearch,
  FaPlus,
  FaFileCsv,
  FaFileExcel,
  FaFilePdf,
} from "react-icons/fa";

interface UsuariosProps {
  usuarioLogueado: Usuario;
}

const API_URL = import.meta.env.VITE_API_URL;

const Usuarios: React.FC<UsuariosProps> = ({ usuarioLogueado }) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [modalUsuario, setModalUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 7;

  // ---- FETCH USUARIOS CON TOKEN ----
  const fetchUsuarios = async () => {
    try {
      setCargando(true);

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No hay token disponible");
        setCargando(false);
        return;
      }

      const res = await axios.get<Usuario[]>(`${API_URL}/usuarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Orden por ID ascendente (orden de llegada)
      const usuariosOrdenados = res.data
        .map(u => ({ ...u, estado: u.estado ?? "Activo" }))
        .sort((a, b) => (a.id! > b.id! ? 1 : -1));

      setUsuarios(usuariosOrdenados);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // ---- FILTRO Y PAGINACIÓN ----
  const usuariosFiltrados = usuarios.filter(
    u =>
      u.nombre.toLowerCase().startsWith(busqueda.toLowerCase()) ||
      (u.apellido_paterno?.toLowerCase().startsWith(busqueda.toLowerCase()) ?? false) ||
      u.correo_electronico.toLowerCase().startsWith(busqueda.toLowerCase())
  );

  const indexUltimo = paginaActual * itemsPorPagina;
  const indexPrimero = indexUltimo - itemsPorPagina;
  const usuariosPaginados = usuariosFiltrados.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(usuariosFiltrados.length / itemsPorPagina);

  // ---- HANDLERS ----
  const handleEdit = (usuario: Usuario) => setModalUsuario(usuario);

  const handleCreate = () =>
    setModalUsuario({
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      correo_electronico: "",
      rol: "usuario",
      estado: "Activo",
      id: undefined,
      genero: "M",
    } as Usuario);

  const handleToggle = async (usuario: Usuario) => {
    if (!usuario.id) return;
    const nuevoEstado = usuario.estado === "Activo" ? "Inactivo" : "Activo";

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.put(
        `${API_URL}/usuarios/${usuario.id}`,
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsuarios(prev =>
        prev.map(u => (u.id === usuario.id ? { ...u, estado: nuevoEstado } : u))
      );
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      alert("No se pudo cambiar el estado del usuario.");
    }
  };

  const handleSave = async () => {
    await fetchUsuarios(); // ✅ Traer usuarios actualizados y ordenados
    setModalUsuario(null);
  };

  // ---- EXPORTACIONES ----
  const exportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Nombre,Apellido,Correo,Rol,Estado"]
        .concat(
          usuariosFiltrados.map(
            u => `${u.nombre},${u.apellido_paterno},${u.correo_electronico},${u.rol},${u.estado}`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, "usuarios.csv");
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      usuariosFiltrados.map(u => ({
        Nombre: u.nombre,
        Apellido: u.apellido_paterno,
        Correo: u.correo_electronico,
        Rol: u.rol,
        Estado: u.estado,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Usuarios");
    XLSX.writeFile(wb, "usuarios.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Usuarios Registrados", doc.internal.pageSize.getWidth() / 2, 15, { align: "center" });

    const body = usuariosFiltrados.map(u => [
      u.nombre,
      u.apellido_paterno,
      u.correo_electronico,
      u.rol,
      u.estado,
    ]);

    (doc as any).autoTable({
      head: [["Nombre", "Apellido", "Correo", "Rol", "Estado"]],
      body,
      startY: 25,
      styles: { halign: "center", fillColor: [255, 255, 255], textColor: 0 },
      headStyles: { fillColor: [132, 204, 255], textColor: 0 },
      didParseCell: function (data: any) {
        if (data.section === 'body' && data.column.index === 4) {
          const estado = data.cell.raw;
          data.cell.styles.fillColor = estado === "Activo" ? [34, 197, 94] : [239, 68, 68];
          data.cell.styles.textColor = 255;
        }
      },
    });

    doc.save("usuarios.pdf");
  };

  return (
    <div className="w-full bg-black min-h-screen p-0">
      <h1 className="text-3xl font-bold text-white text-center mb-6">Usuarios Registrados</h1>

      <div className="flex flex-col md:flex-row md:justify-between mb-4 gap-2 items-center">
        <div className="relative w-full md:w-1/3 md:ml-4">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar usuarios..."
            className="border border-cyan-200 bg-gray-800 text-white px-10 py-2 rounded-3xl w-full shadow focus:outline-none focus:ring-2 focus:ring-cyan-200 transition"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>

        <div className="flex gap-4 mt-1 md:mt-0">
          <button onClick={exportCSV} className={buttonStyle}><FaFileCsv className="mr-1" /> CSV</button>
          <button onClick={exportExcel} className={buttonStyle}><FaFileExcel className="mr-1" /> Excel</button>
          <button onClick={exportPDF} className={buttonStyle}><FaFilePdf className="mr-1" /> PDF</button>
          <button onClick={handleCreate} className="flex items-center gap-2 bg-cyan-200 hover:bg-cyan-300 text-black px-5 py-2 rounded-3xl shadow-xl font-semibold transition-transform transform hover:scale-110">
            <FaPlus size={16} /> Agregar Usuario
          </button>
        </div>
      </div>

      {cargando ? (
        <div className="text-center py-20 text-gray-400">Cargando usuarios...</div>
      ) : usuariosFiltrados.length === 0 ? (
        <div className="text-center py-20 text-gray-400">No hay usuarios para mostrar.</div>
      ) : (
        <div className="relative p-2 rounded-3xl">
          <span className="absolute inset-0 rounded-3xl bg-linear-to-r from-cyan-300 via-purple-500 to-pink-400 opacity-100 blur-2xl animate-pulse pointer-events-none"></span>
          <div className="relative z-10 overflow-x-auto bg-white rounded-3xl shadow-lg">
            <table className="min-w-full divide-y divide-gray-300 text-black">
              <thead className="bg-cyan-200">
                <tr>
                  <th className="px-6 py-3 text-left rounded-tl-3xl">Nombre</th>
                  <th className="px-6 py-3 text-left">Apellido</th>
                  <th className="px-6 py-3 text-left">Correo</th>
                  <th className="px-6 py-3 text-left">Rol</th>
                  <th className="px-6 py-3 text-center">Estado</th>
                  <th className="px-6 py-3 text-center rounded-tr-3xl">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {usuariosPaginados.map(u => (
                  <tr key={u.id} className="hover:bg-gray-100 transition">
                    <td className="px-6 py-4">{u.nombre}</td>
                    <td className="px-6 py-4">{u.apellido_paterno}</td>
                    <td className="px-6 py-4">{u.correo_electronico}</td>
                    <td className="px-6 py-4 capitalize">{u.rol}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full font-semibold ${u.estado === "Activo" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                        {u.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex justify-center gap-2">
                      <button onClick={() => handleEdit(u)} title="Editar Usuario">
                        <FaEdit className="text-cyan-400 hover:text-cyan-600 transition" size={20} />
                      </button>
                      <button onClick={() => handleToggle(u)} title="Toggle Estado">
                        {u.estado === "Activo" ? <FaToggleOn className="text-green-400" size={24} /> : <FaToggleOff className="text-red-400" size={24} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-center gap-3 mt-6">
        <button
          disabled={paginaActual === 1}
          className={buttonStyle}
          onClick={() => setPaginaActual(paginaActual - 1)}
        >
          Anterior
        </button>
        <span className="px-2 py-1 bg-cyan-200 text-black rounded-full shadow">{`${paginaActual} / ${totalPaginas}`}</span>
        <button
          disabled={paginaActual === totalPaginas}
          className={buttonStyle}
          onClick={() => setPaginaActual(paginaActual + 1)}
        >
          Siguiente
        </button>
      </div>

      {modalUsuario && (
        <ModalUsuario
          usuario={modalUsuario}
          usuarioLogueado={usuarioLogueado}
          onClose={() => setModalUsuario(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const buttonStyle =
  "bg-cyan-200 hover:bg-cyan-300 text-black px-4 py-2 rounded-3xl shadow transition-transform transform hover:scale-105 font-semibold";

export default Usuarios;