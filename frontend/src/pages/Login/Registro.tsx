import React, { useState, useEffect } from "react";
import {
  FaUserShield,
  FaUser,
  FaIdCard,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";
import { MdPhoneIphone } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaApple } from "react-icons/fa";
import { useIdioma } from "../../context/idiomaContext";

interface RegistroProps {
  mostrarLogin: () => void;
}

const Registro: React.FC<RegistroProps> = ({ mostrarLogin }) => {
  const [nombre, setNombre] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [cedulaIdentidad, setCedulaIdentidad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correoElectronico, setCorreoElectronico] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [genero, setGenero] = useState("");

  const { t: translate } = useIdioma();
  const [animar, setAnimar] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimar(true), 100);
  }, []);

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();

    if (contrasena !== confirmarContrasena) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    if (!genero) {
      alert("Selecciona un género.");
      return;
    }
    if (cedulaIdentidad.length !== 8) {
      alert("La cédula de identidad debe tener 8 números.");
      return;
    }
    if (telefono.length !== 8) {
      alert("El teléfono debe tener 8 números.");
      return;
    }

    const generoBackend =
      genero === "Masculino" ? "M" : genero === "Femenino" ? "F" : "O";

    const nuevoUsuario = {
      nombre,
      apellido_paterno: apellidoPaterno,
      apellido_materno: apellidoMaterno,
      cedula_identidad: cedulaIdentidad,
      telefono: `+591 ${telefono}`,
      correo_electronico: correoElectronico,
      contrasena,
      rol: "usuario",
      genero: generoBackend,
      estado: "Activo",
    };

    try {
      const respuesta = await fetch(
        `${import.meta.env.VITE_API_URL}/usuarios/registro`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevoUsuario),
        }
      );

      const data = await respuesta.json().catch(() => ({
        message: "Error en respuesta del servidor",
      }));

      if (respuesta.ok) {
        alert("Usuario registrado correctamente. Ahora inicia sesión.");
        mostrarLogin();
      } else {
        alert(`Error: ${data.message || "Revise los datos ingresados"}`);
      }
    } catch (error: any) {
      alert(
        `Error al registrar usuario: ${error?.message || "Revise los datos ingresados"}`
      );
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen w-full">
      {/* Fondo con overlay degradado */}
      <div
        className="absolute inset-0 bg-linear-to-b from-orange-400/30 via-transparent to-orange-600/20 z-0"
        style={{
          backgroundImage: 'url("https://cdn.shopify.com/s/files/1/0742/6437/9704/files/blog_genesis_joselin_1024x1024.png?v=1708553101")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Contenedor */}
      <div
        className={`relative z-10 flex flex-col items-center w-full max-w-4xl p-8 md:p-10 rounded-2xl bg-white/20 backdrop-blur-xl border border-[#DB752E74] shadow-lg transition-all duration-700
        ${animar ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        {/* Título */}
        <h2
          className={`flex items-center text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg mb-2 transition-all duration-700
          ${animar ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <FaUserShield className="mr-3" /> {translate("Registro de Usuario")}
        </h2>

        {/* Subtítulo */}
        <p
          className={`text-white text-lg md:text-xl drop-shadow-md mb-6 text-center transition-all duration-700 delay-100
          ${animar ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          {translate("Bienvenido a Huellitas")}
        </p>

        {/* Formulario */}
        <form className="flex flex-col gap-4 w-full" onSubmit={handleRegistro}>
          {/* Fila 1: nombres */}
          <div className="flex flex-wrap gap-4 md:flex-row md:gap-6">
            <InputIcon
              icon={<FaUser />}
              placeholder={translate("Nombre")}
              value={nombre}
              onChange={(val) =>
                /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/.test(val) && setNombre(val)
              }
              animar={animar}
            />
            <InputIcon
              icon={<FaUser />}
              placeholder={translate("Apellido Paterno")}
              value={apellidoPaterno}
              onChange={(val) =>
                /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/.test(val) && setApellidoPaterno(val)
              }
              animar={animar}
            />
            <InputIcon
              icon={<FaUser />}
              placeholder={translate("Apellido Materno")}
              value={apellidoMaterno}
              onChange={(val) =>
                /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/.test(val) && setApellidoMaterno(val)
              }
              animar={animar}
            />
          </div>

          {/* Fila 2: CI, teléfono, correo */}
          <div className="flex flex-wrap gap-4 md:flex-row md:gap-6 items-center">
            <InputIcon
              icon={<FaIdCard />}
              placeholder={translate("Cédula de Identidad")}
              value={cedulaIdentidad}
              onChange={(val) => /^\d{0,8}$/.test(val) && setCedulaIdentidad(val)}
              animar={animar}
            />
            <div
              className={`flex items-center gap-2 flex-1 border border-white rounded-lg p-2 bg-white/20 backdrop-blur-sm shadow-inner focus-within:ring-2 focus-within:ring-yellow-400 transition-all duration-700 ${
                animar ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <button
                type="button"
                className="bg-[#e9a154e0] text-black font-bold px-2 py-1 rounded"
              >
                +591
              </button>
              <MdPhoneIphone className="text-black text-xl" />
              <input
                type="text"
                placeholder={translate("Número (8 dígitos)")}
                value={telefono}
                onChange={(e) =>
                  /^\d{0,8}$/.test(e.target.value) && setTelefono(e.target.value)
                }
                className="w-full bg-transparent outline-none text-black px-2"
                required
              />
            </div>

            <InputIcon
              icon={<FaEnvelope />}
              placeholder={translate("Correo Electrónico")}
              value={correoElectronico}
              onChange={setCorreoElectronico}
              type="email"
              animar={animar}
            />
          </div>

          {/* Fila 3: contraseña y género */}
          <div className="flex flex-wrap gap-4 md:flex-row md:gap-6 items-center">
            <InputIcon
              icon={<FaLock />}
              placeholder={translate("Contraseña")}
              value={contrasena}
              onChange={setContrasena}
              type="password"
              animar={animar}
            />
            <InputIcon
              icon={<FaLock />}
              placeholder={translate("Confirmar Contraseña")}
              value={confirmarContrasena}
              onChange={setConfirmarContrasena}
              type="password"
              animar={animar}
            />
            <select
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
              className={`flex-1 border border-white rounded-lg p-2 bg-white/20 backdrop-blur-sm shadow-inner focus-within:ring-2 focus-within:ring-yellow-400 transition-all duration-700 ${
                animar ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              required
            >
              <option value="">{translate("Selecciona género")}</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          {/* Botón Crear cuenta */}
          <button
            type="submit"
            className={`w-full bg-linear-to-r from-[#E6A84E] to-[#8C5E3C] text-white py-3 rounded-md font-semibold shadow-md 
              hover:scale-105 hover:brightness-110 transition-all duration-700
              ${animar ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {translate("Crear cuenta")}
          </button>
        </form>

        {/* Social login */}
        <p
          className={`text-white mt-3 text-center transition-all duration-700 delay-100 ${
            animar ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {translate("O regístrate con")}
        </p>
        <div
          className={`flex justify-center gap-6 mt-2 flex-wrap transition-all duration-700 delay-200 ${
            animar ? "opacity-100 scale-100" : "opacity-0 scale-75"
          }`}
        >
          <a
            href="https://accounts.google.com/signin"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FcGoogle className="text-3xl cursor-pointer hover:scale-125 hover:brightness-110 transition-all" />
          </a>
          <a
            href="https://www.facebook.com/login/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3967c1]"
          >
            <FaFacebookF className="text-3xl cursor-pointer hover:scale-125 hover:brightness-110 transition-all" />
          </a>
          <a
            href="https://appleid.apple.com/sign-in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black"
          >
            <FaApple className="text-3xl cursor-pointer hover:scale-125 hover:brightness-110 transition-all" />
          </a>
        </div>

        {/* Link Inicia sesión */}
        <p
          className={`text-black text-center mt-4 transition-all duration-700 delay-300 ${
            animar ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {translate("¿Ya tienes cuenta?")}
          <span className="ml-4"></span>
          <button
            onClick={mostrarLogin}
            className="font-bold underline text-white hover:text-yellow-400 active:text-[#E6A84E] transition-colors text-lg"
          >
            {translate("Inicia sesión")}
          </button>
        </p>
      </div>
    </div>
  );
};

// Componente Input con icono y animación
const InputIcon: React.FC<{
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  animar?: boolean;
}> = ({ icon, placeholder, value, onChange, type = "text", animar = false }) => (
  <div
    className={`flex items-center gap-2 flex-1 border border-white rounded-lg p-2 bg-white/20 backdrop-blur-sm shadow-inner focus-within:ring-2 focus-within:ring-yellow-400 transition-all duration-700 ${
      animar ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    }`}
  >
    {icon}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-transparent outline-none text-black px-2"
      required
      autoComplete={type === "password" ? "new-password" : "off"}
    />
  </div>
);

export default Registro;