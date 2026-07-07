import { useState, useEffect, useRef } from 'react';
import { obtenerTodosProductos, crearProducto, actualizarProducto } from '../../firebase/productos';
import { generarPlantillaExcel, leerExcelProductos, procesarProductosMasivo } from '../../firebase/importarProductos';
import { formatPrecio } from '../../shared/utils/formatters';
import { useCatalogos } from '../../shared/hooks/useCatalogos';
import ProductoForm from '../components/ProductoForm';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const BANDERAS = {
  venezuela: '🇻🇪', colombia: '🇨🇴', peru: '🇵🇪', ecuador: '🇪🇨',
  republica_dominicana: '🇩🇴', cuba: '🇨🇺', general: ''
};

const CATEGORIAS = ['harinas', 'bebidas', 'lacteos', 'snacks', 'conservas', 'limpieza', 'otros'];

export default function Productos() {
  const { categorias, paises } = useCatalogos();
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroPais, setFiltroPais] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [pagina, setPagina] = useState(0);
  const POR_PAGINA = 20;

  // Carga masiva desde Excel
  const [importando, setImportando] = useState(false);
  const [resultadoImport, setResultadoImport] = useState(null);
  const [previaImport, setPreviaImport] = useState(null); // { validos, errores }
  const inputExcelRef = useRef(null);

  async function cargar() {
    setCargando(true);
    const data = await obtenerTodosProductos();
    setProductos(data);
    setCargando(false);
  }

  useEffect(() => { cargar(); }, []);

  const productosFiltrados = productos.filter((p) => {
     const matchBusqueda = busqueda.trim() === '' || p.nombre.toLowerCase().includes(busqueda.toLowerCase());
     const matchCategoria = filtroCategoria === '' || p.categoria === filtroCategoria;
     const matchPais = filtroPais === '' || (p.paises && p.paises.includes(filtroPais));
     return matchBusqueda && matchCategoria && matchPais;
  });

  const totalPaginas = Math.ceil(productosFiltrados.length / POR_PAGINA);
  const productosPagina = productosFiltrados.slice(pagina * POR_PAGINA, (pagina + 1) * POR_PAGINA);

  async function handleGuardar(data, imagen) {
    setGuardando(true);
    if (productoEditando) {
      await actualizarProducto(productoEditando.id, data, imagen);
    } else {
      await crearProducto(data, imagen);
    }
    setGuardando(false);
    setModalAbierto(false);
    setProductoEditando(null);
    cargar();
  }

  async function toggleCampo(id, campo, valorActual) {
    const { serverTimestamp } = await import('firebase/firestore');
    await updateDoc(doc(db, 'productos', id), { 
      [campo]: !valorActual,
      actualizadoEn: serverTimestamp() 
    });
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [campo]: !valorActual, actualizadoEn: new Date() } : p))
    );
  }

  async function handleEliminar(id) {
    if (window.confirm('¿Seguro que quieres eliminar este producto?')) {
      const { deleteDoc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'productos', id));
      setModalAbierto(false);
      setProductoEditando(null);
      cargar();
    }
  }

  function abrirNuevo() {
    setProductoEditando(null);
    setModalAbierto(true);
  }

  function abrirEditar(producto) {
    setProductoEditando(producto);
    setModalAbierto(true);
  }

  function handleDescargarPlantilla() {
    generarPlantillaExcel(categorias, paises);
  }

  async function handleSeleccionarExcel(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setResultadoImport(null);
    const { validos, errores } = await leerExcelProductos(file, { categorias, paises, productosExistentes: productos });
    setPreviaImport({ validos, errores });
    if (inputExcelRef.current) inputExcelRef.current.value = '';
  }

  function cambiarAccionFila(index, accion) {
    setPreviaImport((prev) => ({
      ...prev,
      validos: prev.validos.map((p, i) => (i === index ? { ...p, accion } : p)),
    }));
  }

  async function handleConfirmarImport() {
    if (!previaImport || previaImport.validos.length === 0) return;
    setImportando(true);
    const { creados, actualizados, omitidos, fallidos } = await procesarProductosMasivo(previaImport.validos);
    setImportando(false);
    setPreviaImport(null);
    setResultadoImport({ creados, actualizados, omitidos, fallidos });
    cargar();
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h1 className="font-display font-bold text-2xl text-gray-800">Productos</h1>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDescargarPlantilla}
            className="border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold px-4 py-2 rounded-full text-sm transition"
          >
            Descargar plantilla Excel
          </button>
          <label className="cursor-pointer border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold px-4 py-2 rounded-full text-sm transition">
            Cargar Excel
            <input
              ref={inputExcelRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleSeleccionarExcel}
              className="sr-only"
            />
          </label>
          <button
            onClick={abrirNuevo}
            className="bg-primario hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-full text-sm transition"
          >
            + Nuevo producto
          </button>
        </div>
      </div>

      {/* Resultado de la última importación */}
      {resultadoImport && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-2xl px-4 py-3 flex items-start justify-between gap-3">
          <p className="text-sm text-green-800">
            ✅ {resultadoImport.creados} creado(s), {resultadoImport.actualizados} actualizado(s)
            {resultadoImport.omitidos > 0 && `, ${resultadoImport.omitidos} omitido(s)`}.
            {resultadoImport.fallidos.length > 0 && (
              <span className="block text-red-600 mt-1">
                {resultadoImport.fallidos.length} fila(s) fallaron al guardar: {resultadoImport.fallidos.map((f) => f.nombre).join(', ')}
              </span>
            )}
          </p>
          <button onClick={() => setResultadoImport(null)} className="text-green-700 hover:text-green-900 shrink-0">✕</button>
        </div>
      )}

      {/* Filtros */}
      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <input
          value={busqueda}
          onChange={(e) => { setBusqueda(e.target.value); setPagina(0); }}
          placeholder="Buscar por nombre..."
          className="w-full sm:w-64 px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario"
        />
        <select
          value={filtroCategoria}
          onChange={(e) => { setFiltroCategoria(e.target.value); setPagina(0); }}
          className="w-full sm:w-auto px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario capitalize"
        >
          <option value="">Todas las categorías</option>
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={filtroPais}
          onChange={(e) => { setFiltroPais(e.target.value); setPagina(0); }}
          className="w-full sm:w-auto px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario capitalize"
        >
          <option value="">Todos los países</option>
          {Object.keys(BANDERAS).map((p) => (
            <option key={p} value={p}>{p.replace('_', ' ')} {BANDERAS[p]}</option>
          ))}
        </select>
      </div>

      {cargando ? (
        <p className="text-gray-400 text-center py-12">Cargando productos...</p>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase">
                    <th className="px-4 py-3">Imagen</th>
                    <th className="px-4 py-3">SKU</th>
                    <th className="px-4 py-3">Nombre</th>
                    <th className="px-4 py-3">Categoría</th>
                    <th className="px-4 py-3">Países</th>
                    <th className="px-4 py-3">Precio</th>
                    <th className="px-4 py-3">Nuevo</th>
                    <th className="px-4 py-3">Activo</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {productosPagina.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-2">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden">
                          <img
                            src={p.imagenUrl || '/icon.png'}
                            alt=""
                            className={p.imagenUrl ? 'w-full h-full object-cover' : 'w-full h-full object-contain p-1.5 opacity-50'}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2 text-gray-400 text-xs font-mono whitespace-nowrap">{p.sku || '—'}</td>
                      <td className="px-4 py-2 font-medium text-gray-800 max-w-[200px] truncate">{p.nombre}</td>
                      <td className="px-4 py-2 text-gray-500 capitalize">{p.categoria}</td>
                      <td className="px-4 py-2">{p.paises?.map((pa) => BANDERAS[pa]).join(' ')}</td>
                      <td className="px-4 py-2 font-medium">{formatPrecio(p.precio)}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => toggleCampo(p.id, 'recienLlegado', p.recienLlegado)}
                          className={`w-8 h-5 rounded-full transition ${p.recienLlegado ? 'bg-secundario' : 'bg-gray-200'} relative`}
                        >
                          <span className={`block w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${p.recienLlegado ? 'left-4' : 'left-0.5'}`} />
                        </button>
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => toggleCampo(p.id, 'activo', p.activo)}
                          className={`w-8 h-5 rounded-full transition ${p.activo ? 'bg-primario' : 'bg-gray-200'} relative`}
                        >
                          <span className={`block w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${p.activo ? 'left-4' : 'left-0.5'}`} />
                        </button>
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => abrirEditar(p)}
                          className="text-primario text-xs font-semibold hover:underline"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                onClick={() => setPagina(Math.max(0, pagina - 1))}
                disabled={pagina === 0}
                className="px-3 py-1.5 rounded-lg text-sm border disabled:opacity-30"
              >
                Anterior
              </button>
              <span className="text-sm text-gray-500">
                {pagina + 1} / {totalPaginas}
              </span>
              <button
                onClick={() => setPagina(Math.min(totalPaginas - 1, pagina + 1))}
                disabled={pagina >= totalPaginas - 1}
                className="px-3 py-1.5 rounded-lg text-sm border disabled:opacity-30"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}

      {modalAbierto && (
        <ProductoForm
          producto={productoEditando}
          onGuardar={handleGuardar}
          onCerrar={() => { setModalAbierto(false); setProductoEditando(null); }}
          onEliminar={(id) => handleEliminar(id)}
          guardando={guardando}
        />
      )}

      {/* Previsualización de carga masiva */}
      {previaImport && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
              <h2 className="font-display font-bold text-lg">Confirmar carga masiva</h2>
              <button onClick={() => setPreviaImport(null)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-500">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                <p className="text-sm text-green-800 font-semibold">
                  {previaImport.validos.length} fila(s) listas para procesar
                  {previaImport.validos.some((p) => p.existenteId) && (
                    <span className="block font-normal text-green-700 mt-0.5">
                      Algunos nombres ya existen en el catálogo — elige qué hacer con cada uno.
                    </span>
                  )}
                </p>
              </div>

              {previaImport.validos.length > 0 && (
                <div className="space-y-1.5 max-h-64 overflow-y-auto">
                  {previaImport.validos.map((p, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg px-3 py-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-800 truncate flex items-center gap-1.5">
                          {p.nombre}
                          {p.existenteId && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full shrink-0">
                              Ya existe
                            </span>
                          )}
                        </span>
                        <span className="text-gray-500 shrink-0 ml-2">{formatPrecio(p.precio)}</span>
                      </div>
                      {p.existenteId && (
                        <div className="flex items-center gap-3 mt-1.5">
                          <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                            <input
                              type="radio"
                              name={`accion-${i}`}
                              checked={p.accion === 'omitir'}
                              onChange={() => cambiarAccionFila(i, 'omitir')}
                              className="accent-primario"
                            />
                            Omitir (no tocar el existente)
                          </label>
                          <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                            <input
                              type="radio"
                              name={`accion-${i}`}
                              checked={p.accion === 'actualizar'}
                              onChange={() => cambiarAccionFila(i, 'actualizar')}
                              className="accent-primario"
                            />
                            Actualizar producto existente
                          </label>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {previaImport.errores.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <p className="text-sm text-red-700 font-semibold mb-2">
                    {previaImport.errores.length} fila(s) con error (no se crearán)
                  </p>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {previaImport.errores.map((e, i) => (
                      <p key={i} className="text-xs text-red-600">Fila {e.fila}: {e.motivo}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="shrink-0 border-t px-5 py-4 flex gap-2">
              <button
                onClick={() => setPreviaImport(null)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-full hover:bg-gray-50 transition text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarImport}
                disabled={importando || previaImport.validos.length === 0}
                className="flex-1 bg-primario hover:bg-green-700 text-white font-bold py-2.5 rounded-full transition disabled:opacity-50 text-sm"
              >
                {importando ? 'Procesando…' : `Procesar ${previaImport.validos.length} fila(s)`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
