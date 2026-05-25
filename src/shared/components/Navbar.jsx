import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useCarrito } from '../hooks/useCarrito';
import { obtenerCatalogos } from '../../firebase/catalogos';
import { obtenerConfigTienda } from '../../firebase/config-tienda';

// Imágenes de la carpeta /local (agregar aquí si se añaden más)
const IMAGENES_LOCAL = [
  '/local/tienda.avif',
];

function generarLinkWhatsApp(numero) {
  const limpio = (numero || '').replace(/\D/g, '');
  return `https://wa.me/${limpio}`;
}

export default function Navbar({ onAbrirCarrito, onSelectCategoria, onSelectPais }) {
  const { totalItems } = useCarrito();
  const [busqueda, setBusqueda] = useState('');
  const [buscadorAbierto, setBuscadorAbierto] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState(null);
  const [catalogos, setCatalogos] = useState(null);
  const [config, setConfig] = useState(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (buscadorAbierto && inputRef.current) inputRef.current.focus();
  }, [buscadorAbierto]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') cerrarMenu(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Carga datos la primera vez que se abre el menú
  useEffect(() => {
    if (!menuAbierto) return;
    if (!catalogos) obtenerCatalogos().then(setCatalogos);
    if (!config)    obtenerConfigTienda().then(setConfig);
  }, [menuAbierto]);

  function cerrarMenu() {
    setMenuAbierto(false);
    setSeccionActiva(null);
  }

  function toggleSeccion(id) {
    setSeccionActiva((prev) => (prev === id ? null : id));
  }

  function handleBuscar(e) {
    e.preventDefault();
    if (busqueda.trim()) {
      navigate(`/catalogo?q=${encodeURIComponent(busqueda.trim())}`);
      setBusqueda('');
      setBuscadorAbierto(false);
    }
  }

  function handleCerrarBuscador() {
    setBusqueda('');
    setBuscadorAbierto(false);
  }

  function seleccionarCategoria(catId) {
    onSelectCategoria?.(catId);
    cerrarMenu();
    setTimeout(() => {
      document.querySelector('#productos')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 250);
  }

  function seleccionarPais(paisId) {
    onSelectPais?.(paisId);
    cerrarMenu();
    setTimeout(() => {
      document.querySelector('#productos')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 250);
  }

  const categorias = catalogos?.categorias || [];
  const paises = catalogos?.paises || [];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">

          {/* Izquierda — hamburguesa */}
          <div className={`flex items-center gap-2 shrink-0 ${buscadorAbierto ? 'hidden sm:flex' : 'flex'}`}>
            <button
              onClick={() => setMenuAbierto(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition"
              aria-label="Menú"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link to="/" className="hidden sm:block">
              <img src="/icon.png" alt="logo" className="w-8 h-8 object-contain" />
            </Link>
          </div>

          {/* Centro — MINI MARKET */}
          <Link
            to="/"
            className={`flex items-center gap-2 absolute left-1/2 -translate-x-1/2 ${buscadorAbierto ? 'hidden sm:flex' : 'flex'}`}
          >
            <img src="/icon.png" alt="logo" className="w-7 h-7 object-contain sm:hidden" />
            <span style={{ fontFamily: 'Boogaloo, cursive', color: '#93C572', fontSize: '1.5rem', lineHeight: 1 }}>
              MINI MARKET
            </span>
          </Link>

          {/* Buscador desktop */}
          <form onSubmit={handleBuscar} className="hidden sm:flex flex-1 max-w-xs ml-auto">
            <div className="relative w-full">
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar productos..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario transition"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </form>

          {/* Buscador móvil expandido */}
          {buscadorAbierto && (
            <form onSubmit={handleBuscar} className="flex sm:hidden flex-1 items-center gap-2">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar productos..."
                  className="w-full pl-4 pr-4 py-2.5 rounded-full border border-primario bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 transition"
                />
              </div>
              <button type="button" onClick={handleCerrarBuscador}
                className="shrink-0 text-gray-500 font-medium text-sm px-1">
                Cancelar
              </button>
            </form>
          )}

          {/* Derecha — lupa + carrito */}
          <div className={`flex items-center gap-1 shrink-0 ${buscadorAbierto ? 'hidden sm:flex' : 'flex'}`}>
            <button onClick={() => setBuscadorAbierto(true)}
              className="sm:hidden p-2.5 rounded-full hover:bg-gray-100 transition" aria-label="Buscar">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button onClick={onAbrirCarrito}
              className="relative p-2.5 rounded-full hover:bg-gray-100 transition" aria-label="Abrir carrito">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primario text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center leading-none">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>
          </div>

        </div>
      </nav>

      {/* ── Drawer menú ── */}
      {menuAbierto && (
        <div className="fixed inset-0 bg-black/40 z-50" onClick={cerrarMenu} />
      )}

      <div className={`fixed top-0 left-0 h-full w-80 bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ${menuAbierto ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Cabecera drawer */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <img src="/icon.png" alt="logo" className="w-8 h-8 object-contain" />
            <span style={{ fontFamily: 'Boogaloo, cursive', color: '#93C572', fontSize: '1.3rem' }}>
              MINI MARKET
            </span>
          </div>
          <button onClick={cerrarMenu} className="p-1.5 rounded-full hover:bg-gray-100 transition">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cuerpo scrollable */}
        <div className="flex-1 overflow-y-auto">

          {/* ── Productos por categoría ── */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => toggleSeccion('categorias')}
              className="w-full flex items-center justify-between px-5 py-4 text-gray-800 font-semibold text-sm hover:bg-gray-50 transition"
            >
              Productos por categoría
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${seccionActiva === 'categorias' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {seccionActiva === 'categorias' && (
              <div className="px-4 pb-4">
                {!catalogos ? (
                  <p className="text-xs text-gray-400 px-1">Cargando...</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {categorias.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => seleccionarCategoria(cat.id)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 hover:bg-primario hover:text-white transition"
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Países ── */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => toggleSeccion('paises')}
              className="w-full flex items-center justify-between px-5 py-4 text-gray-800 font-semibold text-sm hover:bg-gray-50 transition"
            >
              Países
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${seccionActiva === 'paises' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {seccionActiva === 'paises' && (
              <div className="px-4 pb-4">
                {!catalogos ? (
                  <p className="text-xs text-gray-400 px-1">Cargando...</p>
                ) : (
                  <div className="flex flex-col gap-1">
                    {paises.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => seleccionarPais(p.id)}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-gray-50 hover:text-primario transition text-left"
                      >
                        {p.bandera && <span className="text-xl">{p.bandera}</span>}
                        <span>{p.nombre}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Contacto ── */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => toggleSeccion('contacto')}
              className="w-full flex items-center justify-between px-5 py-4 text-gray-800 font-semibold text-sm hover:bg-gray-50 transition"
            >
              Contacto
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${seccionActiva === 'contacto' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {seccionActiva === 'contacto' && (
              <div className="px-5 pb-4 space-y-3">
                {!config ? (
                  <p className="text-xs text-gray-400">Cargando...</p>
                ) : config.whatsapp ? (
                  <>
                    <p className="text-sm text-gray-500">WhatsApp</p>
                    <p className="text-base font-semibold text-gray-800">{config.whatsapp}</p>
                    <a
                      href={generarLinkWhatsApp(config.whatsapp)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-[#25D366] text-white font-semibold text-sm hover:bg-[#1ebe5d] transition"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.527 5.845L.057 23.882l6.197-1.624A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.876 9.876 0 01-5.031-1.378l-.361-.214-3.681.965.981-3.595-.235-.369A9.855 9.855 0 012.106 12C2.106 6.58 6.58 2.106 12 2.106c5.421 0 9.894 4.474 9.894 9.894 0 5.421-4.473 9.894-9.894 9.894z"/>
                      </svg>
                      Chatear por WhatsApp
                    </a>
                  </>
                ) : (
                  <p className="text-xs text-gray-400">No hay número configurado.</p>
                )}
              </div>
            )}
          </div>

          {/* ── Dónde estamos ── */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => toggleSeccion('ubicacion')}
              className="w-full flex items-center justify-between px-5 py-4 text-gray-800 font-semibold text-sm hover:bg-gray-50 transition"
            >
              Dónde estamos
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${seccionActiva === 'ubicacion' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {seccionActiva === 'ubicacion' && (
              <div className="px-5 pb-4 space-y-3">
                {!config ? (
                  <p className="text-xs text-gray-400">Cargando...</p>
                ) : (
                  <>
                    {config.ubicacion?.direccion && (
                      <p className="text-sm text-gray-700 leading-snug">
                        📍 {config.ubicacion.direccion}
                      </p>
                    )}
                    {config.ubicacion?.url ? (
                      <a
                        href={config.ubicacion.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition"
                      >
                        Ver en Google Maps
                      </a>
                    ) : (
                      !config.ubicacion?.direccion && (
                        <p className="text-xs text-gray-400">No hay ubicación configurada.</p>
                      )
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* ── Imágenes nuestras ── */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => toggleSeccion('imagenes')}
              className="w-full flex items-center justify-between px-5 py-4 text-gray-800 font-semibold text-sm hover:bg-gray-50 transition"
            >
              Imágenes nuestras
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${seccionActiva === 'imagenes' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {seccionActiva === 'imagenes' && (
              <div className="px-4 pb-4">
                <div className="grid grid-cols-2 gap-2">
                  {IMAGENES_LOCAL.map((src) => (
                    <img
                      key={src}
                      src={src}
                      alt="Local"
                      className="w-full aspect-square object-cover rounded-xl"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
