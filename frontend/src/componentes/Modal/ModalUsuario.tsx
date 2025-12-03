import React, { useState, useEffect } from "react";
import type { Usuario } from "../../types/types.ts";
import axios from "axios";

interface ModalProps {
  usuario: Usuario | null;
  usuarioLogueado: Usuario;
  onClose: () => void;
  onSave: () => void; // refresca lista completa en Usuarios.tsx
}

const API_URL = import.meta.env.VITE_API_URL;

const ModalUsuario: React.FC<ModalProps> = ({
  usuario,
  usuarioLogueado,
  onClose,
  onSave,
}) => {
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

  const handleSubmit = async () => {
    if (!soyAdmin) return;

    const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    const soloNumeros = /^[0-9]+$/;

    if (!nombre || !apellidoPaterno || !apellidoMaterno || !correoElectronico || (!usuario?.id && !contrasena)) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }

    if (!soloLetras.test(nombre) || !soloLetras.test(apellidoPaterno) || !soloLetras.test(apellidoMaterno)) {
      alert("Nombre y apellidos solo pueden contener letras.");
      return;
    }

    const telefonoStr = telefono ? String(telefono) : "";
    const cedulaStr = cedula ? String(cedula) : "";

    if ((telefonoStr && !soloNumeros.test(telefonoStr)) || (cedulaStr && !soloNumeros.test(cedulaStr))) {
      alert("Teléfono y cédula solo pueden contener números.");
      return;
    }

    const payload: Partial<Usuario> = {
      nombre,
      apellido_paterno: apellidoPaterno,
      apellido_materno: apellidoMaterno,
      correo_electronico: correoElectronico,
      telefono: telefonoStr,
      cedula_identidad: cedulaStr,
      rol,
      estado,
      genero,
    };

    if (!usuario?.id) payload.contrasena = contrasena;

    try {
      setGuardando(true);
      if (usuario?.id) {
        await axios.put(`${API_URL}/usuarios/${usuario.id}`, payload);
      } else {
        await axios.post(`${API_URL}/usuarios/registro`, payload);
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
      <div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-3xl w-11/12 max-w-xl p-8 flex flex-col gap-5 shadow-2xl animate-scaleIn">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
          {usuario ? "Editar Usuario" : "Crear Usuario"}
        </h2>

        <FloatingInput label="Nombre" value={nombre} onChange={setNombre} disabled={!soyAdmin || guardando} />
        <FloatingInput label="Apellido Paterno" value={apellidoPaterno} onChange={setApellidoPaterno} disabled={!soyAdmin || guardando} />
        <FloatingInput label="Apellido Materno" value={apellidoMaterno} onChange={setApellidoMaterno} disabled={!soyAdmin || guardando} />
        <FloatingInput label="Correo Electrónico" type="email" value={correoElectronico} onChange={setCorreoElectronico} disabled={!soyAdmin || guardando} />
        <FloatingInput label="Teléfono" value={telefono} onChange={setTelefono} disabled={!soyAdmin || guardando} />
        <FloatingInput label="Cédula de Identidad" value={cedula} onChange={setCedula} disabled={!soyAdmin || guardando} />
        {!usuario?.id && <FloatingInput label="Contraseña" type="password" value={contrasena} onChange={setContrasena} disabled={!soyAdmin || guardando} />}

        <div className="flex gap-3">
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

interface FloatingInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  disabled?: boolean;
}

const FloatingInput: React.FC<FloatingInputProps> = ({ label, value, onChange, type = "text", disabled }) => {
  return (
    <div className="relative w-full">
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        placeholder=" "
        className="peer border border-gray-300 px-4 pt-6 pb-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow text-gray-900 z-10"
      />
      <label className={`absolute left-4 text-sm font-medium transition-all pointer-events-none
          ${value ? "-top-2 text-cyan-400 bg-white px-1" : "top-3 text-gray-400 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400"}`}
      >
        {label}
      </label>
    </div>
  );
};

const selectStyle = "border border-gray-300 px-4 py-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow";
const buttonGuardar = "bg-cyan-500 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition transform hover:scale-105";
const buttonCancelar = "bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-semibold shadow-md transition transform hover:scale-105";

export default ModalUsuario;