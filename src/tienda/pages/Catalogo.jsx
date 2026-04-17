import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { obtenerProductos } from '../../firebase/productos';
import FiltroPaises from '../components/FiltroPaises';
import FiltroCategoria from '../components/FiltroCategoria';
import ProductoCard from '../components/ProductoCard';

// Quita acentos y pasa a minúsculas para comparación insensible a tildes
function normalizar(str) {
  return (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

const POR_PAGINA = 24;

export default function Catalogo() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryInicial = searchParams.get('q') || '';

  const [busqueda, setBusqueda] = useState(queryInicial);
  const [paisesSeleccionados, setPaisesSeleccionados] = useState([]);
  const [categoria, setCategoria] = useState('');
  const [todosProductos, setTodosProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [visible, setVisible] = useState(POR_PAGINA);

  const inputRef = useRef(null);

  // Carga inicial — una sola vez
  useEffect(() => {
    obtenerProductos().then(({ productos }) => {
      setTodosProductos(productos);
      setCargando(false);
    });
  }, []);

  // Si la URL cambia (ej. nueva búsqueda desde Navbar), sincronizar input
  useEffect(() => {
    const q = searchParams.get('q') || '';
    setBusqueda(q);
    setVisible(POR_PAGINA);
    if (q && inputRef.current) inputRef.current.focus();
  }, [searchParams]);

  // Resetear paginación al cambiar filtros o búsqueda
  useEffect(() => {
    setVisible(POR_PAGINA);
  }, [busqueda, paisesSeleccionados, categoria]);

  // Filtrado client-side con normalización de acentos
  const productosFiltrados = todosProductos.filter((p) => {
    const termino = normalizar(busqueda.trim());
    const matchTexto =
      !termino ||
      normalizar(p.nombre).includes(termino) ||
      normalizar(p.descripcion).includes(termino) ||
      normalizar(p.categoria).includes(termino) ||
      p.paises?.some((pa) => normalizar(pa).includes(termino));

    const matchPais =
      paisesSeleccionados.length === 0 ||
      p.paises?.some((pa) => paisesSeleccionados.includes(pa));

    const matchCat = !categoria || p.categoria === categoria;

    return matchTexto && matchPais && matchCat;
  });

  const productosPagina = productosFiltrados.slice(0, visible);
  const quedanMas = productosFiltrados.length > visible;
  const hayFiltrosActivos = busqueda.trim() || paisesSeleccionados.length > 0 || categoria;

  function limpiarFiltros() {
    setBusqueda('');
    setPaisesSeleccionados([]);
    setCategoria('');
    setSearchParams({});
  }

  function handleBusquedaChange(e) {
    const val = e.target.value;
    setBusqueda(val);
    if (val.trim()) {
      setSearchParams({ q: val.trim() }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* Cabecera */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-display font-bold text-2xl text-gray-800">
          {busqueda.trim() ? `Resultados para "${busqueda.trim()}"` : 'Catálogo'}
        </h1>
        {!cargando && (
          <span className="text-sm text-gray-400">
            {productosFiltrados.length} {productosFiltrados.length === 1 ? 'producto' : 'productos'}
          </span>
        )}
      </div>

      {/* Buscador */}
      <div className="relative mb-4 max-w-md">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={busqueda}
          onChange={handleBusquedaChange}
          placeholder="Buscar productos..."
          className="w-full pl-9 pr-9 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario transition"
        />
        {busqueda && (
          <button
            onClick={() => { setBusqueda(''); setSearchParams({}); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            aria-label="Borrar búsqueda"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="mb-6 space-y-3">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-0.5">País</p>
          <FiltroPaises seleccionados={paisesSeleccionados} onChange={setPaisesSeleccionados} />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-0.5">Categoría</p>
          <FiltroCategoria seleccionada={categoria} onChange={setCategoria} />
        </div>
        {hayFiltrosActivos && (
          <button
            onClick={limpiarFiltros}
            className="text-xs text-gray-400 hover:text-red-500 font-medium transition flex items-center gap-1"
          >
            <span>✕</span> Limpiar filtros
          </button>
        )}
      </div>

      {/* Skeleton */}
      {cargando && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
              <div className="aspect-square bg-gray-100" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-gray-100 rounded-full w-3/4" />
                <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                <div className="h-8 bg-gray-100 rounded-full mt-2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sin resultados */}
      {!cargando && productosFiltrados.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-gray-500 font-medium">
            {busqueda.trim()
              ? `No encontramos "${busqueda.trim()}"`
              : 'No hay productos con estos filtros'}
          </p>
          <button
            onClick={limpiarFiltros}
            className="mt-4 text-primario font-semibold text-sm hover:underline"
          >
            Quitar filtros
          </button>
        </div>
      )}

      {/* Grid */}
      {!cargando && productosPagina.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {productosPagina.map((p) => (
            <ProductoCard key={p.id} producto={p} />
          ))}
        </div>
      )}

      {/* Ver más */}
      {quedanMas && !cargando && (
        <div className="text-center mt-8">
          <button
            onClick={() => setVisible((v) => v + POR_PAGINA)}
            className="bg-white border border-gray-200 text-gray-700 font-medium px-6 py-2.5 rounded-full hover:bg-gray-50 transition"
          >
            Ver más productos
          </button>
        </div>
      )}
    </div>
  );
}
