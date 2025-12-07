# Albergue Huellitas - Frontend
Este repositorio contiene la parte frontend del proyecto Albergue Huellitas, una plataforma web diseñada para gestionar un albergue de mascotas.

La aplicación permite:
1. Administrar usuarios con roles diferenciados (administrador y usuario).
2. Gestionar animales disponibles para adopción (perros y gatos).
3. Registrar y hacer seguimiento de adopciones y voluntarios.
4. Generar reportes descargables en CSV, Excel y PDF.
5. Navegar de manera responsiva y organizada en dispositivos móviles y escritorio.

# Tecnologías utilizadas
1. React v18 con TypeScript
2. Vite como bundler y entorno de desarrollo
3. Axios para consumir la API del backend.
4. React Icons para íconos de la interfaz
5. jsPDF y XLSX para exportación de reportes
6. CSS-in-JS con CSSProperties para estilos dinámicos
7. React Icons para iconografía.
8. React Router DOM para navegación.


# Estructura de frontend 
├── 📁 public ← Archivos públicos accesibles desde el navegador
│   ├── 🖼️ LOGITO (2).jpeg  <-Logo usado en pantallas o favicon
│   ├── 🖼️ Logito.jpeg  ← Otra versión del logo
│   └── 🖼️ vite.svg ← Logo por defecto de Vite 
├── 📁 src      ← Todo el código principal del proyecto
│   ├── 📁 assets    ← Imágenes, videos y recursos estáticos
│   │   ├── 📁 videos    ← Videos
│   │   │   ├── 🎬 videoemotivo.mp4  
│   │   │   └── 🎬 voluntario.mp4
│   │   ├── 🖼️ Excel.jpg  ← Icono para exportar Excel
│   │   ├── 🖼️ LOGITO (2).jpeg   ← Logo adicional en assets
│   │   ├── 🖼️ csv.png  ← Icono para archivos CSV
│   │   ├── 🖼️ pdf.jpg+  ← Icono para archivos PDF
│   │   └── 🖼️ react.svg  ← Logo de React
│   ├── 📁 componentes   ← Componentes reutilizables de la interfaz
│   │   ├── 📁 Bandejas  ← Secciones tipo tabla/listado para CRUD
│   │   │   ├── 📄 BandejaAdopcion.tsx
│   │   │   ├── 📄 BandejaVoluntario.tsx
│   │   │   ├── 📄 BandejasAnimales.tsx
│   │   │   ├── 📄 BandejasDonacion.tsx
│   │   │   └── 📄 BandejasUsuarios.tsx
│   │   ├── 📁 Modal    ← Ventanas modales para crear/editar registros
│   │   │   ├── 📄 ModalAdopcion.tsx
│   │   │   ├── 📄 ModalAnimal.tsx
│   │   │   ├── 📄 ModalDonacion.tsx
│   │   │   ├── 📄 ModalUsuario.tsx
│   │   │   └── 📄 ModalVoluntarios.tsx
│   │   ├── 📄 InicioContenido.tsx    ← Contenido de la pantalla de inicio
│   │   ├── 📄 Navbar.tsx    ← Barra superior de navegación
│   │   └── 📄 Sidebar.tsx   ← Menú lateral (Admin y Usuario)
│   ├── 📁 context     ← Contextos globales de la app
│   │   └── 📄 idiomaContext.tsx   ← Contexto para cambiar idioma (ES/EN)
│   ├── 📁 hooks     ← Hooks personalizados
│   │   └── 📄 useFetch.ts    ← Hook para peticiones HTTP
│   ├── 📁 layouts  ← Diseños que envuelven cada página
│   │   ├── 📄 DashboardLayout.tsx   ← Layout principal del Admin 
│   │   └── 📄 PublicLayout.tsx    ← Layout para usuarios no autenticados
│   ├── 📁 locales   ← Archivos de traducción
│   │   ├── 📁 en
│   │   │   └── ⚙️ translation.json  ← Textos en inglés
│   │   └── 📁 es
│   │       └── ⚙️ translation.json   ← Textos en español
│   ├── 📁 pages            ← Todas las páginas completas
│   │   ├── 📁 Admin  ← Páginas exclusivas del administrador
│   │   │   ├── 📄 AnimalesAdmin.tsx   ← Gestión de animales
│   │   │   ├── 📄 InicioAdmin.tsx  <- Inicio de admin
│   │   │   ├── 📄 ReportesAdmin.tsx ← Reportes
│   │   │   ├── 📄 SalirAdmin.tsx   ← Cerrar sesión admin
│   │   │   ├── 📄 Usuarios.tsx  ← Gestión de usuarios
│   │   │   ├── 📄 VoluntariosAdmin.tsx   ← Gestión de voluntarios
│   │   │   ├── 📄 adopcionesAdmin.tsx  ← Gestión de adopciones
│   │   │   └── 📄 donacionAdmin.tsx  ← Gestión de donaciones
│   │   ├── 📁 Login
│   │   │   ├── 📄 Login.tsx  ← Pantalla de login
│   │   │   └── 📄 Registro.tsx    ← Registro de nuevos usuarios
│   │   └── 📁 Usuario     ← Páginas del usuario normal
│   │       ├── 📄 Adopciones.tsx  ← Ver y solicitar adopciones
│   │       ├── 📄 Animales.tsx   ← Ver animales disponibles
│   │       ├── 📄 Inicio.tsx   ← Inicio para usuarios
│   │       ├── 📄 Salir.tsx  ← Cerrar sesión usuario 
│   │       ├── 📄 Voluntarios.tsx  ← Información para voluntarios
│   │       └── 📄 donaciones.tsx  ← Donaciones del usuario
│   ├── 📁 types
│   │   └── 📄 types.ts   ← Tipos TypeScript usados en toda la app
│   ├── 🎨 App.css
│   ├── 📄 App.tsx  ← Configuración de rutas y AppRoot
│   ├── 📄 i18n.ts   ← Configuración de idiomas
│   ├── 🎨 index.css  ← Estilos globales
│   └── 📄 main.tsx  ← Punto de entrada de React
├── ⚙️ .gitignore   ← Archivos a ignorar por Git
├── 📝 README.md    ← Documentación del proyecto
├── 📄 eslint.config.js  ← Reglas de eslint
├── 🌐 index.html   ← HTML base de React
├── ⚙️ package-lock.json   ← Control de versiones exactas de dependencias
├── ⚙️ package.json     ← Dependencias y scripts del proyecto
├── 📄 postcss.config.cjs   ← Configuración de PostCSS
├── 📄 tailwind.config.cjs    ← Configuración de TailwindCSS
├── ⚙️ tsconfig.app.json   ← Configuración TS para la app
├── ⚙️ tsconfig.json   ← Configuración global de TypeScript
├── ⚙️ tsconfig.node.json   ← Configuración TS para entorno Node
└── 📄 vite.config.ts    ← Configuración principal de Vite

# Requisitos previos
Antes de ejecutar el proyecto, es necesario tengas instaladas las siguientes herramientas:

1. Node.js (versión 18 o superior)

- Descargar desde:
https://nodejs.org/

2. Para verificar la instalación:
node -v
npm -v

# Archivos importantes para que funcione
1. .env en la raíz de frontend:
VITE_API_URL=http://localhost:5000/api  # URL del backend
VITE_HOST=0.0.0.0                        # Permite acceder desde cualquier IP
VITE_PORT=5173                     # Puerto del frontend



# Instalación de Dependencias
Ejecutar dentro del proyecto:

npm install

Este comando instala todas las librerías necesarias para que el frontend funcione correctamente.

# Cómo Ejecutar el Proyecto
Después de instalar dependencias:
npm run dev

El sistema iniciará en:  http://localhost:5173

# Conexión con el Backend
import.meta.env.VITE_API_URL
Asegúrate de que:

-El backend esté encendido.
-El backend no tenga errores al iniciar.
-El puerto configurado coincida con tu .env.

# Flujo rápido de prueba

Abrir navegador en http://localhost:5173.

Iniciar sesión con Administrador
1. Correo: Administrador@gmail.com
2. Contraseña: admi-123

Para asi navegar entre Usuarios, Animales, Adopciones, Voluntarios y Reportes. Y asi realizar las siguientes acciones de crear, editar,etc.

# Instalación y ejecución
1. Clonar el repositorio:
git clone https://github.com/Gladys-2/P.
A-frontend_programacion_Internet.git

2. Entrar a la carpeta del frontend
cd P.A-frontend_programacion_Internet/frontend

3. Instalar dependencias
npm install

4. Ejecutar en modo desarrollo
npm run dev