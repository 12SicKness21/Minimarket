import { useState, useEffect } from 'react';
import { obtenerTodosProductos, crearProducto, actualizarProducto } from '../../firebase/productos';
import { formatPrecio, formatFecha } from '../../shared/utils/formatters';
import ProductoForm from '../components/ProductoForm';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const BANDERAS = {
  venezuela: '🇻🇪', colombia: '🇨🇴', peru: '🇵🇪', ecuador: '🇪🇨',
  republica_dominicana: '🇩🇴', cuba: '🇨🇺', general: ''
};

const CATEGORIAS = ['harinas', 'bebidas', 'lacteos', 'snacks', 'conservas', 'limpieza', 'otros'];

export default function Productos() {
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

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h1 className="font-display font-bold text-2xl text-gray-800">Productos</h1>
        <button
          onClick={abrirNuevo}
          className="bg-primario hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-full text-sm transition"
        >
          + Nuevo producto
        </button>
      </div>

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
                    <th className="px-4 py-3">Nombre</th>
                    <th className="px-4 py-3">Categoría</th>
                    <th className="px-4 py-3">Países</th>
                    <th className="px-4 py-3">Precio</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3">Caducidad</th>
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
                          {p.imagenUrl ? (
                            <img src={p.imagenUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">📦</div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2 font-medium text-gray-800 max-w-[200px] truncate">{p.nombre}</td>
                      <td className="px-4 py-2 text-gray-500 capitalize">{p.categoria}</td>
                      <td className="px-4 py-2">{p.paises?.map((pa) => BANDERAS[pa]).join(' ')}</td>
                      <td className="px-4 py-2 font-medium">{formatPrecio(p.precio)}</td>
                      <td className="px-4 py-2">
                        <span className={p.stockActual <= 10 ? 'text-red-500 font-semibold' : 'text-gray-600'}>
                          {p.stockActual}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-500 text-xs">{formatFecha(p.fechaCaducidad)}</td>
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
    </div>
  );
}
