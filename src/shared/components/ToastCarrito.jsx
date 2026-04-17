import { useEffect, useState } from 'react';

/**
 * Toast que aparece desde abajo cuando se añade un producto al carrito.
 * Se usa junto con el contexto del carrito mediante el evento customizado
 * "carrito:añadido" que dispara ProductoCard.
 */
export default function ToastCarrito() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    function handleAnadido(e) {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, nombre: e.detail.nombre }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 2500);
    }

    window.addEventListener('carrito:anadido', handleAnadido);
    return () => window.removeEventListener('carrito:anadido', handleAnadido);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-gray-900 text-white text-sm font-medium px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-bounce-in whitespace-nowrap max-w-[280px]"
        >
          <span className="text-primario text-base">✓</span>
          <span className="truncate">{toast.nombre} añadido</span>
        </div>
      ))}
    </div>
  );
}
