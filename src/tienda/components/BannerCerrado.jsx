import { useEffect, useState } from 'react';
import { obtenerConfigTienda, estaDentroDeHorario } from '../../firebase/config-tienda';

export default function BannerCerrado() {
  const [estado, setEstado] = useState(null); // null = cargando

  useEffect(() => {
    obtenerConfigTienda().then((cfg) => {
      setEstado(estaDentroDeHorario(cfg));
    });

    // Re-evaluar cada minuto por si cambia el estado de abierto/cerrado
    const intervalo = setInterval(() => {
      obtenerConfigTienda().then((cfg) => {
        setEstado(estaDentroDeHorario(cfg));
      });
    }, 60_000);

    return () => clearInterval(intervalo);
  }, []);

  // No mostrar nada si está abierto o cargando
  if (!estado || estado.abierto) return null;

  return (
    <div className="sticky top-16 z-40 bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center justify-center gap-2 text-sm text-amber-800">
      <span className="text-base shrink-0">🔒</span>
      <p className="font-medium text-center leading-snug">{estado.mensaje}</p>
    </div>
  );
}
