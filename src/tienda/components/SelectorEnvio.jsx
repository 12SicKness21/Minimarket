import { formatPrecio } from '../../shared/utils/formatters';

const OPCIONES = [
  { id: 'recogida', label: 'Recogida en tienda', precio: 0 },
  { id: 'barrio', label: 'Envío en mi barrio', precio: null },
  { id: 'fuera', label: 'Envío fuera del barrio', precio: null },
];

export default function SelectorEnvio({ tipoEnvio, onChange, costoBarrio, costoFuera }) {
  const precios = {
    recogida: 0,
    barrio: costoBarrio,
    fuera: costoFuera,
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700">Tipo de envío</label>
      <div className="space-y-1.5">
        {OPCIONES.map((op) => {
          const precio = precios[op.id];
          const activo = tipoEnvio === op.id;
          return (
            <button
              key={op.id}
              onClick={() => onChange(op.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition border ${
                activo
                  ? 'border-primario bg-green-50 text-primario font-semibold'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <span>{op.label}</span>
              <span>{precio === 0 ? 'Gratis' : formatPrecio(precio)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
