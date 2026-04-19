import { useState, useEffect } from 'react';
import { useCatalogos } from '../../shared/hooks/useCatalogos';

function generarKeywords(nombre, descripcion) {
  const texto = `${nombre} ${descripcion}`.toLowerCase();
  return [...new Set(texto.split(/\s+/).filter((w) => w.length > 2))];
}

export default function ProductoForm({ producto, onGuardar, onCerrar, onEliminar, guardando }) {
  const { categorias, paises } = useCatalogos();

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: 'otros',
    paises: [],
    stockActual: '',
    fechaCaducidad: '',
    recienLlegado: false,
    activo: true,
    keywords: [],
  });
  const [imagen, setImagen] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (producto) {
      setForm({
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        precio: producto.precio?.toString() || '',
        categoria: producto.categoria || 'otros',
        paises: producto.paises || [],
        stockActual: producto.stockActual?.toString() || '',
        fechaCaducidad: producto.fechaCaducidad
          ? (producto.fechaCaducidad.toDate ? producto.fechaCaducidad.toDate() : new Date(producto.fechaCaducidad))
              .toISOString()
              .split('T')[0]
          : '',
        recienLlegado: producto.recienLlegado || false,
        activo: producto.activo ?? true,
        keywords: producto.keywords || [],
      });
      setPreviewUrl(producto.imagenUrl || '');
    }
  }, [producto]);

  useEffect(() => {
    setForm((f) => ({ ...f, keywords: generarKeywords(f.nombre, f.descripcion) }));
  }, [form.nombre, form.descripcion]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  }

  function togglePais(paisId) {
    setForm((f) => ({
      ...f,
      paises: f.paises.includes(paisId) ? f.paises.filter((p) => p !== paisId) : [...f.paises, paisId],
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
    const paisesFinal = form.paises.length > 0 ? form.paises : ['general'];
    const data = {
      ...form,
      paises: paisesFinal,
      precio: parseFloat(form.precio) || 0,
      stockActual: parseInt(form.stockActual) || 0,
      fechaCaducidad: form.fechaCaducidad ? new Date(form.fechaCaducidad) : null,
    };
    onGuardar(data, imagen);
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full h-[96vh] sm:h-auto sm:max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-display font-bold text-lg">
            {producto ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          <button onClick={onCerrar} className="p-1 hover:bg-gray-100 rounded-full">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario resize-none"
            />
          </div>

          {/* Precio y Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio (€)</label>
              <input
                name="precio"
                type="number"
                step="0.01"
                min="0"
                value={form.precio}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock actual</label>
              <input
                name="stockActual"
                type="number"
                min="0"
                value={form.stockActual}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario"
              />
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario"
            >
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Países */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Países</label>
            <div className="flex flex-wrap gap-2">
              {paises.map((p) => (
                <label
                  key={p.id}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm cursor-pointer transition border ${
                    form.paises.includes(p.id)
                      ? 'border-primario bg-green-50 text-primario font-medium'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.paises.includes(p.id)}
                    onChange={() => togglePais(p.id)}
                    className="sr-only"
                  />
                  {p.bandera && <span>{p.bandera}</span>}
                  <span>{p.nombre}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Fecha caducidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de caducidad (opcional)</label>
            <input
              name="fechaCaducidad"
              type="date"
              value={form.fechaCaducidad}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario"
            />
          </div>

          {/* Imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
            <input type="file" accept="image/*" onChange={handleImagen} className="text-sm" />
            {previewUrl && (
              <img src={previewUrl} alt="Preview" className="mt-2 w-24 h-24 object-cover rounded-xl" />
            )}
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="recienLlegado"
                checked={form.recienLlegado}
                onChange={handleChange}
                className="w-4 h-4 text-primario rounded focus:ring-primario"
              />
              <span className="text-sm font-medium text-gray-700">Recién llegado</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="activo"
                checked={form.activo}
                onChange={handleChange}
                className="w-4 h-4 text-primario rounded focus:ring-primario"
              />
              <span className="text-sm font-medium text-gray-700">Activo</span>
            </label>
          </div>

          {/* Botones */}
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
            {producto && onEliminar && (
              <button
                type="button"
                onClick={() => onEliminar(producto.id)}
                className="sm:px-6 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded-full transition"
              >
                Eliminar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
