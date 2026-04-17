import { useCarrito } from '../../shared/hooks/useCarrito';
import { formatPrecio } from '../../shared/utils/formatters';

export default function BannerRecienLlegado({ productos = [] }) {
  const { agregarItem } = useCarrito();

  function handleAnadir(p) {
    agregarItem(p);
    window.dispatchEvent(
      new CustomEvent('carrito:anadido', { detail: { nombre: p.nombre } })
    );
  }

  if (productos.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="font-display font-bold text-xl text-gray-800 mb-3">
        ✨ Recién Llegados
      </h2>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x pb-2">
        {productos.map((p) => (
          <div
            key={p.id}
            className="min-w-[160px] max-w-[160px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden shrink-0 snap-start flex flex-col"
          >
            <div className="aspect-square bg-gray-50 relative">
              {p.imagenUrl ? (
                <img src={p.imagenUrl} alt={p.nombre} className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl text-gray-200">📦</div>
              )}
              <span className="absolute top-2 left-2 bg-secundario text-white text-xs font-bold px-2 py-0.5 rounded-full">
                Nuevo
              </span>
            </div>
            <div className="p-2.5 flex flex-col flex-1">
              <h3 className="font-semibold text-xs text-gray-800 line-clamp-2 mb-2 flex-1 leading-tight">{p.nombre}</h3>
              <div className="flex items-center justify-between gap-1">
                <span className="font-display font-bold text-sm text-primario">{formatPrecio(p.precio)}</span>
                <button
                  onClick={() => handleAnadir(p)}
                  className="bg-primario text-white text-xs font-semibold px-2.5 py-1.5 rounded-full hover:bg-green-700 active:scale-95 transition"
                >
                  Añadir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
