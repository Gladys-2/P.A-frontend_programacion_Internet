import React from "react";
import type { Usuario } from "../../types/types";
import { FaEdit, FaToggleOn, FaToggleOff } from "react-icons/fa";

interface BandejaUsuariosProps {
  usuarios: Usuario[];
  rolActual: "usuario" | "administrador";
  onEdit: (usuario: Usuario) => void;
  onToggle: (usuario: Usuario) => void;
}

const BandejaUsuarios: React.FC<BandejaUsuariosProps> = ({
  usuarios,
  onEdit,
  onToggle,
}) => {
  return (
    <div className="overflow-x-auto bg-gray-50 p-4 rounded-xl shadow-lg">
      <table className="min-w-[900px] w-full bg-white rounded-xl shadow-md overflow-hidden">
        <thead>
          <tr className="bg-cyan-100 text-gray-800">
            <th className="px-6 py-3 text-left font-semibold tracking-wide">Nombre</th>
            <th className="px-6 py-3 text-left font-semibold tracking-wide">Apellidos</th>
            <th className="px-6 py-3 text-left font-semibold tracking-wide">Cédula</th>
            <th className="px-6 py-3 text-left font-semibold tracking-wide">Teléfono</th>
            <th className="px-6 py-3 text-left font-semibold tracking-wide">Correo</th>
            <th className="px-6 py-3 text-left font-semibold tracking-wide">Rol</th>
            <th className="px-6 py-3 text-left font-semibold tracking-wide">Estado</th>
            <th className="px-6 py-3 text-left font-semibold tracking-wide">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr
              key={usuario.id}
              className="border-b hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <td className="px-6 py-3">{usuario.nombre}</td>
              <td className="px-6 py-3">{`${usuario.apellido_paterno ?? ""} ${usuario.apellido_materno ?? ""}`}</td>
              <td className="px-6 py-3">{usuario.cedula_identidad ?? "-"}</td>
              <td className="px-6 py-3">{usuario.telefono ?? "-"}</td>
              <td className="px-6 py-3">{usuario.correo_electronico}</td>
              <td className="px-6 py-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${usuario.rol === "administrador"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-teal-100 text-teal-800"
                    }`}
                >
                  {usuario.rol}
                </span>
              </td>
              <td className="px-6 py-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${usuario.estado === "Activo"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                    }`}
                >
                  {usuario.estado}
                </span>
              </td>
              <td className="px-6 py-3 flex gap-2">
                <button
                  onClick={() => onEdit(usuario)}
                  className="bg-black-100 hover:bg-cyan-100 text-white p-2 rounded-full transition-transform transform hover:scale-110 shadow-md"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => onToggle(usuario)}
                  className={`p-2 rounded-full transition-transform transform hover:scale-110 shadow-md ${usuario.estado === "Activo"
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                >
                  {usuario.estado === "Activo" ? (
                    <FaToggleOn size={20} />
                  ) : (
                    <FaToggleOff size={20} />
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BandejaUsuarios;