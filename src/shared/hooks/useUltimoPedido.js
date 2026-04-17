const CLAVE = 'minimarket_ultimo_pedido';

export function guardarUltimoPedido(items) {
  localStorage.setItem(CLAVE, JSON.stringify(items));
}

export function cargarUltimoPedido() {
  const data = localStorage.getItem(CLAVE);
  return data ? JSON.parse(data) : null;
}
