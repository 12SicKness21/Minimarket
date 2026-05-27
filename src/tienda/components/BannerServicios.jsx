import { useState, useEffect } from 'react';
import { obtenerServicios } from '../../firebase/config-tienda';

export default function BannerServicios() {
  const [logos, setLogos] = useState([]);

  useEffect(() => {
    obtenerServicios().then((items) => {
      setLogos(items.filter((s) => s.activo !== false));
    });
  }, []);

  if (logos.length === 0) return <div style={{ height: 52 }} />;

  // Duplicar para loop continuo sin saltos
  const items = [...logos, ...logos];

  return (
    <>
      {/* Espaciador para que el contenido no quede tapado por la barra fija */}
      <div style={{ height: 52 }} />

      {/* Barra fija en la parte inferior */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-stretch"
        style={{ zIndex: 40, height: 52, paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {/* Etiqueta estática izquierda */}
        <div className="shrink-0 px-3 border-r border-gray-200 flex items-center justify-center bg-white">
          <span
            className="font-bold text-gray-500 uppercase leading-tight text-center"
            style={{ fontSize: '9px', letterSpacing: '0.05em' }}
          >
            Otros<br />Servicios
          </span>
        </div>

        {/* Zona de desplazamiento — overflow hidden clipa visualmente pero no restringe el ancho del hijo */}
        <div className="flex-1 overflow-hidden relative">
          {/*
            position:absolute saca el div del flujo flex → no queda limitado
            por el ancho del padre. translateX(-50%) = -50% de su propio ancho
            = exactamente el ancho de los 14 logos (una copia) → loop perfecto.
          */}
          <div
            className="absolute inset-y-0 left-0 flex items-center"
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
      </div>
    </>
  );
}
