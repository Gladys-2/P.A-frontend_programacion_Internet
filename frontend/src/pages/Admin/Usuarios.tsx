import React, { useState, useEffect } from "react";
import type { Usuario } from "../../types/types";
import ModalUsuario from "../../componentes/Modal/ModalUsuario";
import axios from "axios";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaEdit, FaToggleOn, FaToggleOff, FaSearch } from "react-icons/fa";

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
  const itemsPorPagina = 5;

  const fetchUsuarios = async () => {
    try {
      setCargando(true);
      const res = await axios.get<Usuario[]>(`${API_URL}/usuarios`);
      setUsuarios(res.data.map(u => ({ ...u, estado: u.estado ?? "Activo" })));
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

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
      await axios.put(`${API_URL}/usuarios/${usuario.id}`, { estado: nuevoEstado });
      setUsuarios(prev =>
        prev.map(u => (u.id === usuario.id ? { ...u, estado: nuevoEstado } : u))
      );
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      alert("No se pudo cambiar el estado del usuario.");
    }
  };

  const handleSave = async () => {
    await fetchUsuarios();
    setModalUsuario(null);
  };

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
      styles: { halign: "center" },
      headStyles: { fillColor: [0, 184, 212], textColor: 255 },
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Usuarios Registrados</h1>

      <div className="flex flex-col md:flex-row md:justify-between mb-4 gap-2 items-center">
        <div className="relative w-full md:w-1/3">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar usuarios..."
            className="border px-10 py-2 rounded-3xl w-full shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>
        <div className="flex gap-2 mt-2 md:mt-0">
          <button onClick={exportCSV} className={buttonStyle}>CSV</button>
          <button onClick={exportExcel} className={buttonStyle}>Excel</button>
          <button onClick={exportPDF} className={buttonStyle}>PDF</button>
        </div>
        <button
          onClick={handleCreate}
          className="bg-cyan-200 hover:bg-cyan-200 text-lack px-5 py-2 rounded-3xl shadow-xl font-semibold transition-transform transform hover:scale-105"
        >
          + Agregar Usuario
        </button>
      </div>

      {cargando ? (
        <div className="text-center py-20 text-gray-500">Cargando usuarios...</div>
      ) : usuariosFiltrados.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No hay usuarios para mostrar.</div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-cyan-200 text-black">
                <tr>
                  <th className="px-6 py-3 text-left rounded-tl-xl">Nombre</th>
                  <th className="px-6 py-3 text-left">Apellido</th>
                  <th className="px-6 py-3 text-left">Correo</th>
                  <th className="px-6 py-3 text-left">Rol</th>
                  <th className="px-6 py-3 text-center">Estado</th>
                  <th className="px-6 py-3 text-center rounded-tr-xl">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {usuariosPaginados.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">{u.nombre}</td>
                    <td className="px-6 py-4">{u.apellido_paterno}</td>
                    <td className="px-6 py-4">{u.correo_electronico}</td>
                    <td className="px-6 py-4 capitalize">{u.rol}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-white font-semibold ${
                        u.estado === "Activo" ? "bg-green-500" : "bg-red-500"
                      }`}>
                        {u.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(u)}
                        className="text-cyan-500 hover:text-cyan-500 transition-transform transform hover:scale-125"
                        title="Editar Usuario"
                      >
                        <FaEdit size={20} />
                      </button>
                      <button
                        onClick={() => handleToggle(u)}
                        className={`transition-transform transform hover:scale-125 ${
                          u.estado === "Activo" ? "text-green-500" : "text-red-500"
                        }`}
                        title={u.estado === "Activo" ? "Desactivar Usuario" : "Activar Usuario"}
                      >
                        {u.estado === "Activo" ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="flex justify-center gap-3 mt-6">
            <button
              disabled={paginaActual === 1}
              className={buttonStyle}
              onClick={() => setPaginaActual(paginaActual - 1)}
            >
              Anterior
            </button>
            <span className="px-2 py-1 bg-white rounded-full shadow">{`${paginaActual} / ${totalPaginas}`}</span>
            <button
              disabled={paginaActual === totalPaginas}
              className={buttonStyle}
              onClick={() => setPaginaActual(paginaActual + 1)}
            >
              Siguiente
            </button>
          </div>
        </>
      )}

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
  "bg-cyan-200 hover:bg-cyan-500 text-lead px-4 py-2 rounded-3xl shadow transition-transform transform hover:scale-105 font-semibold";

export default Usuarios;