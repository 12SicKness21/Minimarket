import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useCarrito } from '../hooks/useCarrito';

const MENU_ITEMS = [
  { label: 'Productos por categoría', href: '#categorias', emoji: '🛍️' },
  { label: 'Países',                  href: '#paises',     emoji: '🌎' },
  { label: 'Contacto',               href: '#contacto',   emoji: '📩' },
  { label: 'Dónde estamos',          href: '#ubicacion',  emoji: '📍' },
  { label: 'Fotos de local',         href: '#fotos',      emoji: '📸' },
];

export default function Navbar({ onAbrirCarrito }) {
  const { totalItems } = useCarrito();
  const [busqueda, setBusqueda] = useState('');
  const [buscadorAbierto, setBuscadorAbierto] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (buscadorAbierto && inputRef.current) inputRef.current.focus();
  }, [buscadorAbierto]);

  // Cerrar menú con Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuAbierto(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

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

  function handleMenuLink(href) {
    setMenuAbierto(false);
    // scroll suave a la sección
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">

          {/* Izquierda — hamburguesa (siempre) o logo desktop */}
          <div className={`flex items-center gap-2 shrink-0 ${buscadorAbierto ? 'hidden sm:flex' : 'flex'}`}>
            {/* Hamburguesa */}
            <button
              onClick={() => setMenuAbierto(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition"
              aria-label="Menú"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo icono — desktop */}
            <Link to="/" className="hidden sm:block">
              <img src="/icon.png" alt="Minimarket" className="w-8 h-8 object-contain" />
            </Link>
          </div>

          {/* Centro — MINI MARKET + icono móvil */}
          <Link
            to="/"
            className={`flex items-center gap-2 absolute left-1/2 -translate-x-1/2 transition-all duration-200 ${
              buscadorAbierto ? 'hidden sm:flex' : 'flex'
            }`}
          >
            {/* Icono solo en móvil */}
            <img src="/icon.png" alt="logo" className="w-7 h-7 object-contain sm:hidden" />
            <span
              className="text-2xl tracking-wide"
              style={{ fontFamily: 'Boogaloo, cursive', color: '#93C572' }}
            >
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
              <button
                type="button"
                onClick={handleCerrarBuscador}
                className="shrink-0 text-gray-500 font-medium text-sm px-1"
              >
                Cancelar
              </button>
            </form>
          )}

          {/* Derecha — lupa móvil + carrito */}
          <div className={`flex items-center gap-1 shrink-0 ${buscadorAbierto ? 'hidden sm:flex' : 'flex'}`}>
            <button
              onClick={() => setBuscadorAbierto(true)}
              className="sm:hidden p-2.5 rounded-full hover:bg-gray-100 transition"
              aria-label="Buscar"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <button
              onClick={onAbrirCarrito}
              className="relative p-2.5 rounded-full hover:bg-gray-100 transition"
              aria-label="Abrir carrito"
            >
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

      {/* ── Menú hamburguesa ── */}
      {/* Overlay */}
      {menuAbierto && (
        <div
          className="fixed inset-0 bg-black/40 z-50"
          onClick={() => setMenuAbierto(false)}
        />
      )}

      {/* Drawer lateral izquierdo */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl transform transition-transform duration-300 ${menuAbierto ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Cabecera del drawer */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <img src="/icon.png" alt="logo" className="w-8 h-8 object-contain" />
            <span style={{ fontFamily: 'Boogaloo, cursive', color: '#93C572', fontSize: '1.3rem' }}>
              MINI MARKET
            </span>
          </div>
          <button
            onClick={() => setMenuAbierto(false)}
            className="p-1.5 rounded-full hover:bg-gray-100 transition"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items del menú */}
        <nav className="px-3 py-4 space-y-1">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.href}
              onClick={() => handleMenuLink(item.href)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-700 hover:bg-gray-50 hover:text-primario transition text-left font-medium text-sm"
            >
              <span className="text-xl">{item.emoji}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
