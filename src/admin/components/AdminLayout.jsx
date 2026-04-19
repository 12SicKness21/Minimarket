import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';

const NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard', icon: '📊' },
  { path: '/admin/productos', label: 'Productos', icon: '📦' },
  { path: '/admin/combos', label: 'Combos', icon: '🛍️' },
  { path: '/admin/catalogos', label: 'Catálogos', icon: '🏷️' },
  { path: '/admin/configuracion', label: 'Configuración', icon: '⚙️' },
];

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut(auth);
    navigate('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-4 border-b">
          <Link to="/admin" className="font-display font-extrabold text-xl text-primario">
            🛒 Minimarket
          </Link>
          <p className="text-xs text-gray-400 mt-1">Panel de administración</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const activo = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  activo
                    ? 'bg-green-50 text-primario'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition"
          >
            <span>🚪</span>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex-1 flex flex-col">
        <header className="md:hidden bg-white border-b px-4 py-3 flex items-center gap-3 flex-wrap">
          <span className="font-display font-bold text-primario whitespace-nowrap">🛒 Admin</span>
          <div className="flex items-center gap-1 flex-wrap">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-lg p-1.5 rounded-lg ${
                  location.pathname === item.path ? 'bg-green-50' : ''
                }`}
              >
                {item.icon}
              </Link>
            ))}
            <button onClick={handleLogout} className="text-lg p-1.5">🚪</button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
