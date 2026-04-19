import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { obtenerTodosProductos } from '../../firebase/productos';
import { formatPrecio } from '../../shared/utils/formatters';

export default function ComboForm({ combo, onGuardar, onCerrar, guardando }) {
  const [form, setForm] = useState({
    nombre: '',
    activo: true,
    productos: [],
  });
  const [descuentoInput, setDescuentoInput] = useState('0');
  const [imagen, setImagen] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [todosProductos, setTodosProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    obtenerTodosProductos().then(setTodosProductos);
  }, []);

  useEffect(() => {
    if (combo) {
      setForm({
        nombre: combo.nombre || '',
        activo: combo.activo ?? true,
        productos: combo.productos || [],
      });
      setDescuentoInput((combo.descuento || 0).toString());
      setPreviewUrl(combo.imagenUrl || '');
    }
  }, [combo]);

  const precioTotalOriginal = form.productos.reduce((sum, item) => {
    const prod = todosProductos.find((p) => p.id === item.productoId);
    return sum + (prod ? prod.precio * item.cantidad : 0);
  }, 0);

  const descuentoNum = parseFloat(descuentoInput.toString().replace(',', '.')) || 0;
  const precioFinal = Math.max(0, precioTotalOriginal - descuentoNum);

  function agregarProducto(producto) {
    setForm((f) => {
      const existe = f.productos.find((p) => p.productoId === producto.id);
      if (existe) {
        return {
          ...f,
          productos: f.productos.map((p) =>
            p.productoId === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
          ),
        };
      }
      return {
        ...f,
        productos: [...f.productos, { productoId: producto.id, cantidad: 1 }],
      };
    });
    setBusqueda('');
  }

  function actualizarCantidad(productoId, cantidad) {
    if (cantidad <= 0) {
      setForm((f) => ({
        ...f,
        productos: f.productos.filter((p) => p.productoId !== productoId),
      }));
      return;
    }
    setForm((f) => ({
      ...f,
      productos: f.productos.map((p) =>
        p.productoId === productoId ? { ...p, cantidad } : p
      ),
    }));
  }

  function handleImagen(e) {
    const file = e.target.files?.[0];
    if (file) {
      setImagen(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const descripcionGenerada = form.productos.map(item => {
      const prod = todosProductos.find((p) => p.id === item.productoId);
      return `${prod ? prod.nombre : 'Producto'}${item.cantidad > 1 ? ` (x${item.cantidad})` : ''}`;
    }).join(' + ');

    onGuardar({ 
      ...form, 
      descripcion: descripcionGenerada, 
      precioTotalOriginal, 
      descuento: descuentoNum, 
      precioTotal: precioFinal 
    }, imagen);
  }

  const productosFiltrados = busqueda.trim()
    ? todosProductos.filter((p) =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
      )
    : [];

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  return createPortal(
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full h-[96vh] sm:h-auto sm:max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-display font-bold text-lg">
            {combo ? 'Editar combo' : 'Nuevo combo'}
          </h2>
          <button onClick={onCerrar} className="p-1 hover:bg-gray-100 rounded-full">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              value={form.nombre}
              onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
              required
              className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
            <input type="file" accept="image/*" onChange={handleImagen} className="text-sm" />
            {previewUrl && (
              <img src={previewUrl} alt="Preview" className="mt-2 w-24 h-24 object-cover rounded-xl" />
            )}
          </div>

          {/* Buscar y añadir productos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Productos del combo</label>
            <div className="relative">
              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar producto para añadir..."
                className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario"
              />
              {productosFiltrados.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border rounded-xl mt-1 shadow-lg z-10 max-h-40 overflow-y-auto">
                  {productosFiltrados.slice(0, 8).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => agregarProducto(p)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex justify-between"
                    >
                      <span>{p.nombre}</span>
                      <span className="text-gray-400">{formatPrecio(p.precio)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Lista de productos en el combo */}
            <div className="mt-3 space-y-2">
              {form.productos.map((item) => {
                const prod = todosProductos.find((p) => p.id === item.productoId);
                return (
                  <div key={item.productoId} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-xl">
                    <span className="text-sm font-medium">{prod?.nombre || item.productoId}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => actualizarCantidad(item.productoId, item.cantidad - 1)}
                        className="w-6 h-6 bg-white border rounded-full text-xs font-bold"
                      >
                        −
                      </button>
                      <span className="text-sm font-semibold w-4 text-center">{item.cantidad}</span>
                      <button
                        type="button"
                        onClick={() => actualizarCantidad(item.productoId, item.cantidad + 1)}
                        className="w-6 h-6 bg-white border rounded-full text-xs font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 rounded-xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Valor real de productos</span>
              <span className="font-display font-semibold text-gray-500">{formatPrecio(precioTotalOriginal)}</span>
            </div>
            
            <div className="flex justify-between items-center bg-white p-2 border rounded-lg">
              <span className="text-sm font-medium text-gray-700">Descuento aplicado (-)</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDescuentoInput(Math.max(0, descuentoNum - 0.1).toFixed(2).replace(/\.00$/, ''))}
                  className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition"
                >
                  -
                </button>
                <input
                  type="text"
                  inputMode="decimal"
                  value={descuentoInput}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.,]/g, '');
                    setDescuentoInput(val);
                  }}
                  className="w-20 text-center border-b focus:outline-none focus:border-primario font-semibold"
                  placeholder="0.00"
                />
                <button
                  type="button"
                  onClick={() => setDescuentoInput((descuentoNum + 0.1).toFixed(2).replace(/\.00$/, ''))}
                  className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="text-sm font-bold text-gray-900">Precio final del combo</span>
              <span className="font-display font-black text-xl text-primario">{formatPrecio(precioFinal)}</span>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.activo}
              onChange={(e) => setForm((f) => ({ ...f, activo: e.target.checked }))}
              className="w-4 h-4 text-primario rounded focus:ring-primario"
            />
            <span className="text-sm font-medium text-gray-700">Activo</span>
          </label>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={guardando}
              className="flex-1 bg-primario hover:bg-green-700 text-white font-bold py-2.5 rounded-full transition disabled:opacity-50"
            >
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              type="button"
              onClick={onCerrar}
              className="sm:px-6 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-full hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
