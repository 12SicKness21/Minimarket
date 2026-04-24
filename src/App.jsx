import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';

// Tienda (eager - se necesita en la home)
import Home from './tienda/pages/Home';
import Catalogo from './tienda/pages/Catalogo';
import Navbar from './shared/components/Navbar';
import BotonWhatsApp from './shared/components/BotonWhatsApp';
import CarritoDrawer from './tienda/components/CarritoDrawer';
import ToastCarrito from './shared/components/ToastCarrito';
import BannerCerrado from './tienda/components/BannerCerrado';

// Admin (lazy - solo se descarga al entrar a /admin)
const Login = lazy(() => import('./admin/pages/Login'));
const Dashboard = lazy(() => import('./admin/pages/Dashboard'));
const Productos = lazy(() => import('./admin/pages/Productos'));
const Combos = lazy(() => import('./admin/pages/Combos'));
const Alertas = lazy(() => import('./admin/pages/Alertas'));
const Configuracion = lazy(() => import('./admin/pages/Configuracion'));
const Catalogos = lazy(() => import('./admin/pages/Catalogos'));
const AdminLayout = lazy(() => import('./admin/components/AdminLayout'));
//const SeedPage = lazy(() => import('./SeedPage'));

function Cargando() {
  return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">
      Cargando...
    </div>
  );
}

function RutaProtegida({ usuario, children }) {
  if (usuario === undefined) {
    return <Cargando />;
  }
  if (!usuario) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

export default function App() {
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [usuario, setUsuario] = useState(undefined);
  const location = useLocation();
  const esAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
    });
    return () => unsub();
  }, []);

  return (
    <>
      {/* Tienda routes */}
      {!esAdmin && (
        <>
          <Navbar onAbrirCarrito={() => setCarritoAbierto(true)} />
          <BannerCerrado />
          <CarritoDrawer abierto={carritoAbierto} onCerrar={() => setCarritoAbierto(false)} />
          <ToastCarrito />
          <BotonWhatsApp />
        </>
      )}

      <Suspense fallback={<Cargando />}>
        <Routes>
          {/* Tienda */}
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/seed" element={<SeedPage />} />

          {/* Admin */}
          <Route path="/admin/login" element={
            usuario ? <Navigate to="/admin" replace /> : <Login />
          } />
          <Route path="/admin" element={
            <RutaProtegida usuario={usuario}>
              <AdminLayout><Dashboard /></AdminLayout>
            </RutaProtegida>
          } />
          <Route path="/admin/productos" element={
            <RutaProtegida usuario={usuario}>
              <AdminLayout><Productos /></AdminLayout>
            </RutaProtegida>
          } />
          <Route path="/admin/combos" element={
            <RutaProtegida usuario={usuario}>
              <AdminLayout><Combos /></AdminLayout>
            </RutaProtegida>
          } />
          <Route path="/admin/alertas" element={
            <RutaProtegida usuario={usuario}>
              <AdminLayout><Alertas /></AdminLayout>
            </RutaProtegida>
          } />
          <Route path="/admin/catalogos" element={
            <RutaProtegida usuario={usuario}>
              <AdminLayout><Catalogos /></AdminLayout>
            </RutaProtegida>
          } />
          <Route path="/admin/configuracion" element={
            <RutaProtegida usuario={usuario}>
              <AdminLayout><Configuracion /></AdminLayout>
            </RutaProtegida>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}
