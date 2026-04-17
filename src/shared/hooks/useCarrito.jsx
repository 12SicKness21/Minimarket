import { createContext, useContext, useState, useCallback } from 'react';

const CarritoContext = createContext(null);

export function CarritoProvider({ children }) {
  const [items, setItems] = useState([]);

  const agregarItem = useCallback((producto, cantidad = 1) => {
    setItems((prev) => {
      const existente = prev.find((i) => i.productoId === producto.id);
      if (existente) {
        return prev.map((i) =>
          i.productoId === producto.id ? { ...i, cantidad: i.cantidad + cantidad } : i
        );
      }
      return [
        ...prev,
        {
          productoId: producto.id,
          nombre: producto.nombre,
          precioUnitario: producto.precio,
          imagenUrl: producto.imagenUrl,
          cantidad,
        },
      ];
    });
  }, []);

  const quitarItem = useCallback((productoId) => {
    setItems((prev) => prev.filter((i) => i.productoId !== productoId));
  }, []);

  const actualizarCantidad = useCallback((productoId, cantidad) => {
    if (cantidad <= 0) {
      setItems((prev) => prev.filter((i) => i.productoId !== productoId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.productoId === productoId ? { ...i, cantidad } : i))
    );
  }, []);

  const vaciarCarrito = useCallback(() => setItems([]), []);

  const cargarItems = useCallback((nuevosItems) => setItems(nuevosItems), []);

  const totalItems = items.reduce((sum, i) => sum + i.cantidad, 0);
  const subtotal = items.reduce((sum, i) => sum + i.precioUnitario * i.cantidad, 0);

  return (
    <CarritoContext.Provider
      value={{
        items,
        agregarItem,
        quitarItem,
        actualizarCantidad,
        vaciarCarrito,
        cargarItems,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error('useCarrito debe usarse dentro de CarritoProvider');
  return ctx;
}
