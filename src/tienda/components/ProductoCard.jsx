import { useState } from 'react';
import { useCarrito } from '../../shared/hooks/useCarrito';
import { formatPrecio } from '../../shared/utils/formatters';
import ProductoDetalleModal from './ProductoDetalleModal';

const BANDERAS_PAIS = {
  venezuela: '🇻🇪',
  colombia: '🇨🇴',
  peru: '🇵🇪',
  ecuador: '🇪🇨',
  mexico: '🇲🇽',
  republica_dominicana: '🇩🇴',
  cuba: '🇨🇺',
  general: '🌎',
};

export default function ProductoCard({ producto }) {
  const { agregarItem } = useCarrito();
  const [animando, setAnimando] = useState(false);
  const [detalleAbierto, setDetalleAbierto] = useState(false);

  function handleAnadir() {
    agregarItem(producto);
    setAnimando(true);
    setTimeout(() => setAnimando(false), 600);

    // Dispara el toast global
    window.dispatchEvent(
      new CustomEvent('carrito:anadido', { detail: { nombre: producto.nombre } })
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group flex flex-col">
      {/* Imagen — toca para ver detalle ampliado */}
      <button
        onClick={() => setDetalleAbierto(true)}
        className="aspect-square bg-gray-50 relative overflow-hidden w-full"
      >
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
        <span className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16zM11 8v6M8 11h6" />
          </svg>
        </span>
      </button>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        {/* Banderas */}
        <div className="flex items-center gap-0.5 mb-1 flex-wrap">
          {producto.paises?.map((p) => {
            const bandera = BANDERAS_PAIS[p];
            if (!bandera) return null;
            return (
              <span key={p} className="text-sm leading-none" title={p}>
                {bandera}
              </span>
            );
          })}
        </div>

        {/* Nombre */}
        <h3 className="font-semibold text-sm text-gray-800 leading-tight line-clamp-2 mb-2 flex-1">
          {producto.nombre}
        </h3>

        {/* Precio + botón */}
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

      {detalleAbierto && (
        <ProductoDetalleModal
          producto={producto}
          onCerrar={() => setDetalleAbierto(false)}
          onAgregar={handleAnadir}
        />
      )}
    </div>
  );
}
