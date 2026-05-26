import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cargarHistorial, limpiarHistorial } from '../../shared/hooks/useUltimoPedido';
import { useCarrito } from '../../shared/hooks/useCarrito';
import { formatPrecio } from '../../shared/utils/formatters';

function formatFecha(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
    + ' · ' + d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

export default function HistorialPedidos({ onCerrar }) {
  const [pedidos, setPedidos] = useState([]);
  const [expandido, setExpandido] = useState(null);
  const [confirmLimpiar, setConfirmLimpiar] = useState(false);
  const { cargarItems } = useCarrito();

  useEffect(() => {
    setPedidos(cargarHistorial());
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onCerrar(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [onCerrar]);

  function repetirPedido(items) {
    cargarItems(items);
    onCerrar();
  }

  function handleLimpiar() {
    limpiarHistorial();
    setPedidos([]);
    setConfirmLimpiar(false);
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 flex items-center justify-between px-5 py-4 shrink-0">
        <h2 className="font-display font-bold text-lg text-gray-800">Historial de pedidos</h2>
        <button
          onClick={onCerrar}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">

        {pedidos.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-5xl mb-4">🧾</p>
            <p className="text-gray-500 font-medium">Aún no tienes pedidos guardados</p>
            <p className="text-gray-400 text-sm mt-1">Tus próximos pedidos aparecerán aquí</p>
          </div>
        )}

        {pedidos.map((pedido) => (
          <div key={pedido.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">

            {/* Cabecera del pedido */}
            <button
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition"
              onClick={() => setExpandido(expandido === pedido.id ? null : pedido.id)}
            >
              <div className="text-left">
                <p className="text-xs text-gray-400">{formatFecha(pedido.fecha)}</p>
                <p className="text-sm font-semibold text-gray-700 mt-0.5">
                  {pedido.items.length} {pedido.items.length === 1 ? 'producto' : 'productos'}
                  <span className="mx-1.5 text-gray-300">·</span>
                  <span className="text-primario">{formatPrecio(pedido.total)}</span>
                </p>
              </div>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${expandido === pedido.id ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Detalle expandido */}
            {expandido === pedido.id && (
              <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-3">

                {/* Lista de items */}
                <div className="space-y-2">
                  {pedido.items.map((item) => (
                    <div key={item.productoId} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 shrink-0 overflow-hidden">
                        {item.imagenUrl
                          ? <img src={item.imagenUrl} alt={item.nombre} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-lg text-gray-300">📦</div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          {item.esCombo && (
                            <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-100 px-1.5 py-0.5 rounded-full leading-none shrink-0">
                              Combo
                            </span>
                          )}
                          <p className="text-sm text-gray-700 truncate">{item.nombre}</p>
                        </div>
                        <p className="text-xs text-gray-400">
                          {item.cantidad} × {formatPrecio(item.precioUnitario)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-gray-700 shrink-0">
                        {formatPrecio(item.precioUnitario * item.cantidad)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Total + botón repetir */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-sm font-bold text-gray-800">Total {formatPrecio(pedido.total)}</span>
                  <button
                    onClick={() => repetirPedido(pedido.items)}
                    className="bg-primario hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition"
                  >
                    Volver a pedir
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer — limpiar historial */}
      {pedidos.length > 0 && (
        <div className="bg-white border-t border-gray-100 px-5 py-3 shrink-0">
          {confirmLimpiar ? (
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-gray-600">¿Borrar todo el historial?</p>
              <div className="flex gap-2">
                <button onClick={() => setConfirmLimpiar(false)} className="text-sm text-gray-500 px-3 py-1.5 rounded-full hover:bg-gray-100 transition">
                  Cancelar
                </button>
                <button onClick={handleLimpiar} className="text-sm text-red-600 font-semibold px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 transition">
                  Borrar
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setConfirmLimpiar(true)}
              className="text-xs text-gray-400 hover:text-red-500 transition font-medium"
            >
              Limpiar historial
            </button>
          )}
        </div>
      )}
    </div>,
    document.body
  );
}
