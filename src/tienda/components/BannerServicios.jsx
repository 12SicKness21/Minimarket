import { useState, useEffect } from 'react';
import { obtenerServicios } from '../../firebase/config-tienda';

export default function BannerServicios() {
  const [logos, setLogos] = useState([]);

  useEffect(() => {
    obtenerServicios().then((items) => {
      setLogos(items.filter((s) => s.activo !== false));
    });
  }, []);

  if (logos.length === 0) return null;

  // Duplicar para loop continuo sin saltos
  const items = [...logos, ...logos];

  return (
    <section className="mb-6 bg-white border border-gray-100 rounded-2xl overflow-hidden flex items-stretch">
      {/* Etiqueta estática izquierda */}
      <div className="shrink-0 px-3 border-r border-gray-100 flex items-center justify-center bg-white">
        <span
          className="font-bold text-gray-500 uppercase leading-tight text-center"
          style={{ fontSize: '9px', letterSpacing: '0.05em' }}
        >
          Otros<br />Servicios
        </span>
      </div>

      {/* Zona de desplazamiento */}
      <div className="flex-1 overflow-hidden relative" style={{ height: 52 }}>
        <div
          className="absolute inset-y-0 left-0 flex items-center w-max"
          style={{
            animation: 'marquee 22s linear infinite',
            willChange: 'transform',
          }}
        >
          {items.map((logo, i) => (
            <div
              key={i}
              className="shrink-0 flex items-center justify-center"
              style={{ paddingLeft: 18, paddingRight: 18 }}
            >
              <img
                src={logo.logoUrl}
                alt={logo.nombre}
                loading="lazy"
                style={{ height: 28, width: 'auto', objectFit: 'contain', display: 'block' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
