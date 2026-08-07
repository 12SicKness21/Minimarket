import { useState, useEffect } from 'react';
import { obtenerConfigTienda } from '../../firebase/config-tienda';
import { formatPrecio } from '../../shared/utils/formatters';

function IconoAtencion() {
  return (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 5a2 2 0 012-2h2.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.05 11.05 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function IconoPagoSeguro() {
  return (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function IconoEntrega() {
  return (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25h-3.75a2.25 2.25 0 00-2.25 2.25v9m-3.75-9h6.75m-6.75 0h.375a1.125 1.125 0 011.125 1.125v8.25a1.125 1.125 0 01-1.125 1.125H2.25" />
    </svg>
  );
}

function IconoDevoluciones() {
  return (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
    </svg>
  );
}

export default function SeccionCondiciones() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    obtenerConfigTienda().then(setConfig);
  }, []);

  const textoEntrega = config
    ? `Entrega en tu barrio desde ${formatPrecio(config.costoEnvioBarrio)}, fuera del barrio desde ${formatPrecio(config.costoEnvioFuera)}.`
    : 'Coordinamos la entrega en tu zona al confirmar el pedido.';

  const items = [
    {
      icono: IconoAtencion,
      titulo: 'Atención al cliente',
      texto: 'Resolvemos tus dudas antes y después de tu compra, directo por WhatsApp.',
    },
    {
      icono: IconoPagoSeguro,
      titulo: 'Pago seguro',
      texto: 'Pagas por Bizum o transferencia, coordinado por WhatsApp. Nunca compartimos tus datos bancarios.',
    },
    {
      icono: IconoEntrega,
      titulo: 'Entrega a domicilio',
      texto: textoEntrega,
    },
    {
      icono: IconoDevoluciones,
      titulo: 'Cambios y devoluciones',
      texto: 'Hasta 24h para productos perecederos y 7 días para el resto. Te ofrecemos reemplazo o reembolso.',
    },
  ];

  return (
    <section className="mb-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map(({ icono: Icono, titulo, texto }) => (
          <div key={titulo} className="flex flex-col items-center text-center gap-2">
            <div className="w-14 h-14 rounded-full bg-green-50 text-primario flex items-center justify-center">
              <Icono />
            </div>
            <h3 className="font-display font-bold text-sm text-gray-800">
              {titulo}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              {texto}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
