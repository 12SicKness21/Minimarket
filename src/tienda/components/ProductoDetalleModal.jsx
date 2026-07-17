import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { formatPrecio } from '../../shared/utils/formatters';
import { useCatalogos } from '../../shared/hooks/useCatalogos';
import BanderaPais from '../../shared/components/BanderaPais';

export default function ProductoDetalleModal({ producto, onCerrar, onAgregar }) {
  const { paises } = useCatalogos();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onCerrar(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [onCerrar]);

  const paisesProducto = (producto.paises || [])
    .map((id) => paises.find((p) => p.id === id))
    .filter(Boolean);

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 z-[100] flex items-end sm:items-center justify-center"
      onClick={onCerrar}
    >
      <div
        className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[92dvh] sm:max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Imagen grande */}
        <div className="relative aspect-square bg-gray-50">
          <img
            src={producto.imagenUrl || '/icon.png'}
            alt={producto.nombre}
            className={producto.imagenUrl ? 'w-full h-full object-cover' : 'w-full h-full object-contain p-12 opacity-40'}
          />
          {producto.recienLlegado && (
            <span className="absolute top-3 left-3 bg-secundario text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
              Nuevo
            </span>
          )}
          <button
            onClick={onCerrar}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm transition"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Info completa */}
        <div className="p-5 space-y-3">
          {paisesProducto.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {paisesProducto.map((p) => (
                <BanderaPais key={p.id} pais={p} className="w-6 h-8 rounded" />
              ))}
            </div>
          )}

          <h2 className="font-display font-bold text-xl text-gray-800 leading-snug">
            {producto.nombre}
          </h2>

          {producto.descripcion && (
            <p className="text-sm text-gray-500 leading-relaxed">
              {producto.descripcion}
            </p>
          )}

          <div className="flex items-center justify-between pt-2">
            <span className="font-display font-black text-2xl text-primario">
              {formatPrecio(producto.precio)}
            </span>
          </div>

          <button
            onClick={() => { onAgregar(); onCerrar(); }}
            className="w-full bg-primario hover:bg-green-700 text-white font-bold py-3 rounded-full transition active:scale-95"
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
