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

  // Duplicar para loop infinito continuo
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

        {/* Zona de desplazamiento */}
        <div className="flex-1 overflow-hidden relative flex items-center">
          <div
            className="flex items-center h-full"
            style={{
              width: 'max-content',
              animation: 'marquee 20s linear infinite',
              willChange: 'transform',
            }}
          >
            {items.map((logo, i) => (
              <div
                key={i}
                className="shrink-0 flex items-center justify-center"
                style={{ marginLeft: 16, marginRight: 16 }}
              >
                <img
                  src={logo.logoUrl}
                  alt={logo.nombre}
                  loading="lazy"
                  className="h-7 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
