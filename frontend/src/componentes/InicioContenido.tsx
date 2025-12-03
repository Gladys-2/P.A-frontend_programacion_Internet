import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaFacebookF, FaInstagram, FaTiktok, FaChevronLeft, FaChevronRight, FaHeart, FaPaw, FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";
import { BiWorld } from 'react-icons/bi';
import { GiSittingDog } from 'react-icons/gi';
import { useTranslation } from "react-i18next";
import videoEmotivo from "../assets/videos/videoemotivo.mp4";

const mascotasAdopcionHero = [
    {
        id: 1,
        tituloPrincipal: "ALBERGUE HUELLITAS",
        subtituloPrincipal: "Huellitas",
        ubicacion: "Zona Bajo Llojeta, Calle 12 Los Nogales Curva N°3 #488.",
        descripcion: "Huellitas es un refugio lleno de amor y alegría, donde cada peludito recibe cuidado, cariño y la oportunidad de encontrar un hogar para siempre. Ven a conocer a nuestros adorables compañeros y deja que su ternura te robe una sonrisa.",
        imagenFondo: "https://eju.tv/wp-content/uploads/2021/08/img_611a51b217a86.jpg",
        imagenTarjeta: "https://eju.tv/wp-content/uploads/2021/08/img_611a51b217a86.jpg",
    },

    {
        id: 2,
        tituloPrincipal: "LUCAS",
        subtituloPrincipal: "BULLDOG",
        ubicacion: "3 Años | Enérgico",
        descripcion: "Lleno de energía, activo y leal. Necesita ejercicio diario y mucho amor.",
        imagenFondo: "https://th.bing.com/th/id/R.c95c975ab10b02706aee84de21f6ca7b?rik=EMIfXVmPBIEEMA&riu=http%3a%2f%2fimages.gmanews.tv%2fwebpics%2f2021%2f12%2f640_image013_2021_12_08_17_38_08.png&ehk=sqB6j9xIrqLZqoCj1Lrbor%2bU1rwFUdK5LFGfft9xblo%3d&risl=&pid=ImgRaw&r=0",
        imagenTarjeta: "https://th.bing.com/th/id/R.c95c975ab10b02706aee84de21f6ca7b?rik=EMIfXVmPBIEEMA&riu=http%3a%2f%2fimages.gmanews.tv%2fwebpics%2f2021%2f12%2f640_image013_2021_12_08_17_38_08.png&ehk=sqB6j9xIrqLZqoCj1Lrbor%2bU1rwFUdK5LFGfft9xblo%3d&risl=&pid=ImgRaw&r=0",
    },
    {
        id: 3,
        tituloPrincipal: "LUNA",
        subtituloPrincipal: "PASTOR ALEMÁN",
        ubicacion: "1 Año | Inteligente",
        descripcion: "Alegre, curiosa e inteligente. Lista para explorar y llenar tu hogar de ternura.",
        imagenFondo: "https://d.newsweek.com/en/full/1812951/chinook.jpg?w=1200&f=5db99a2d59d7ceb11db1cd37c1780552",
        imagenTarjeta: "https://d.newsweek.com/en/full/1812951/chinook.jpg?w=1200&f=5db99a2d59d7ceb11db1cd37c1780552",
    },
    {
        id: 4,
        tituloPrincipal: "Rocky",
        subtituloPrincipal: "Huscky Siberiano",
        ubicacion: "1 Año | Energetico",
        descripcion: "Jugueton, curioso e inteligente. Lista para explorar y llenar tu hogar de ternura.",
        imagenFondo: "https://images.evisos.com.bo/2014/08/14/cachorro-husky-siberiano_8a3254e2e8_3.jpg",
        imagenTarjeta: "https://images.evisos.com.bo/2014/08/14/cachorro-husky-siberiano_8a3254e2e8_3.jpg",
    },
    {
        id: 5,
        tituloPrincipal: "kiara",
        subtituloPrincipal: "Pomerania",
        ubicacion: "1 Año | Inteligente",
        descripcion: "Muy jugueton, cariñosa. Lista para explorar y llenar tu hogar de ternura.",
        imagenFondo: "https://www.periodicodigitalgratis.com/gratis/imagen/27551_0598598001571680018.jpg",
        imagenTarjeta: "https://www.periodicodigitalgratis.com/gratis/imagen/27551_0598598001571680018.jpg",
    },
];

const perrosData = [
    { nombre: "Enzo", edad: "2 años", raza: "mestizo", imagen: "https://i0.wp.com/revistareplicante.com/wp-content/uploads/2024/02/perro-viral-mendozajpg.webp?resize=688%2C387&ssl=1", descripcion: "Daizon es un compañero lleno de vida, muy cariñoso y juguetón. Ideal para familias." },
    { nombre: "Calvin", edad: "3 años", raza: "mestizo", imagen: "https://as1.ftcdn.net/jpg/05/29/22/62/1000_F_529226299_1FQhL4W1LLybcntYkdESK3eSBTppP1RY.jpg", descripcion: "Lucas es un compañero lleno de energía, muy activo y leal. Necesita ejercicio diario." },
    { nombre: "Rufo", edad: "1 año", raza: "Felis catus", imagen: "https://www.elespectador.com/resizer/v2/VCWTX52UGRCRZJZYSLINQVV3TQ.png?auth=75e1af6ddc68b2c9e6d9e54e4442ab86e0a052917c483dc37477e3805a827814&width=920&height=613&smart=true&quality=60", descripcion: "Luna es una compañera alegre y curiosa, muy inteligente y siempre lista para aprender cosas nuevas." },
];
const carouselPerros = [...perrosData, ...perrosData];


const blogs = [
    {
        titulo: "¿Cómo adoptar un perrito?",
        descripcion: "Adoptar un perrito es más que un trámite: es abrirle la puerta a una segunda oportunidad. Todo comienza eligiendo al compañero que encaje con tu ritmo de vida. Luego, completas un formulario y conversas con el equipo del refugio, quienes desean asegurarse de que el perrito llegue a un hogar donde será realmente amado. Si todo va bien, firmas el acuerdo de adopción y ese día se convierte en el inicio de una nueva historia para ambos. No es solo un proceso… es el comienzo de una amistad que cambiará vidas.",
        imagen: "https://www.publimetro.com.mx/resizer/v2/NESS67MWA5BGPMCC3TTRMYBBJY.jpg?auth=3b00a74d1e37e8365c56f5e2dd684a92081f3d0c07fc09e9ab6fd9c0c756d944&width=1200&height=900&smart=true",
    },
    {
        titulo: "Cuidados básicos",
        descripcion: "Aprende cómo cuidar correctamente a tu nuevo amigo peludo: Cuidar a un perrito es una manera hermosa de agradecerle su compañía. Necesita alimento adecuado, agua fresca y un espacio donde pueda sentirse seguro. Pero más allá de lo básico, requiere paseos, juegos, palabras amables y un poco de paciencia. Cada día que lo cuidas, él te responde con lealtad, alegría y esa mirada que solo un perrito adoptado sabe dar: una mezcla de gratitud y amor puro.",
        imagen: "https://images.unsplash.com/photo-1564325810764-3b92cd6a1833?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE3fHx8ZW58MHx8fHx8",
    },
    {
        titulo: "La importancia de la esterilización",
        descripcion: "Descubre por qué esterilizar a tu mascota es fundamental para su salud y la comunidad: Esterilizar a un perrito es un acto de responsabilidad y, sobre todo, de amor. Este procedimiento previene enfermedades, evita camadas no deseadas y ayuda a reducir el abandono en las calles. Más que una cirugía, es una manera de proteger su salud y su futuro. Al esterilizar, estás contribuyendo a que menos animales sufran, y eso convierte tu decisión en un gesto que trasciende a tu propia mascota. Es cuidar a uno… y ayudar a muchos.",
        imagen: "https://lapaz.bo/wp-content/uploads/2024/06/can2.jpg",
    },
];

const latitud = -16.5;
const longitud = -68.15;
const direccion = "Calle de las Huellitas #2311, La Paz, Bolivia";

interface InicioContenidoProps {
    sidebarAbierto: boolean;
}

const InicioContenido: React.FC<InicioContenidoProps> = ({ sidebarAbierto }) => {
    const { t } = useTranslation();
    const [indiceMascotaActual, setIndiceMascotaActual] = useState(0);
    const [emailSuscripcion, setEmailSuscripcion] = useState("");
    const mascotaActiva = mascotasAdopcionHero[indiceMascotaActual];

    const siguienteMascota = () => setIndiceMascotaActual((prev) => (prev + 1) % mascotasAdopcionHero.length);
    const anteriorMascota = () => setIndiceMascotaActual((prev) => (prev - 1 + mascotasAdopcionHero.length) % mascotasAdopcionHero.length);


    const handleSuscribirse = (e: React.FormEvent) => {
        e.preventDefault();
        if (!emailSuscripcion) return alert("Ingresa un correo válido");
        alert(`¡Gracias por suscribirte! Correo: ${emailSuscripcion}`);
        setEmailSuscripcion("");
    };

    return (
        <div
            className="w-full transition-all duration-300 overflow-x-hidden"
            style={{ marginLeft: sidebarAbierto ? 0 : 0 }}
        >
            {/* inicio..*/}
            <section className="relative w-full h-screen flex items-end justify-start pb-50  overflow-hidden text-white">
                <AnimatePresence initial={false}>
                    <motion.div
                        key={mascotaActiva.id}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('${mascotaActiva.imagenFondo}')` }}
                    />
                </AnimatePresence>
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

                <div className="relative z-10 text-center text-white px-2 md:text-left md:px-1 max-w-2xl mb-5">
                    <motion.span className="text-xl font-semibold tracking-wide uppercase text-orange-400">
                        {t(mascotaActiva.ubicacion)}
                    </motion.span>
                    <motion.h1 className="text-5xl sm:text-8xl lg:text-7xl font-extrabold drop-shadow-lg leading-none">
                        {mascotaActiva.tituloPrincipal}
                    </motion.h1>
                    <motion.h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold drop-shadow-lg leading-tight text-gray-200">
                        {mascotaActiva.subtituloPrincipal}
                    </motion.h2>
                    <motion.p className="mt-4 text-xl max-w-lg">
                        {t(mascotaActiva.descripcion)}
                    </motion.p>
                </div>

                {/* Carrusel lateral */}
                <div className="relative z-10 w-full lg:w-1/2 flex items-end justify-end space-x-4 lg:space-x-6 pb-4 md:pb-0">
                    {mascotasAdopcionHero.map((mascota, index) => (
                        <motion.div
                            key={mascota.id}
                            className={`w-40 h-64 rounded-xl overflow-hidden shadow-2xl cursor-pointer transition-transform duration-300
                                ${index === indiceMascotaActual ? "scale-110 border-4 border-orange-500" : "scale-90 opacity-70 hover:opacity-100 hover:scale-95"}`}
                            onClick={() => setIndiceMascotaActual(index)}
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 + 1.2, duration: 0.8 }}
                        >
                            <img src={mascota.imagenTarjeta} alt={mascota.tituloPrincipal} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent flex items-end p-4">
                                <h3 className="text-white text-md font-semibold leading-tight">{mascota.tituloPrincipal}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Controles */}
                <div className="absolute bottom-6 left-8 z-20 flex items-center space-x-4">
                    <button onClick={anteriorMascota} className="p-3 bg-white/20 text-white rounded-full hover:bg-white/40 backdrop-blur-sm">
                        <FaChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={siguienteMascota} className="p-3 bg-white/20 text-white rounded-full hover:bg-white/40 backdrop-blur-sm">
                        <FaChevronRight className="w-5 h-5" />
                    </button>
                    <span className="text-xl font-bold ml-4">{String(indiceMascotaActual + 1).padStart(2, "0")}</span>
                </div>
            </section>

            {/* --- */}

            {/*miion */}
            <section className="w-full py-20 bg-gray-100">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-5xl font-extrabold text-gray-800 mb-4 flex items-center justify-center gap-3">
                        <FaHeart className="text-orange-500 text-4xl" />
                        {t("Nuestra Misión en Huellitas")}
                    </h2>
                    <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-12">{t("Nos dedicamos a transformar vidas, encontrando hogares amorosos para cada animal rescatado, y promoviendo la tenencia responsable.")}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* Tarjeta 1 */}
                        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-teal-500 hover:shadow-xl transition-shadow">
                            <GiSittingDog className="text-6xl text-teal-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">{t("Rescate y Rehabilitación")}</h3>
                            <p className="text-gray-600">{t("Ofrecemos un refugio seguro, atención médica y el amor necesario para que se recuperen física y emocionalmente.")}</p>
                        </div>
                        {/* Tarjeta 2 */}
                        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-orange-500 hover:shadow-xl transition-shadow">
                            <FaPaw className="text-6xl text-orange-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">{t("Conexiones para Siempre")}</h3>
                            <p className="text-gray-600">{t("Facilitamos el proceso de adopción, asegurando que cada mascota encuentre el hogar perfecto para sus necesidades.")}</p>
                        </div>
                        {/* Tarjeta 3 */}
                        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-teal-500 hover:shadow-xl transition-shadow">
                            <BiWorld className="text-6xl text-teal-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">{t("Educación Comunitaria")}</h3>
                            <p className="text-gray-600">{t("Promovemos campañas de esterilización y educamos sobre los derechos y el cuidado de los animales.")}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sección con video y mensaje emotivo */}
            <section className="w-full flex flex-col md:flex-row items-center justify-center gap-6 mb-4">
                {/* Mensaje de bienvenida y cuidado */}
                <div className="md:w-1/2 p-6 text-black">
                    <h2 className="text-3xl font-bold mb-4">¡Nuestros peluditos necesitan tu ayuda!</h2>
                    <p className="text-lg mb-2">
                        Cada perrito merece un hogar lleno de amor y cuidados.
                        La vida en las calles es peligrosa y llena de sufrimiento.
                    </p>
                    <p className="text-lg">
                        Con tu apoyo podemos rescatar, alimentar y darles la oportunidad de ser felices.
                        No los dejemos solos en las calles, cada adopción salva una vida.
                    </p>
                </div>

                {/* Video emotivo */}
                <div className="md:w-1/2 relative h-[300px] md:h-[500px] w-full">
                    <video
                        src={videoEmotivo}
                        autoPlay
                        muted
                        loop
                        playsInline
                        controls
                        className="w-full h-full object-cover rounded-lg shadow-lg"
                    />
                </div>
            </section>

            {/* el carrusel del perro*/}
            <section className="relative w-full min-h-[700px] py-32 bg-linear-to-b from-white to-orange-50 flex flex-col items-center overflow-hidden border-t border-gray-200">
                <h2 className="relative z-10 text-5xl font-extrabold text-gray-800 mb-4 flex items-center gap-3">
                    <GiSittingDog className="text-orange-500 text-5xl" />
                    {t("Listos para Adoptar")}
                </h2>
                <p className="relative z-10 text-xl text-gray-600 mb-12 text-center max-w-3xl">{t("Desliza para conocer a nuestros residentes más recientes y encuentra a tu nuevo mejor amigo.")}</p>

                <div className="relative z-10 w-full max-w-7xl mx-auto overflow-hidden">
                    <motion.div className="flex items-stretch gap-8" animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, duration: 30, ease: "linear" }}>
                        {carouselPerros.map((perro, idx) => (
                            <div key={idx} className="flex-none w-[350px] bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-transform hover:scale-105 cursor-pointer border-4 border-white hover:border-teal-500">
                                <img src={perro.imagen} alt={perro.nombre} className="w-full h-72 object-cover" />
                                <div className="p-6 flex flex-col justify-between h-auto min-h-[170px]">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{perro.nombre}</h3>
                                        <p className="text-orange-600 font-semibold text-base mb-2">{t("Edad")}: {perro.edad} | {t("Raza")}: {perro.raza}</p>
                                        <p className="text-gray-600 text-sm line-clamp-none">{perro.descripcion}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* --- */}

            {/* 4. Blogs */}
            <section className="w-full py-20 bg-gray-100 flex flex-col items-center border-t border-gray-200">
                <h2 className="text-5xl font-extrabold mb-4 text-gray-800 flex items-center gap-3">
                    <FaPaw className="text-teal-500 text-4xl" />
                    {t("Consejos y Artículos")}
                </h2>
                <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl">
                    {t("Aprende sobre cuidados, historias de éxito y las últimas noticias de Huellitas.")}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl px-6">
                    {blogs.map((blog, idx) => (
                        <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                            <img src={blog.imagen} alt={blog.titulo} className="w-full h-56 object-cover" />
                            <div className="p-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">{t(blog.titulo)}</h3>
                                <p className="text-gray-600 line-clamp-none">{t(blog.descripcion)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            {/* --- Voluntariado con video --- */}
            <section className="w-full py-20 bg-orange-50 flex flex-col md:flex-row items-center justify-center gap-12 px-6 border-t border-gray-200">
                {/* Video animado a la izquierda */}
                <motion.div
                    className="md:w-2/5 w-full rounded-xl overflow-hidden shadow-2xl"
                    initial={{ x: -100, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                >
                    <video
                        src="../src/assets/videos/voluntario.mp4" // Aquí pon tu URL de video
                        autoPlay
                        muted={false}
                        loop
                        playsInline
                        controls
                        className="w-full h-[350px] object-cover rounded-xl"
                    />
                </motion.div>

                {/* Descripción a la derecha */}
                <motion.div
                    className="md:w-3/5 w-full flex flex-col justify-center text-center md:text-left"
                    initial={{ x: 100, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                >
                    <h2 className="text-4xl md:text-5xl font-extrabold text-orange-500 mb-6 flex items-center gap-3">
                        <FaHeart /> ¡Sé Voluntario!
                    </h2>
                    <p className="text-lg md:text-xl text-gray-700 mb-6">
                        Únete a Huellitas y transforma vidas, tanto de los animales como de tu propia experiencia. Como voluntario, tendrás la oportunidad de cuidar, alimentar y socializar a nuestros peluditos, ayudándolos a ganar confianza y alegría. Participarás en campañas de adopción, educación comunitaria y eventos especiales que buscan crear conciencia sobre la tenencia responsable. Cada hora que dedicas permite que más animales reciban atención médica, rehabilitación y amor mientras esperan su hogar definitivo. Además, formar parte de nuestro equipo fortalece valores como la empatía, el trabajo en equipo y la responsabilidad, y te conecta con personas que comparten tu pasión por los animales. Tu ayuda no solo cambia vidas de nuestros animales, sino que también deja una huella positiva en la comunidad y en tu propio corazón.
                    </p>
                </motion.div>
            </section>

            {/*5. Newsletter*/}
            <section className="w-full py-20 bg-teal-500 text-white flex flex-col items-center text-center">
                <h2 className="text-4xl font-extrabold mb-4">{t("Suscríbete a nuestro boletín")}</h2>
                <p className="mb-8 max-w-2xl">{t("Recibe noticias, consejos y novedades sobre nuestras mascotas y eventos.")}</p>
                <form className="flex flex-col sm:flex-row gap-4 w-full max-w-xl px-6" onSubmit={handleSuscribirse}>
                    <input
                        type="email"
                        placeholder={t("Ingresa tu correo")}
                        value={emailSuscripcion}
                        onChange={(e) => setEmailSuscripcion(e.target.value)}
                        className="flex-1 p-4 rounded-lg border-2 border-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-white"
                    />
                    <button type="submit" className="bg-orange-500 hover:bg-orange-600 px-6 py-4 rounded-lg font-bold transition-colors">
                        {t("Suscribirse")}
                    </button>
                </form>
            </section>

            {/* --- */}

            <footer className="w-full bg-gray-900 text-gray-200 py-16">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-4">Huellitas</h3>
                        <p className="text-gray-400">
                            {t("Brindando amor y un hogar para cada mascota que lo necesita.")}
                        </p>
                        <div className="flex items-center gap-4 mt-6">
                            <a href="https://www.facebook.com/p/Huellitas-SOS-La-Paz-100064678990800/?locale=es_LA" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                                <FaFacebookF />
                            </a>

                            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                                <FaInstagram />
                            </a>

                            <a href="https://www.tiktok.com/discover/huellitas-la-paz" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                                <FaTiktok />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xl font-bold text-white mb-4">{t("Enlaces Rápidos")}</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-white">{t("Inicio")}</a></li>
                            <li><a href="#" className="hover:text-white">{t("Adopciones")}</a></li>
                            <li><a href="#" className="hover:text-white">{t("Blog")}</a></li>
                            <li><a href="#" className="hover:text-white">{t("Contacto")}</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-white mb-4">{t("Contacto")}</h4>
                        <p className="flex items-center gap-2"><FaMapMarkerAlt /> {t(direccion)}</p>
                        <p className="flex items-center gap-2"><FaPhone /> +591 700-000-000</p>
                        <p className="flex items-center gap-2"><FaEnvelope /> info@huellitas.com</p>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-white mb-4">{t("Nuestra Ubicación")}</h4>
                        <iframe
                            src={`https://www.google.com/maps?q=${latitud},${longitud}&hl=es;z=14&output=embed`}
                            width="100%"
                            height="200"
                            className="rounded-lg"
                            loading="lazy"
                        />
                    </div>
                </div>
                <div className="mt-12 text-center text-gray-500">
                    © {new Date().getFullYear()} Huellitas. {t("Todos los derechos reservados.")}
                </div>
            </footer>
        </div>
    );
};

export default InicioContenido;