import { useCarrito } from '../../shared/hooks/useCarrito';
import { formatPrecio } from '../../shared/utils/formatters';

export default function SeccionCombos({ combos = [], productos = [] }) {
  const { agregarItem } = useCarrito();

  function agregarCombo(combo) {
    for (const item of combo.productos) {
      // Busca el producto en los ya cargados — sin llamadas extra a Firestore
      const producto = productos.find((p) => p.id === item.productoId);
      if (producto && producto.activo && producto.stockActual > 0) {
        agregarItem(producto, item.cantidad);
        window.dispatchEvent(
          new CustomEvent('carrito:anadido', { detail: { nombre: producto.nombre } })
        );
      }
    }
  }

  if (combos.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="font-display font-bold text-2xl text-gray-800 mb-4">
        Combos
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {combos.map((combo) => (
          <div
            key={combo.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
          >
            <div className="aspect-video bg-gradient-to-br from-green-400 to-primario flex items-center justify-center p-6 text-center">
              <span className="font-display font-black text-3xl md:text-4xl text-white drop-shadow-lg leading-tight tracking-wide">
                {combo.nombre}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-display font-bold text-lg text-gray-800 mb-1">{combo.nombre}</h3>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">{combo.descripcion}</p>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-display font-bold text-xl text-primario">
                    {formatPrecio(combo.precioTotal)}
                  </span>
                  {combo.descuento > 0 && (
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded w-fit mt-1 border border-green-100">
                      ¡Ahorras {formatPrecio(combo.descuento)}!
                    </span>
                  )}
                </div>
                <button
                  onClick={() => agregarCombo(combo)}
                  className="bg-primario hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition"
                >
                  Añadir combo
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
