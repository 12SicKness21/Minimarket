import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { obtenerConfigTienda } from '../../firebase/config-tienda';
import { obtenerProductosAlerta } from '../../firebase/productos';
import { formatFecha, diasHastaFecha, formatPrecio } from '../../shared/utils/formatters';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({ productos: 0, combos: 0 });
  const [alertas, setAlertas] = useState({ stockBajo: [], proximosCaducar: [] });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      const [snapProductos, snapCombos, config] = await Promise.all([
        getDocs(collection(db, 'productos')),
        getDocs(collection(db, 'combos')),
        // getDocs(query(collection(db, 'pedidos'), where('estado', '==', 'pendiente'))),
        obtenerConfigTienda(),
      ]);

      setStats({
        productos: snapProductos.size,
        combos: snapCombos.size,
        // pedidosPendientes: snapPedidos.size,
      });

      const alertasData = await obtenerProductosAlerta(config.alertaStockUnidades, config.alertaCaducidadDias);
      setAlertas(alertasData);
      setCargando(false);
    }
    cargar();

    // // Listener para pedidos pendientes (real-time)
    // const unsub = onSnapshot(
    //   query(collection(db, 'pedidos'), where('estado', '==', 'pendiente')),
    //   (snap) => {
    //     setStats((s) => ({ ...s, pedidosPendientes: snap.size }));
    //   }
    // );
    // return () => unsub();
  }, []);

  if (cargando) {
    return <div className="text-center py-12 text-gray-400">Cargando dashboard...</div>;
  }

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-gray-800 mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500">Total productos</p>
          <p className="font-display font-bold text-3xl text-gray-800 mt-1">{stats.productos}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500">Total combos</p>
          <p className="font-display font-bold text-3xl text-gray-800 mt-1">{stats.combos}</p>
        </div>
        {/* Pedidos pendientes — oculto por ahora
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500">Pedidos pendientes</p>
          <p className="font-display font-bold text-3xl text-secundario mt-1">{stats.pedidosPendientes}</p>
        </div>
        */}
      </div>

      {/* Alertas */}
      {(alertas.stockBajo.length > 0 || alertas.proximosCaducar.length > 0) && (
        <div className="space-y-4">
          <h2 className="font-display font-bold text-xl text-gray-800">Alertas</h2>

          {alertas.stockBajo.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <h3 className="font-semibold text-red-700 mb-3">🔴 Stock bajo</h3>
              <div className="space-y-2">
                {alertas.stockBajo.map((p) => (
                  <div key={p.id} className="flex items-center justify-between bg-white rounded-xl px-3 py-2">
                    <div>
                      <span className="text-sm font-medium text-gray-800">{p.nombre}</span>
                      <span className="text-xs text-red-500 ml-2">Stock: {p.stockActual}</span>
                    </div>
                    <Link
                      to="/admin/productos"
                      className="text-xs text-primario font-semibold hover:underline"
                    >
                      Ver producto
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {alertas.proximosCaducar.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
              <h3 className="font-semibold text-orange-700 mb-3">🟠 Próximos a caducar</h3>
              <div className="space-y-2">
                {alertas.proximosCaducar.map((p) => (
                  <div key={p.id} className="flex items-center justify-between bg-white rounded-xl px-3 py-2">
                    <div>
                      <span className="text-sm font-medium text-gray-800">{p.nombre}</span>
                      <span className="text-xs text-orange-500 ml-2">
                        Caduca: {formatFecha(p.fechaCaducidad)} ({diasHastaFecha(p.fechaCaducidad)} días)
                      </span>
                    </div>
                    <Link
                      to="/admin/productos"
                      className="text-xs text-primario font-semibold hover:underline"
                    >
                      Ver producto
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
