import { useEffect, useState } from 'react';
import { estaDentroDeHorario } from '../../firebase/config-tienda';
import { useConfigTienda } from '../../shared/hooks/useConfigTienda';

export default function BannerCerrado() {
  const { config } = useConfigTienda();
  const [, forzarActualizacion] = useState(0);

  // Re-evaluar cada minuto por si cambia el estado de abierto/cerrado por el reloj
  useEffect(() => {
    const intervalo = setInterval(() => forzarActualizacion((n) => n + 1), 60_000);
    return () => clearInterval(intervalo);
  }, []);

  const estado = estaDentroDeHorario(config);

  if (estado.abierto) return null;

  return (
    <div className="sticky top-16 z-40 bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center justify-center gap-2 text-sm text-amber-800">
      <span className="text-base shrink-0">🔒</span>
      <p className="font-medium text-center leading-snug">{estado.mensaje}</p>
    </div>
  );
}
