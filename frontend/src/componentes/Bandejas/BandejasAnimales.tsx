import React, { useState } from "react";
import { FaPen, FaPlus, FaSearch } from "react-icons/fa";
import type { Animal, Usuario } from "../../types/types";

interface BandejaAnimalesProps {
  animales: Animal[];
  usuarioLogueado: Usuario | null;
  onEdit: (animal: Animal) => void;
  onAdd: () => void;
  onToggle: (
    animal: Animal,
    nuevoEstado: "Disponible" | "Adoptado" | "En cuidado"
  ) => void;
  itemsPorPagina?: number;
}

const API_URL = import.meta.env.VITE_API_URL;

const BandejaAnimales: React.FC<BandejaAnimalesProps> = ({
  animales,
  usuarioLogueado,
  onEdit,
  onAdd,
  onToggle,
  itemsPorPagina = 5,
}) => {
  const esAdministrador =
    usuarioLogueado?.rol?.toLowerCase() === "administrador";
  const [buscar, setBuscar] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  const animalesFiltrados = [...animales].filter((a) => {
    const coincide =
      (a.nombre ?? "").toLowerCase().includes(buscar.toLowerCase()) ||
      (a.especie ?? "").toLowerCase().includes(buscar.toLowerCase()) ||
      (a.raza ?? "").toLowerCase().includes(buscar.toLowerCase());
    const visible = esAdministrador || a.estado_animal !== "Adoptado";
    return coincide && visible;
  });

  const totalPaginas = Math.ceil(
    animalesFiltrados.length / itemsPorPagina
  );
  const inicio = (paginaActual - 1) * itemsPorPagina;
  const animalesPagina = animalesFiltrados.slice(
    inicio,
    inicio + itemsPorPagina
  );

  const coloresEstado: Record<string, string> = {
    Disponible: "#276749",
    Adoptado: "#dd6b20",
    "En cuidado": "#c53030",
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        {/* BUSCADOR */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl border border-cyan-500 text-gray-800 hover:bg-white transition w-full md:w-auto">
          <FaSearch className="text-cyan-400" />
          <input
            type="text"
            placeholder="Buscar animales..."
            value={buscar}
            onChange={(e) => {
              setBuscar(e.target.value);
              setPaginaActual(1);
            }}
            className="outline-none bg-transparent placeholder-gray-400 w-full text-gray-800 font-medium"
          />
        </div>

        {esAdministrador && (
          <button
            onClick={() => {
              onAdd();
              setPaginaActual(totalPaginas);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-cyan-400 text-cyan-400 font-semibold hover:bg-cyan-400 hover:text-white transition"
          >
            <FaPlus /> Agregar
          </button>
        )}
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto rounded-2xl border border-gray-300">
        <table className="min-w-full border-collapse text-base">
          <thead className="bg-cyan-200 sticky top-0">
            <tr>
              <th className="px-2 py-1 text-center border-b border-gray-300">Foto</th>
              <th className="px-2 py-1 text-center border-b border-gray-300">Nombre</th>
              <th className="px-2 py-1 text-center border-b border-gray-300">Especie</th>
              <th className="px-2 py-1 text-center border-b border-gray-300">Raza</th>
              <th className="px-2 py-1 text-center border-b border-gray-300">Sexo</th>
              <th className="px-2 py-1 text-center border-b border-gray-300">Edad</th>
              <th className="px-2 py-1 text-center border-b border-gray-300">Descripción</th>
              <th className="px-2 py-1 text-center border-b border-gray-300">Tamaño</th>
              <th className="px-2 py-1 text-center border-b border-gray-300">Peso</th>
              <th className="px-2 py-1 text-center border-b border-gray-300">Vacunado</th>
              <th className="px-2 py-1 text-center border-b border-gray-300">Esterilizado</th>
              <th className="px-2 py-1 text-center border-b border-gray-300">Estado</th>
              {esAdministrador && (
                <th className="px-4 py-2 text-center border-b border-gray-300">
                  Acciones
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {animalesPagina.map((animal, index) => (
              <tr
                key={animal.id}
                className={`transition hover:bg-cyan-50 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-2 py-2 text-center">
                  {animal.foto ? (
                    <img
                      src={
                        animal.foto.startsWith("http")
                          ? animal.foto
                          : `${API_URL}/${animal.foto}`
                      }
                      alt={animal.nombre || "Foto"}
                      className="w-16 h-16 object-cover rounded-xl mx-auto"
                    />
                  ) : (
                    "—"
                  )}
                </td>

                <td className="px-2 py-2 text-center font-medium">
                  {animal.nombre || "—"}
                </td>
                <td className="px-2 py-2 text-center">{animal.especie || "—"}</td>
                <td className="px-2 py-2 text-center">{animal.raza || "—"}</td>
                <td className="px-2 py-2 text-center">{animal.sexo || "—"}</td>
                <td className="px-2 py-2 text-center">{animal.edad ?? "—"}</td>
                <td className="px-2 py-2 text-center">{animal.descripcion || "—"}</td>
                <td className="px-2 py-2 text-center">{animal.tamano || "—"}</td>
                <td className="px-2 py-2 text-center">{animal.peso ?? "—"} kg</td>
                <td className="px-2 py-2 text-center">{animal.vacunado ? "Sí" : "No"}</td>
                <td className="px-2 py-2 text-center">{animal.esterilizado ? "Sí" : "No"}</td>

                <td
                  className="px-2 py-2 text-center font-bold"
                  style={{
                    color:
                      coloresEstado[
                        animal.estado_animal || "Disponible"
                      ],
                  }}
                >
                  {animal.estado_animal}
                </td>

                {esAdministrador && (
                  <td className="px-4 py-2 text-center flex justify-center gap-2">
                    <FaPen
                      className="cursor-pointer text-cyan-500 hover:text-cyan-700 transition text-lg"
                      onClick={() => onEdit(animal)}
                    />

                    <button
                      className="px-2 py-1 rounded-xl bg-gray-200 hover:bg-gray-300 text-sm font-semibold"
                      onClick={() => {
                        const siguienteEstado =
                          animal.estado_animal === "Disponible"
                            ? "En cuidado"
                            : animal.estado_animal === "En cuidado"
                            ? "Adoptado"
                            : "Disponible";
                        onToggle(
                          animal,
                          siguienteEstado as
                            | "Disponible"
                            | "Adoptado"
                            | "En cuidado"
                        );
                      }}
                    >
                      {animal.estado_animal}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pag..... */}
      <div className="flex justify-center items-center gap-2 mt-4 flex-wrap text-white">
        <button
          disabled={paginaActual === 1}
          onClick={() => setPaginaActual(paginaActual - 1)}
          className="px-3 py-2 rounded-xl border border-white-200 hover:bg-white-100 disabled:opacity-50 text-white"
        >
          Anterior
        </button>

        {[...Array(totalPaginas)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPaginaActual(i + 1)}
            className={`px-4 py-2 rounded-xl border border-cyan-500 text-white ${
              paginaActual === i + 1
                ? "bg-cyan-600 border-cyan-400"
                : "hover:bg-cyan-500"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={paginaActual === totalPaginas}
          onClick={() => setPaginaActual(paginaActual + 1)}
          className="px-3 py-2 rounded-xl border border-cyan-500 hover:bg-cyan-500 disabled:opacity-50 text-white"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default BandejaAnimales;