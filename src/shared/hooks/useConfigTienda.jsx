import { createContext, useContext, useState, useEffect } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { DOC_REF, DEFAULTS } from '../../firebase/config-tienda';

const ConfigTiendaContext = createContext(null);

export function ConfigTiendaProvider({ children }) {
  const [config, setConfig] = useState(DEFAULTS);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(DOC_REF, (snap) => {
      setConfig(snap.exists() ? { ...DEFAULTS, ...snap.data() } : DEFAULTS);
      setCargando(false);
    });
    return () => unsub();
  }, []);

  return (
    <ConfigTiendaContext.Provider value={{ config, cargando }}>
      {children}
    </ConfigTiendaContext.Provider>
  );
}

export function useConfigTienda() {
  const ctx = useContext(ConfigTiendaContext);
  if (!ctx) throw new Error('useConfigTienda debe usarse dentro de ConfigTiendaProvider');
  return ctx;
}
