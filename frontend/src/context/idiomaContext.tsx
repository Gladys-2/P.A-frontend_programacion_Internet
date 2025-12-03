import { createContext, useState, useContext, type ReactNode, type FC, useEffect } from "react";
import es from "../locales/es/translation.json";
import en from "../locales/en/translation.json";

type Traducciones = Record<string, string>;
export type Idioma = "es" | "en";

interface IdiomaContextType {
  idioma: Idioma;
  setIdioma: (i: Idioma) => void;
  t: (key: string) => string;
  cambiarIdioma: (i: Idioma) => void;
  modoOscuro: boolean;
  setModoOscuro: (valor: boolean) => void;
}

export const IdiomaContext = createContext<IdiomaContextType>({
  idioma: "es",
  setIdioma: () => {},
  t: (key) => key,
  cambiarIdioma: () => {},
  modoOscuro: false,
  setModoOscuro: () => {},
});

export const IdiomaProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [idioma, setIdioma] = useState<Idioma>("es");
  const [modoOscuro, setModoOscuro] = useState(localStorage.getItem("modo") === "oscuro");

  // Aplicar cambios globales en modo oscuro
  useEffect(() => {
    if (modoOscuro) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("modo", "oscuro");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("modo", "claro");
    }
  }, [modoOscuro]);

  const cambiarIdioma = (nuevoIdioma: Idioma) => {
    setIdioma(nuevoIdioma);
    localStorage.setItem("idioma", nuevoIdioma);
  };

  const t = (key: string): string => {
    const traducciones: Traducciones = idioma === "es" ? es : en;
    return traducciones[key] || key;
  };

  return (
    <IdiomaContext.Provider value={{ idioma, setIdioma, t, cambiarIdioma, modoOscuro, setModoOscuro }}>
      {children}
    </IdiomaContext.Provider>
  );
};

export const useIdioma = (): IdiomaContextType => {
  const context = useContext(IdiomaContext);
  if (!context) throw new Error("useIdioma debe usarse dentro de un IdiomaProvider");
  return context;
};