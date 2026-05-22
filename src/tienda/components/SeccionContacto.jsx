import { useState, useEffect } from 'react';
import { obtenerConfigTienda } from '../../firebase/config-tienda';

const REDES_INFO = {
  instagram: {
    label: 'Instagram',
    bg: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  tiktok: {
    label: 'TikTok',
    bg: 'bg-black',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z"/>
      </svg>
    ),
  },
  facebook: {
    label: 'Facebook',
    bg: 'bg-blue-600',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
};

export default function SeccionContacto() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    obtenerConfigTienda().then(setConfig);
  }, []);

  if (!config) return null;

  const { redes = {}, ubicacion = {} } = config;
  const redesActivas = Object.entries(redes).filter(([, v]) => v.activo && v.url);
  const tieneUbicacion = ubicacion.imagenUrl || ubicacion.direccion;

  if (redesActivas.length === 0 && !tieneUbicacion) return null;

  return (
    <section className="mt-10 mb-6 space-y-6">

      {/* Redes sociales */}
      {redesActivas.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Síguenos en</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {redesActivas.map(([key, val]) => {
              const info = REDES_INFO[key];
              if (!info) return null;
              return (
                <a
                  key={key}
                  href={val.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-semibold text-sm transition hover:opacity-90 active:scale-95 ${info.bg}`}
                >
                  {info.icon}
                  {info.label}
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Ubicación */}
      {tieneUbicacion && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {ubicacion.imagenUrl && (
            <img
              src={ubicacion.imagenUrl}
              alt="Mapa de ubicación"
              className="w-full max-h-56 object-cover"
            />
          )}
          <div className="p-4 space-y-3">
            {ubicacion.direccion && (
              <p className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-base">📍</span>
                <span>{ubicacion.direccion}</span>
              </p>
            )}
            {ubicacion.url && (
              <a
                href={ubicacion.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full bg-primario hover:bg-green-700 text-white font-bold py-2.5 rounded-full text-sm transition active:scale-95"
              >
                CÓMO LLEGAR
              </a>
            )}
          </div>
        </div>
      )}

    </section>
  );
}
