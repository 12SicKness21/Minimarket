import { useEffect, useState } from 'react';
import { obtenerConfigTienda } from '../../firebase/config-tienda';

const DIAS_CORTO = {
  lunes: 'Lun', martes: 'Mar', miercoles: 'Mié',
  jueves: 'Jue', viernes: 'Vie', sabado: 'Sáb', domingo: 'Dom',
};
const ORDEN = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

function formatearDias(diasAbierto = []) {
  if (!diasAbierto.length) return '—';
  const sorted = ORDEN.filter((d) => diasAbierto.includes(d));
  if (!sorted.length) return '—';
  // Construir rangos contiguos
  const rangos = [];
  let inicio = sorted[0], prev = sorted[0];
  for (let i = 1; i <= sorted.length; i++) {
    const curr = sorted[i];
    const prevIdx = ORDEN.indexOf(prev);
    const currIdx = ORDEN.indexOf(curr);
    if (curr && currIdx === prevIdx + 1) {
      prev = curr;
    } else {
      rangos.push(inicio === prev ? DIAS_CORTO[inicio] : `${DIAS_CORTO[inicio]} - ${DIAS_CORTO[prev]}`);
      inicio = curr;
      prev = curr;
    }
  }
  return rangos.join(', ');
}

function IgIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.54V6.79a4.85 4.85 0 01-1.02-.1z"/>
    </svg>
  );
}

function FbIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function generarLinkWhatsApp(numero) {
  const limpio = (numero || '').replace(/\D/g, '');
  return `https://wa.me/${limpio}`;
}

export default function Footer() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    obtenerConfigTienda().then(setConfig);
  }, []);

  const anio = new Date().getFullYear();

  const diasFormateados = config ? formatearDias(config.diasAbierto) : '—';
  const horaMañana = config ? `${config.horaApertura} - ${config.horaCierre}` : '—';
  const horaTarde = config?.tieneTurnoTarde
    ? `${config.horaAperturaTarde} - ${config.horaCierreTarde}`
    : null;

  const redes = config?.redes || {};
  const redesActivas = [
    redes.instagram?.activo && { key: 'instagram', url: redes.instagram.url, Icon: IgIcon, label: 'Instagram' },
    redes.tiktok?.activo    && { key: 'tiktok',    url: redes.tiktok.url,    Icon: TikTokIcon, label: 'TikTok' },
    redes.facebook?.activo  && { key: 'facebook',  url: redes.facebook.url,  Icon: FbIcon,  label: 'Facebook' },
  ].filter(Boolean);

  function scrollA(id) {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <footer className="bg-gray-900 text-gray-300 mt-8">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">

        {/* Columna 1 — Logo + contacto + horarios */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <img src="/icon.png" alt="logo" className="w-8 h-8 object-contain" />
            <span style={{ fontFamily: 'Boogaloo, cursive', color: '#93C572', fontSize: '1.3rem' }}>
              MINI MARKET
            </span>
          </div>

          {config?.whatsapp && (
            <a
              href={generarLinkWhatsApp(config.whatsapp)}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm hover:text-white transition"
            >
              <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.527 5.845L.057 23.882l6.197-1.624A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.876 9.876 0 01-5.031-1.378l-.361-.214-3.681.965.981-3.595-.235-.369A9.855 9.855 0 012.106 12C2.106 6.58 6.58 2.106 12 2.106c5.421 0 9.894 4.474 9.894 9.894 0 5.421-4.473 9.894-9.894 9.894z"/>
              </svg>
              {config.whatsapp}
            </a>
          )}

          {config && (
            <div className="text-sm space-y-1">
              <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">Horarios</p>
              <p>{diasFormateados}</p>
              <p>{horaMañana}</p>
              {horaTarde && <p>{horaTarde}</p>}
            </div>
          )}
        </div>

        {/* Columna 2 — Navegación */}
        <div className="space-y-3">
          <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Navegación</p>
          <ul className="space-y-2 text-sm">
            <li>
              <button onClick={() => scrollA('#productos')} className="hover:text-white transition text-left">
                Productos
              </button>
            </li>
            <li>
              <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} className="hover:text-white transition text-left">
                Sobre nosotros
              </button>
            </li>
            <li>
              <button onClick={() => scrollA('#contacto')} className="hover:text-white transition text-left">
                Contacto
              </button>
            </li>
            {config?.ubicacion?.url && (
              <li>
                <a href={config.ubicacion.url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  Dónde estamos
                </a>
              </li>
            )}
          </ul>
        </div>

        {/* Columna 3 — Redes sociales */}
        <div className="space-y-3">
          <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Síguenos</p>
          {redesActivas.length > 0 ? (
            <div className="flex gap-3">
              {redesActivas.map(({ key, url, Icon, label }) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
                >
                  <Icon />
                </a>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">Próximamente</p>
          )}
        </div>

      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 px-6 py-4">
        <p className="text-center text-xs text-gray-600">
          © {anio} Mini Market · Todos los derechos reservados
        </p>
      </div>
    </footer>
  );
}
