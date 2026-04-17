import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useCarrito } from '../hooks/useCarrito';

export default function Navbar({ onAbrirCarrito }) {
  const { totalItems } = useCarrito();
  const [busqueda, setBusqueda] = useState('');
  const [buscadorAbierto, setBuscadorAbierto] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Al abrir el buscador en móvil, enfocar el input automáticamente
  useEffect(() => {
    if (buscadorAbierto && inputRef.current) {
      inputRef.current.focus();
    }
  }, [buscadorAbierto]);

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

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">

        {/* Logo — se oculta en móvil cuando el buscador está abierto */}
        <Link
          to="/"
          className={`flex items-center gap-2 shrink-0 transition-all duration-200 ${
            buscadorAbierto ? 'hidden sm:flex' : 'flex'
          }`}
        >
          <span className="text-2xl">🛒</span>
          <span className="font-display font-extrabold text-xl text-primario hidden sm:block">
            {import.meta.env.VITE_TIENDA_NOMBRE || 'Minimarket'}
          </span>
        </Link>

        {/* Buscador desktop — siempre visible en sm+ */}
        <form onSubmit={handleBuscar} className="hidden sm:flex flex-1 max-w-md">
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

        {/* Buscador móvil expandido — ocupa todo el ancho */}
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

        {/* Acciones derecha */}
        <div className={`flex items-center gap-1 shrink-0 ${buscadorAbierto ? 'hidden sm:flex' : 'flex'}`}>
          {/* Icono búsqueda móvil */}
          <button
            onClick={() => setBuscadorAbierto(true)}
            className="sm:hidden p-2.5 rounded-full hover:bg-gray-100 transition"
            aria-label="Buscar"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Carrito */}
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
  );
}
