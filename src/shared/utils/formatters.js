export function formatPrecio(precio) {
  return `${Number(precio).toFixed(2)}€`;
}

export function formatFecha(timestamp) {
  if (!timestamp) return '—';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function diasHastaFecha(timestamp) {
  if (!timestamp) return null;
  const fecha = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const ahora = new Date();
  const diff = fecha.getTime() - ahora.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
