const CLAVE        = 'minimarket_ultimo_pedido';
const CLAVE_HIST   = 'minimarket_historial_pedidos';
const MAX_HISTORIAL = 30;

export function guardarUltimoPedido(items) {
  localStorage.setItem(CLAVE, JSON.stringify(items));
  // También añadir al historial
  agregarAlHistorial(items);
}

export function cargarUltimoPedido() {
  const data = localStorage.getItem(CLAVE);
  return data ? JSON.parse(data) : null;
}

// ── Historial ──────────────────────────────────────────
function agregarAlHistorial(items) {
  const total = items.reduce((sum, it) => sum + it.precioUnitario * it.cantidad, 0);
  const entrada = {
    id:    Date.now().toString(),
    fecha: new Date().toISOString(),
    items,
    total,
  };
  const actual = cargarHistorial();
  const nuevo  = [entrada, ...actual].slice(0, MAX_HISTORIAL);
  localStorage.setItem(CLAVE_HIST, JSON.stringify(nuevo));
}

export function cargarHistorial() {
  const data = localStorage.getItem(CLAVE_HIST);
  return data ? JSON.parse(data) : [];
}

export function limpiarHistorial() {
  localStorage.removeItem(CLAVE_HIST);
}
