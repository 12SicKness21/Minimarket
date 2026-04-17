import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { obtenerCatalogos, guardarCatalogos } from '../../firebase/catalogos';

const CatalogosContext = createContext(null);

export function CatalogosProvider({ children }) {
  const [categorias, setCategorias] = useState([]);
  const [paises, setPaises] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerCatalogos().then(({ categorias, paises }) => {
      setCategorias(categorias);
      setPaises(paises);
      setCargando(false);
    });
  }, []);

  const actualizarCategorias = useCallback(async (nuevas) => {
    setCategorias(nuevas);
    await guardarCatalogos({ categorias: nuevas, paises });
  }, [paises]);

  const actualizarPaises = useCallback(async (nuevos) => {
    setPaises(nuevos);
    await guardarCatalogos({ categorias, paises: nuevos });
  }, [categorias]);

  return (
    <CatalogosContext.Provider value={{ categorias, paises, cargando, actualizarCategorias, actualizarPaises }}>
      {children}
    </CatalogosContext.Provider>
  );
}

export function useCatalogos() {
  const ctx = useContext(CatalogosContext);
  if (!ctx) throw new Error('useCatalogos debe usarse dentro de CatalogosProvider');
  return ctx;
}
