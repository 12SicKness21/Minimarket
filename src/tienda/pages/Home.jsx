import { useState, useEffect } from 'react';
import { obtenerProductos } from '../../firebase/productos';
import { obtenerCombosActivos } from '../../firebase/combos';
import BannerRecienLlegado from '../components/BannerRecienLlegado';
import SeccionCombos from '../components/SeccionCombos';
import FiltroPaises from '../components/FiltroPaises';
import FiltroCategoria from '../components/FiltroCategoria';
import ProductoCard from '../components/ProductoCard';
import HeroBanderas from '../components/HeroBanderas';

export default function Home() {
  const [todosProductos, setTodosProductos] = useState([]);
  const [combos, setCombos] = useState([]);
  const [paisesSeleccionados, setPaisesSeleccionados] = useState([]);
  const [categoria, setCategoria] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      setCargando(true);
      const [{ productos }, combosData] = await Promise.all([
        obtenerProductos(),
        obtenerCombosActivos(),
      ]);
      setTodosProductos(productos);
      setCombos(combosData);
      setCargando(false);
    }
    cargar();
  }, []);

  const productosFiltrados = todosProductos.filter((p) => {
    const matchPais =
      paisesSeleccionados.length === 0 ||
      p.paises?.some((pa) => paisesSeleccionados.includes(pa));
    const matchCat = !categoria || p.categoria === categoria;
    return matchPais && matchCat;
  });

  const recienLlegados = todosProductos.filter((p) => p.recienLlegado);

  const [visible, setVisible] = useState(24);
  const productosPagina = productosFiltrados.slice(0, visible);
  const quedanMas = productosFiltrados.length > visible;

  useEffect(() => { setVisible(24); }, [paisesSeleccionados, categoria]);

  const hayFiltrosActivos = paisesSeleccionados.length > 0 || categoria !== '';

  return (
    <>
      {/* Fondo de banderas — fixed, detrás de todo */}
      <HeroBanderas />

      {/* Contenido — z-index 1 para ir encima del fondo */}
      <div className="max-w-7xl mx-auto px-4 py-6" style={{ position: 'relative', zIndex: 1 }}>

        {!cargando && <BannerRecienLlegado productos={recienLlegados} />}
        {!cargando && <SeccionCombos combos={combos} productos={todosProductos} />}

        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-lg text-gray-800">Filtrar por</h2>
            {hayFiltrosActivos && (
              <button
                onClick={() => { setPaisesSeleccionados([]); setCategoria(''); }}
                className="text-xs text-gray-400 hover:text-red-500 font-medium transition flex items-center gap-1"
              >
                <span>✕</span> Limpiar filtros
              </button>
            )}
          </div>
          <div className="mb-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-0.5">País</p>
            <FiltroPaises seleccionados={paisesSeleccionados} onChange={setPaisesSeleccionados} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-0.5">Categoría</p>
            <FiltroCategoria seleccionada={categoria} onChange={setCategoria} />
          </div>
        </section>

        <section>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-display font-bold text-xl text-gray-800">
              {hayFiltrosActivos ? 'Resultados' : 'Todos los productos'}
            </h2>
            {!cargando && (
              <span className="text-sm text-gray-400">
                {productosFiltrados.length} {productosFiltrados.length === 1 ? 'producto' : 'productos'}
              </span>
            )}
          </div>

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

          {!cargando && productosFiltrados.length === 0 && (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-gray-500 font-medium">No hay productos con estos filtros</p>
              <button
                onClick={() => { setPaisesSeleccionados([]); setCategoria(''); }}
                className="mt-4 text-primario font-semibold text-sm hover:underline"
              >
                Quitar filtros
              </button>
            </div>
          )}

          {!cargando && productosPagina.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {productosPagina.map((p) => (
                <ProductoCard key={p.id} producto={p} />
              ))}
            </div>
          )}

          {quedanMas && !cargando && (
            <div className="text-center mt-8">
              <button
                onClick={() => setVisible((v) => v + 24)}
                className="bg-white border border-gray-200 text-gray-700 font-medium px-6 py-2.5 rounded-full hover:bg-gray-50 transition"
              >
                Ver más productos
              </button>
            </div>
          )}
        </section>
      </div>
    </>
  );
}