import React, { useState, useEffect } from "react";
import type { Usuario } from "../../types/types";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaIdCard } from "react-icons/fa";

interface ModalProps {
  usuario: Usuario | null;
  usuarioLogueado: Usuario;
  onClose: () => void;
  onSave: () => void;
}

const API_URL = import.meta.env.VITE_API_URL;

const ModalUsuario: React.FC<ModalProps> = ({ usuario, usuarioLogueado, onClose, onSave }) => {
  const soyAdmin = usuarioLogueado.rol === "administrador";

  const [nombre, setNombre] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [correoElectronico, setCorreoElectronico] = useState("");
  const [telefono, setTelefono] = useState("");
  const [cedula, setCedula] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [rol, setRol] = useState<"usuario" | "administrador">("usuario");
  const [estado, setEstado] = useState<"Activo" | "Inactivo">("Activo");
  const [genero, setGenero] = useState<"M" | "F" | "O">("M");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (usuario) {
      setNombre(usuario.nombre ?? "");
      setApellidoPaterno(usuario.apellido_paterno ?? "");
      setApellidoMaterno(usuario.apellido_materno ?? "");
      setCorreoElectronico(usuario.correo_electronico ?? "");
      setTelefono(usuario.telefono ?? "");
      setCedula(usuario.cedula_identidad ?? "");
      setRol(usuario.rol ?? "usuario");
      setEstado(usuario.estado ?? "Activo");
      setGenero(usuario.genero ?? "M");
    } else {
      setNombre("");
      setApellidoPaterno("");
      setApellidoMaterno("");
      setCorreoElectronico("");
      setTelefono("");
      setCedula("");
      setContrasena("");
      setRol("usuario");
      setEstado("Activo");
      setGenero("M");
    }
  }, [usuario]);

  const soloLetrasInput = (val: string) => val.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
  const soloNumerosInput = (val: string, maxLength: number) =>
    val.replace(/[^0-9]/g, "").slice(0, maxLength);

  const handleSubmit = async () => {
    if (!soyAdmin) return;

    if (!nombre || !apellidoPaterno || !apellidoMaterno || !correoElectronico || (!usuario?.id && !contrasena)) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }

    const payload: Partial<Usuario> = {
      nombre,
      apellido_paterno: apellidoPaterno,
      apellido_materno: apellidoMaterno,
      correo_electronico: correoElectronico,
      telefono,
      cedula_identidad: cedula,
      rol,
      estado,
      genero,
    };

    if (!usuario?.id) payload.contrasena = contrasena;

    try {
      setGuardando(true);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No se encontró token de autenticación.");
        return;
      }

      if (usuario?.id) {
        // Editar usuario
        await axios.put(`${API_URL}/usuarios/${usuario.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Crear usuario
        await axios.post(`${API_URL}/usuarios/registro`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      onSave();
      onClose();
    } catch (err) {
      console.error(err);
      alert("No se pudo guardar el usuario.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-3xl w-11/12 max-w-3xl p-8 flex flex-col gap-5 shadow-2xl animate-scaleIn">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
          {usuario ? "Editar Usuario" : "Crear Usuario"}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <InputIcon
            icon={<FaUser />}
            label="Nombre"
            value={nombre}
            onChange={val => setNombre(soloLetrasInput(val))}
            disabled={!soyAdmin || guardando}
          />
          <InputIcon
            icon={<FaUser />}
            label="Apellido Paterno"
            value={apellidoPaterno}
            onChange={val => setApellidoPaterno(soloLetrasInput(val))}
            disabled={!soyAdmin || guardando}
          />
          <InputIcon
            icon={<FaUser />}
            label="Apellido Materno"
            value={apellidoMaterno}
            onChange={val => setApellidoMaterno(soloLetrasInput(val))}
            disabled={!soyAdmin || guardando}
          />
          <InputIcon
            icon={<FaEnvelope />}
            label="Correo Electrónico"
            type="email"
            value={correoElectronico}
            onChange={setCorreoElectronico}
            disabled={!soyAdmin || guardando}
          />
          {!usuario?.id && (
            <InputIcon
              icon={<FaLock />}
              label="Contraseña"
              type="password"
              value={contrasena}
              onChange={setContrasena}
              disabled={!soyAdmin || guardando}
            />
          )}
          <InputIcon
            icon={<FaPhone />}
            label="Teléfono"
            value={telefono}
            onChange={val => setTelefono(soloNumerosInput(val, 10))}
            disabled={!soyAdmin || guardando}
          />
          <InputIcon
            icon={<FaIdCard />}
            label="Cédula"
            value={cedula}
            onChange={val => setCedula(soloNumerosInput(val, 8))}
            disabled={!soyAdmin || guardando}
          />
        </div>

        <div className="flex gap-3 mt-4">
          <select value={rol} onChange={e => setRol(e.target.value as any)} className={selectStyle} disabled={!soyAdmin || guardando}>
            <option value="usuario">Usuario</option>
            <option value="administrador">Administrador</option>
          </select>
          <select value={estado} onChange={e => setEstado(e.target.value as any)} className={selectStyle} disabled={!soyAdmin || guardando}>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
          <select value={genero} onChange={e => setGenero(e.target.value as any)} className={selectStyle} disabled={!soyAdmin || guardando}>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="O">Otro</option>
          </select>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          {soyAdmin && (
            <button onClick={handleSubmit} disabled={guardando} className={`${buttonGuardar} ${guardando ? "opacity-50 cursor-not-allowed" : ""}`}>
              {guardando ? "Guardando..." : "Guardar"}
            </button>
          )}
          <button onClick={onClose} disabled={guardando} className={buttonCancelar}>
            Cerrar
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scaleIn { from { transform: scale(0.85); opacity:0;} to { transform: scale(1); opacity:1;} }
        @keyframes fadeIn { from { opacity:0;} to { opacity:1;} }
        .animate-scaleIn { animation: scaleIn 0.35s ease forwards; }
        .animate-fadeIn { animation: fadeIn 0.3s ease forwards; }
      `}</style>
    </div>
  );
};

interface InputIconProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  disabled?: boolean;
}

const InputIcon: React.FC<InputIconProps> = ({ icon, label, value, onChange, type = "text", disabled }) => {
  return (
    <div className="relative w-full flex items-center gap-2">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        placeholder=" "
        className="peer border border-gray-300 px-10 pt-4 pb-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow text-gray-900 z-10"
      />
      <label className={`absolute left-10 text-sm font-medium transition-all pointer-events-none
        ${value ? "-top-1 text-cyan-500 bg-white px-3" : "top-4 text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500"}`}
      >
        {label}
      </label>
    </div>
  );
};

const selectStyle = "border border-gray-300 px-4 py-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow";
const buttonGuardar = "bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition transform hover:scale-105";
const buttonCancelar = "bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-semibold shadow-md transition transform hover:scale-105";

export default ModalUsuario;