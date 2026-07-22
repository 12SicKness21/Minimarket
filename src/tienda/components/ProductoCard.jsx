import { useState } from 'react';
import { useCarrito } from '../../shared/hooks/useCarrito';
import { useCatalogos } from '../../shared/hooks/useCatalogos';
import { formatPrecio } from '../../shared/utils/formatters';
import BanderaPais from '../../shared/components/BanderaPais';

export default function ProductoCard({ producto }) {
  const { agregarItem } = useCarrito();
  const { paises } = useCatalogos();
  const [animando, setAnimando] = useState(false);
  const [volteada, setVolteada] = useState(false);

  function handleAnadir(e) {
    e.stopPropagation();
    agregarItem(producto);
    setAnimando(true);
    setTimeout(() => setAnimando(false), 600);

    // Dispara el toast global
    window.dispatchEvent(
      new CustomEvent('carrito:anadido', { detail: { nombre: producto.nombre } })
    );
  }

  function voltear() {
    setVolteada((v) => !v);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      voltear();
    }
  }

  const paisesProducto = (producto.paises || [])
    .map((id) => paises.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <div className="h-full" style={{ perspective: 1200 }}>
      <div
        role="button"
        tabIndex={0}
        aria-label={volteada ? `Ver frente de ${producto.nombre}` : `Ver detalles de ${producto.nombre}`}
        onClick={voltear}
        onKeyDown={handleKeyDown}
        className="product-flip-inner relative w-full h-full cursor-pointer"
        style={{
          transformStyle: 'preserve-3d',
          transform: volteada ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* ── Cara frontal ── */}
        <div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group flex flex-col h-full"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Imagen */}
          <div className="aspect-square bg-gray-50 relative overflow-hidden">
            <img
              src={producto.imagenUrl || '/icon.png'}
              alt={producto.nombre}
              className={producto.imagenUrl
                ? 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                : 'w-full h-full object-contain p-8 opacity-40'}
              loading="lazy"
            />
            {producto.recienLlegado && (
              <span className="absolute top-2 left-2 bg-secundario text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                Nuevo
              </span>
            )}
            {/* Indicador de "más info" — visible siempre (no solo en hover) para que también se note en móvil */}
            <span className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-black/40 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>

          {/* Info */}
          <div className="p-3 flex flex-col flex-1">
            {paisesProducto.length > 0 && (
              <div className="flex items-center gap-1 mb-1.5 flex-wrap">
                {paisesProducto.map((p) => (
                  <BanderaPais key={p.id} pais={p} className="w-5 h-3.5 rounded-sm" />
                ))}
              </div>
            )}

            <h3 className="font-semibold text-sm text-gray-800 leading-tight line-clamp-2 mb-2 flex-1">
              {producto.nombre}
            </h3>

            <div className="flex items-center justify-between gap-2 mt-auto">
              <span className="font-display font-bold text-base text-primario shrink-0">
                {formatPrecio(producto.precio)}
              </span>
              <button
                onClick={handleAnadir}
                className={`flex-1 min-h-[36px] flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-200 ${
                  animando
                    ? 'bg-green-600 scale-95 text-white'
                    : 'bg-primario hover:bg-green-700 text-white active:scale-95'
                }`}
              >
                {animando ? '✓' : 'Añadir'}
              </button>
            </div>
          </div>
        </div>

        {/* ── Cara trasera ── */}
        <div
          className="absolute inset-0 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col p-3.5"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setVolteada(false); }}
            aria-label="Cerrar detalles"
            className="absolute top-2 right-2 w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition z-10"
          >
            ✕
          </button>

          <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 overflow-y-auto py-4">
            <h3 className="font-bold text-lg text-gray-800 leading-snug">
              {producto.nombre}
            </h3>

            {paisesProducto.length > 0 && (
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {paisesProducto.map((p) => (
                  <BanderaPais key={p.id} pais={p} className="w-9 h-6 rounded shadow-sm" />
                ))}
              </div>
            )}

            <p className="text-sm text-gray-500 leading-relaxed">
              {producto.descripcion || 'Sin descripción disponible.'}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-gray-100">
            <span className="font-display font-bold text-base text-primario shrink-0">
              {formatPrecio(producto.precio)}
            </span>
            <button
              onClick={handleAnadir}
              className={`flex-1 min-h-[36px] flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-200 ${
                animando
                  ? 'bg-green-600 scale-95 text-white'
                  : 'bg-primario hover:bg-green-700 text-white active:scale-95'
              }`}
            >
              {animando ? '✓' : 'Añadir'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
