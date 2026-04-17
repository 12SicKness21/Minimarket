import { useState, useEffect } from 'react';
import { useCarrito } from '../../shared/hooks/useCarrito';
import { obtenerConfigTienda, estaDentroDeHorario } from '../../firebase/config-tienda';
import { generarMensajeWhatsApp, abrirWhatsApp } from '../../shared/utils/whatsapp';
import { guardarUltimoPedido, cargarUltimoPedido } from '../../shared/hooks/useUltimoPedido';
import { formatPrecio } from '../../shared/utils/formatters';
import SelectorEnvio from './SelectorEnvio';

const METODOS_PAGO = [
  { id: 'efectivo', label: '💵 Efectivo' },
  { id: 'transferencia', label: '🏦 Transferencia' },
  { id: 'bizum', label: '📱 Bizum' },
];

export default function CarritoDrawer({ abierto, onCerrar }) {
  const { items, actualizarCantidad, quitarItem, subtotal, vaciarCarrito, cargarItems } = useCarrito();
  const [tipoEnvio, setTipoEnvio] = useState('recogida');
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [pagaraCon, setPagaraCon] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [config, setConfig] = useState(null);
  const [horario, setHorario] = useState({ abierto: true, mensaje: '' });

  useEffect(() => {
    obtenerConfigTienda().then((cfg) => {
      setConfig(cfg);
      setHorario(estaDentroDeHorario(cfg));
    });
  }, []);

  // Resetear "pagará con" al cambiar método de pago
  useEffect(() => {
    if (metodoPago !== 'efectivo') setPagaraCon('');
  }, [metodoPago]);

  const costoEnvio = config
    ? tipoEnvio === 'barrio' ? config.costoEnvioBarrio
    : tipoEnvio === 'fuera' ? config.costoEnvioFuera
    : 0 : 0;

  const total = subtotal + costoEnvio;

  // Cambio a devolver (solo efectivo)
  const pagaraNum = parseFloat(pagaraCon.replace(',', '.')) || 0;
  const cambio = metodoPago === 'efectivo' && pagaraNum >= total ? pagaraNum - total : null;

  function enviarPedido() {
    const mensaje = generarMensajeWhatsApp({
      items, subtotal, costoEnvio, total, tipoEnvio, metodoPago, direccion, telefono,
      pagaraCon: metodoPago === 'efectivo' && pagaraCon ? pagaraNum : null,
      cambio,
    });
    guardarUltimoPedido(items);
    abrirWhatsApp(mensaje, config?.whatsapp);
    vaciarCarrito();
    onCerrar();
  }

  function cargarAnterior() {
    const anterior = cargarUltimoPedido();
    if (anterior) cargarItems(anterior);
  }

  return (
    <>
      {abierto && <div className="fixed inset-0 bg-black/30 z-40" onClick={onCerrar} />}

      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 ${abierto ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="font-display font-bold text-lg">Tu carrito</h2>
            <button onClick={onCerrar} className="p-1 hover:bg-gray-100 rounded-full transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Contenido scrollable */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">🛒</p>
                <p className="text-gray-500">Tu carrito está vacío</p>
                <button onClick={cargarAnterior} className="mt-4 text-sm text-primario font-semibold hover:underline">
                  Cargar último pedido
                </button>
              </div>
            ) : (
              <>
                {/* Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.productoId} className="flex gap-3 items-center">
                      <div className="w-14 h-14 rounded-xl bg-gray-50 shrink-0 overflow-hidden">
                        {item.imagenUrl
                          ? <img src={item.imagenUrl} alt={item.nombre} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-xl text-gray-300">📦</div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{item.nombre}</p>
                        <p className="text-sm text-primario font-semibold">{formatPrecio(item.precioUnitario)}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => actualizarCantidad(item.productoId, item.cantidad - 1)}
                          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm font-bold transition">−</button>
                        <span className="w-6 text-center text-sm font-semibold">{item.cantidad}</span>
                        <button onClick={() => actualizarCantidad(item.productoId, item.cantidad + 1)}
                          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm font-bold transition">+</button>
                      </div>
                      <button onClick={() => quitarItem(item.productoId)} className="text-gray-400 hover:text-red-500 transition">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

                <button onClick={cargarAnterior} className="text-sm text-primario font-semibold hover:underline">
                  Cargar último pedido
                </button>

                <hr />

                {/* Envío */}
                {config && (
                  <SelectorEnvio tipoEnvio={tipoEnvio} onChange={setTipoEnvio}
                    costoBarrio={config.costoEnvioBarrio} costoFuera={config.costoEnvioFuera} />
                )}

                {/* Dirección */}
                {tipoEnvio !== 'recogida' && (
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Dirección de entrega</label>
                    <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)}
                      placeholder="Tu dirección..."
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario" />
                  </div>
                )}

                {/* Teléfono */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Teléfono</label>
                  <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)}
                    placeholder="Tu teléfono..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario" />
                </div>

                {/* Método de pago */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Método de pago</label>
                  <div className="flex gap-2">
                    {METODOS_PAGO.map((m) => (
                      <button key={m.id} onClick={() => setMetodoPago(m.id)}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium transition border ${
                          metodoPago === m.id
                            ? 'border-primario bg-green-50 text-primario'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}>
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Pagará con (solo efectivo) ── */}
                {metodoPago === 'efectivo' && (
                  <div className="bg-gray-50 rounded-2xl p-3 space-y-2">
                    <label className="text-sm font-semibold text-gray-700 block">
                      ¿Con cuánto pagarás? <span className="text-gray-400 font-normal">(opcional)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={pagaraCon}
                        onChange={(e) => setPagaraCon(e.target.value)}
                        placeholder={`Mín. ${formatPrecio(total)}`}
                        className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario bg-white"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">€</span>
                    </div>

                    {/* Cambio a devolver */}
                    {cambio !== null && (
                      <div className="flex items-center justify-between bg-green-50 border border-green-100 rounded-xl px-3 py-2">
                        <span className="text-sm text-green-700 font-medium">Cambio a devolver</span>
                        <span className="font-display font-bold text-green-700">{formatPrecio(cambio)}</span>
                      </div>
                    )}

                    {/* Aviso si el importe es insuficiente */}
                    {pagaraCon && pagaraNum < total && (
                      <p className="text-xs text-red-500 font-medium px-1">
                        El importe es menor que el total ({formatPrecio(total)})
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t px-4 py-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">{formatPrecio(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Envío</span>
                <span className="font-medium">{costoEnvio === 0 ? 'Gratis' : formatPrecio(costoEnvio)}</span>
              </div>
              <div className="flex justify-between font-display font-bold text-lg">
                <span>Total</span>
                <span className="text-primario">{formatPrecio(total)}</span>
              </div>

              {horario.abierto ? (
                <button onClick={enviarPedido} disabled={items.length === 0}
                  className="w-full bg-primario hover:bg-green-700 text-white font-bold py-3 rounded-full transition disabled:opacity-50">
                  Enviar pedido por WhatsApp
                </button>
              ) : (
                <div className="w-full bg-gray-100 text-gray-500 font-medium py-3 rounded-full text-center text-sm px-4">
                  {horario.mensaje}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
