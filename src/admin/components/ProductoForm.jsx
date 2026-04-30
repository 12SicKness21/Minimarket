import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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

  // Bloquear scroll del body mientras el modal está abierto
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  return createPortal(
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center sm:p-4">
      {/* Sheet en móvil (sube desde abajo), modal centrado en desktop */}
      <div className="bg-white w-full sm:rounded-2xl sm:max-w-2xl flex flex-col rounded-t-2xl max-h-[96dvh] sm:max-h-[90vh]">

        {/* ── Header sticky ── */}
        <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
          <h2 className="font-display font-bold text-lg">
            {producto ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          <button onClick={onCerrar} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-500">
            ✕
          </button>
        </div>

        {/* ── Cuerpo scrolleable ── */}
        <form id="producto-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              placeholder="Ej: Harina P.A.N. 1kg"
              className="w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario"
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
              placeholder="Descripción breve del producto..."
              className="w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario resize-none"
            />
          </div>

          {/* Precio · Stock */}
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
                placeholder="0.00"
                className="w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                name="stockActual"
                type="number"
                min="0"
                value={form.stockActual}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario"
              />
            </div>
          </div>

          {/* Categoría · Caducidad */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario"
              >
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Caducidad</label>
              <input
                name="fechaCaducidad"
                type="date"
                value={form.fechaCaducidad}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario"
              />
            </div>
          </div>

          {/* Países */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Países</label>
            <div className="flex flex-wrap gap-2">
              {paises.map((p) => (
                <label
                  key={p.id}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm cursor-pointer transition border select-none ${
                    form.paises.includes(p.id)
                      ? 'border-primario bg-green-50 text-primario font-medium'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <input type="checkbox" checked={form.paises.includes(p.id)} onChange={() => togglePais(p.id)} className="sr-only" />
                  {p.bandera && <span>{p.bandera}</span>}
                  <span>{p.nombre}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Imagen</label>
            <label className="flex items-center gap-3 cursor-pointer">
              {/* Zona de preview / tap */}
              <div className="w-20 h-20 shrink-0 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden hover:border-primario transition">
                {previewUrl
                  ? <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  : <span className="text-2xl">📷</span>
                }
              </div>
              <div className="text-sm text-gray-500">
                <span className="text-primario font-medium">Toca para elegir</span> o arrastra una foto
                <p className="text-xs text-gray-400 mt-0.5">JPG, PNG · máx. 5 MB</p>
              </div>
              <input type="file" accept="image/*" onChange={handleImagen} className="sr-only" />
            </label>
          </div>

          {/* Toggles */}
          <div className="flex gap-6 pt-1">
            {/* Recién llegado */}
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, recienLlegado: !f.recienLlegado }))}
              className="flex items-center gap-2.5"
            >
              <span className={`relative inline-flex w-10 h-6 rounded-full transition-colors ${form.recienLlegado ? 'bg-secundario' : 'bg-gray-200'}`}>
                <span className={`block w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm ${form.recienLlegado ? 'left-5' : 'left-1'}`} />
              </span>
              <span className="text-sm font-medium text-gray-700">Recién llegado</span>
            </button>

            {/* Activo */}
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, activo: !f.activo }))}
              className="flex items-center gap-2.5"
            >
              <span className={`relative inline-flex w-10 h-6 rounded-full transition-colors ${form.activo ? 'bg-primario' : 'bg-gray-200'}`}>
                <span className={`block w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm ${form.activo ? 'left-5' : 'left-1'}`} />
              </span>
              <span className="text-sm font-medium text-gray-700">Activo</span>
            </button>
          </div>

        </form>

        {/* ── Footer sticky con acciones ── */}
        <div className="shrink-0 border-t bg-white px-4 py-3 flex gap-2 safe-area-bottom">
          {producto && onEliminar && (
            <button
              type="button"
              onClick={() => onEliminar(producto.id)}
              className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition"
              title="Eliminar producto"
            >
              🗑️
            </button>
          )}
          <button
            type="button"
            onClick={onCerrar}
            className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-full hover:bg-gray-50 transition text-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="producto-form"
            disabled={guardando}
            className="flex-1 bg-primario hover:bg-green-700 text-white font-bold py-2.5 rounded-full transition disabled:opacity-50 text-sm"
          >
            {guardando ? 'Guardando…' : producto ? 'Guardar cambios' : 'Crear producto'}
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
