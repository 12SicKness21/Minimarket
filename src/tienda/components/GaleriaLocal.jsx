import { useEffect } from 'react';
import { createPortal } from 'react-dom';

const IMAGENES_LOCAL = [
  '/local/tienda.avif',
];

export default function GaleriaLocal({ onCerrar }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onCerrar(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 shrink-0">
        <h2 className="text-white font-bold text-lg">Imágenes nuestras</h2>
        <button
          onClick={onCerrar}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Galería */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <div className="columns-1 sm:columns-2 md:columns-3 gap-3 space-y-3">
          {IMAGENES_LOCAL.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Local ${i + 1}`}
              className="w-full rounded-2xl object-cover break-inside-avoid"
            />
          ))}
        </div>

        {IMAGENES_LOCAL.length === 0 && (
          <div className="flex items-center justify-center h-48 text-white/40">
            No hay imágenes disponibles
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
