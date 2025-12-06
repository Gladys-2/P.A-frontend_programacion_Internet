export type Pantalla =
  | "inicioPublico"
  | "login"
  | "registro"
  | "inicio"
  | "inicioAdmin"
  | "usuarios"
  | "reportes"
  | "animalesAdmin"
  | "voluntariosAdmin"
  | "adopcionesAdmin"
  | "donacionesAdmin"
  | "adopciones"
  | "animales"
  | "voluntarios"
  | "donaciones";

type RolUsuario = "usuario" | "administrador";

export interface Usuario {
  foto: string;
  id?: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  cedula_identidad?: string;
  telefono?: string;
  correo_electronico: string;
  contrasena?: string;
  email?: any;
  correo?: any;
  avatarUrl?: string;
  rol?: RolUsuario;
  genero?: "M" | "F" | "O";
  estado: "Activo" | "Inactivo";
  fecha_creacion?: Date;
  usuario_creacion?: string;
  fecha_modificacion?: Date;
  usuario_modificacion?: string;
}

export interface Refugio {
  id: number;
  nombre: string;
  direccion: string;
  telefono?: string;
  correo?: string;
  estado?: "Activo" | "Inactivo";
  fecha_creacion?: string;
  usuario_creacion?: string;
  fecha_modificacion?: string;
  usuario_modificacion?: string;
}
export interface Animal {
  color: any;
  genero: string;
  id?: number;
  nombre: string;
  especie?: string;
  raza?: string;
  edad?: number;
  descripcion?: string;
  sexo?: "Macho" | "Hembra";
  estado_animal?: "Disponible" | "Adoptado" | "En cuidado";
  foto?: string;
  imagen?: string;
  refugio_id?: number;
  estado?: "Activo" | "Inactivo";
  tamano?: "Pequeño" | "Mediano" | "Grande";
  peso?: number;
  vacunado?: boolean;
  esterilizado?: boolean;
  liked?: boolean;
  fecha_creacion?: string;
  usuario_creacion?: string;
  fecha_modificacion?: string;
  usuario_modificacion?: string;
  longitud?: number;
  latitud?: number;
}

export interface Adopcion {
  [x: string]: any;
  id?: number;
  usuario?: Usuario;
  animal?: Animal;
  estado?: "Pendiente" | "Aprobada" | "Rechazada";
  fechaSolicitud?: Date;
  fechaAprobacion?: Date | null;
  fechaRechazo?: Date | null;
  motivoRechazo?: string | null;
  comentarios?: string | null;
  activo: boolean;
}

export interface Donacion {
  comprobante: any;
  notasInternas: any;
  descripcion: any;
  metodo: string;
  fechaDonacion: any;
  nombreUsuario: string;
  id?: number;
  usuarioId?: number;
  monto: number;
  tipo?: string;
  metodoPago?: string;
  estado?: "Pendiente" | "Aprobada" | "Rechazada";
  fecha?: string;
  fecha_creacion?: string;
  usuario_creacion?: string;
  fecha_modificacion?: string;
  usuario_modificacion?: string;
  usuario?: Usuario;
  cantidad?: number;
}

export interface Voluntario {
  id?: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  fechaNacimiento?: string;
  telefono?: string;
  correo_electronico: string;
  direccion?: string;
  fechaIngreso?: string;
  areaAsignada?: string;
  disponibilidad?: string;
  observaciones?: string;
  estado?: "Activo" | "Inactivo";
}
