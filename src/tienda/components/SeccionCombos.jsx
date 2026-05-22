import { useCarrito } from '../../shared/hooks/useCarrito';
import { useAutoScroll } from '../../shared/hooks/useAutoScroll';
import { formatPrecio } from '../../shared/utils/formatters';

export default function SeccionCombos({ combos = [], productos = [] }) {
  const { agregarCombo } = useCarrito();
  const scrollRef = useAutoScroll(0.5);

  if (combos.length === 0) return null;

  // Duplicar para loop infinito sin salto visible
  const items = [...combos, ...combos];

  return (
    <section className="mb-8">
      <h2 className="font-display font-bold text-xl text-gray-800 mb-3">
        Combos
      </h2>

      {/* overflow-x-auto: permite scroll táctil manual + auto-scroll por RAF */}
      <div ref={scrollRef} className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
        {items.map((combo, i) => (
          <div
            key={`${combo.id}-${i}`}
            className="min-w-[220px] max-w-[220px] shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
          >
            {/* Cabecera: imagen o gradiente con nombre */}
            <div className="aspect-video overflow-hidden bg-gradient-to-br from-green-400 to-primario flex items-center justify-center">
              {combo.imagenUrl
                ? <img src={combo.imagenUrl} alt={combo.nombre} className="w-full h-full object-cover" loading="lazy" />
                : <span className="font-display font-black text-xl text-white drop-shadow-lg leading-tight tracking-wide text-center px-3">{combo.nombre}</span>
              }
            </div>

            {/* Cuerpo */}
            <div className="p-3 flex flex-col flex-1">
              <h3 className="font-display font-bold text-sm text-gray-800 leading-tight mb-1 line-clamp-1">
                {combo.nombre}
              </h3>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2 flex-1">{combo.descripcion}</p>

              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-col">
                  <span className="font-display font-bold text-base text-primario">
                    {formatPrecio(combo.precioTotal)}
                  </span>
                  {combo.descuento > 0 && (
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded w-fit border border-green-100 leading-tight">
                      -{formatPrecio(combo.descuento)}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => agregarCombo(combo)}
                  className="bg-primario hover:bg-green-700 active:scale-95 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition shrink-0"
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
