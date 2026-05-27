import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const IMAGENES_LOCAL = [
  '/local/tienda.avif',
  '/local/local 01.avif',
  '/local/local 02.avif',
  '/local/local 03.avif',
  '/local/local 04.avif',
  '/local/local 05.avif',
  '/local/local 06.avif',
  '/local/local 07.avif',
  '/local/local 08.avif',
  '/local/local 09.avif',
];

export default function GaleriaLocal({ onCerrar }) {
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { 
      if (e.key === 'Escape') {
        if (imagenSeleccionada !== null) {
          setImagenSeleccionada(null);
        } else {
          onCerrar();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [onCerrar, imagenSeleccionada]);

  const irAnterior = (e) => {
    e.stopPropagation();
    setImagenSeleccionada((prev) => (prev > 0 ? prev - 1 : IMAGENES_LOCAL.length - 1));
  };

  const irSiguiente = (e) => {
    e.stopPropagation();
    setImagenSeleccionada((prev) => (prev < IMAGENES_LOCAL.length - 1 ? prev + 1 : 0));
  };

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

      {/* Galería: Cuadrícula Uniforme */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {IMAGENES_LOCAL.map((src, i) => (
            <div 
              key={i} 
              className="aspect-square cursor-pointer overflow-hidden rounded-2xl bg-white/5 relative group"
              onClick={() => setImagenSeleccionada(i)}
            >
              <img
                src={src}
                alt={`Local ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
            </div>
          ))}
        </div>

        {IMAGENES_LOCAL.length === 0 && (
          <div className="flex items-center justify-center h-48 text-white/40">
            No hay imágenes disponibles
          </div>
        )}
      </div>

      {/* Lightbox a pantalla completa */}
      {imagenSeleccionada !== null && (
        <div 
          className="fixed inset-0 z-[110] bg-black/95 flex flex-col backdrop-blur-sm"
          onClick={() => setImagenSeleccionada(null)}
        >
          {/* Lightbox Header / Botón cerrar */}
          <div className="absolute top-0 right-0 p-4 z-20">
            <button
              onClick={() => setImagenSeleccionada(null)}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Controles de Navegación Izquierda */}
          <button 
             className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white bg-white/10 hover:bg-white/20 rounded-full transition z-20"
             onClick={irAnterior}
          >
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
             </svg>
          </button>

          {/* Imagen completa */}
          <div className="flex-1 flex items-center justify-center p-4 md:p-12 z-10 relative">
            <img
              src={IMAGENES_LOCAL[imagenSeleccionada]}
              alt={`Imagen ampliada ${imagenSeleccionada + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Para no cerrar al clickear la imagen
            />
          </div>
          
          {/* Controles de Navegación Derecha */}
          <button 
             className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white bg-white/10 hover:bg-white/20 rounded-full transition z-20"
             onClick={irSiguiente}
          >
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
             </svg>
          </button>
          
          {/* Indicador de posición */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium tracking-wide">
            {imagenSeleccionada + 1} / {IMAGENES_LOCAL.length}
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
