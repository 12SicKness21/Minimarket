import { useState, useEffect } from 'react';
import { obtenerConfigTienda } from '../../firebase/config-tienda';
import { obtenerProductosAlerta } from '../../firebase/productos';
import { formatFecha, diasHastaFecha } from '../../shared/utils/formatters';

export default function Alertas() {
  const [alertas, setAlertas] = useState({ stockBajo: [], proximosCaducar: [] });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      const config = await obtenerConfigTienda();
      const data = await obtenerProductosAlerta(config.alertaStockUnidades, config.alertaCaducidadDias);
      setAlertas(data);
      setCargando(false);
    }
    cargar();
  }, []);

  if (cargando) return <p className="text-gray-400 text-center py-12">Cargando alertas...</p>;

  const sinAlertas = alertas.stockBajo.length === 0 && alertas.proximosCaducar.length === 0;

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-gray-800 mb-6">Alertas</h1>

      {sinAlertas ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-2">✅</p>
          <p>No hay alertas activas</p>
        </div>
      ) : (
        <div className="space-y-6">
          {alertas.stockBajo.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
              <h2 className="font-semibold text-red-700 text-lg mb-3">🔴 Stock bajo ({alertas.stockBajo.length})</h2>
              <div className="space-y-2">
                {alertas.stockBajo.map((p) => (
                  <div key={p.id} className="bg-white rounded-xl px-4 py-3 flex justify-between items-center">
                    <span className="font-medium text-gray-800">{p.nombre}</span>
                    <span className="text-red-500 font-bold">{p.stockActual} uds.</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {alertas.proximosCaducar.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
              <h2 className="font-semibold text-orange-700 text-lg mb-3">🟠 Próximos a caducar ({alertas.proximosCaducar.length})</h2>
              <div className="space-y-2">
                {alertas.proximosCaducar.map((p) => (
                  <div key={p.id} className="bg-white rounded-xl px-4 py-3 flex justify-between items-center">
                    <span className="font-medium text-gray-800">{p.nombre}</span>
                    <span className="text-orange-500 font-semibold">
                      {formatFecha(p.fechaCaducidad)} ({diasHastaFecha(p.fechaCaducidad)}d)
                    </span>
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
