export function generarMensajeWhatsApp({ items, subtotal, costoEnvio, total, tipoEnvio, metodoPago, direccion, telefono, pagaraCon, cambio }) {
  const lineasProductos = items
    .map(item => `🛒 ${item.cantidad}x ${item.nombre} (${(item.precioUnitario * item.cantidad).toFixed(2)}€)`)
    .join('\n');

  const etiquetaEnvio = {
    recogida: '🏪 Recogida en tienda — Gratis',
    barrio: `🚚 Envío en mi barrio — ${costoEnvio.toFixed(2)}€`,
    fuera: `🚚 Envío fuera del barrio — ${costoEnvio.toFixed(2)}€`
  }[tipoEnvio];

  const etiquetaPago = {
    efectivo: '💵 Efectivo',
    transferencia: '🏦 Transferencia bancaria',
    bizum: '📱 Bizum'
  }[metodoPago];

  const lineaDireccion = tipoEnvio !== 'recogida' ? `📍 Dirección: ${direccion}\n` : '';
  const lineaTelefono = telefono ? `📞 Teléfono: ${telefono}\n` : '';
  const lineaPagara = pagaraCon != null
    ? `💵 Pagará con: ${pagaraCon.toFixed(2)}€${cambio != null ? ` — Cambio: ${cambio.toFixed(2)}€` : ''}\n`
    : '';

  return encodeURIComponent(
    `¡Hola! Quiero hacer este pedido:\n\n${lineasProductos}\n\n${etiquetaEnvio}\n${lineaDireccion}${lineaTelefono}💳 Pago: ${etiquetaPago}\n${lineaPagara}💰 Total: ${total.toFixed(2)}€`
  );
}

export function abrirWhatsApp(mensaje, numeroWhatsApp) {
  let numero = numeroWhatsApp || import.meta.env.VITE_WHATSAPP_NUMBER || '';
  numero = numero.replace(/\D/g, '');
  if (numero && !numero.startsWith('34')) {
    numero = '34' + numero;
  }
  window.open(`https://wa.me/${numero}?text=${mensaje}`, '_blank');
}
