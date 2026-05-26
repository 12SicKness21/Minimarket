import { useState, useEffect, useRef, useCallback } from 'react';
import { useCarrito } from '../../shared/hooks/useCarrito';
import { formatPrecio } from '../../shared/utils/formatters';

function PrecioGrande({ valor }) {
  if (!valor) return null;
  const entero = Math.floor(valor);
  const decimal = Math.round((valor - entero) * 100).toString().padStart(2, '0');
  return (
    <div className="flex items-start gap-0.5 leading-none">
      <span className="font-black text-yellow-400" style={{ fontSize: '3.6rem', lineHeight: 1 }}>
        {entero}
      </span>
      <span className="font-black text-yellow-400 text-2xl mt-1">.{decimal}€</span>
    </div>
  );
}

export default function SeccionCombos({ combos = [] }) {
  const { agregarCombo } = useCarrito();
  const [actual, setActual] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const timerRef = useRef(null);

  const irA = useCallback((idx) => {
    setFadeIn(false);
    setTimeout(() => { setActual(idx); setFadeIn(true); }, 250);
  }, []);

  const siguiente = useCallback(() => {
    setActual(c => {
      const next = (c + 1) % combos.length;
      irA(next);
      return c;
    });
  }, [combos.length, irA]);

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    if (combos.length > 1) {
      timerRef.current = setInterval(() => {
        setFadeIn(false);
        setTimeout(() => {
          setActual(c => (c + 1) % combos.length);
          setFadeIn(true);
        }, 250);
      }, 4500);
    }
  }, [combos.length]);

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [resetTimer]);

  if (combos.length === 0) return null;

  const combo = combos[actual];

  function handleIrA(i) {
    clearInterval(timerRef.current);
    irA(i);
    resetTimer();
  }

  return (
    <section className="mb-8">
      {/* Cabecera — imagen full-width */}
      <div className="w-full mb-3 overflow-hidden" style={{ width: '100vw', position: 'relative', left: '50%', transform: 'translateX(-50%)' }}>
        <img src="/combo.avif" alt="Combos" className="w-full object-cover" style={{ maxHeight: 80 }} />
      </div>

      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(140deg, #0d3320 0%, #145c38 60%, #1a7a4a 100%)',
          minHeight: 300,
          width: '100vw',
          position: 'relative',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        {/* Contenido del slide */}
        <div
          className="flex min-h-[300px] transition-opacity duration-250"
          style={{ opacity: fadeIn ? 1 : 0 }}
        >
          {/* Imagen — mitad izquierda */}
          <div className="w-[58%] relative overflow-hidden">
            {combo.imagenUrl ? (
              <img
                src={combo.imagenUrl}
                alt={combo.nombre}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <span className="font-display font-black text-2xl text-white/20 text-center leading-tight">
                  {combo.nombre}
                </span>
              </div>
            )}
            {/* Degradado lateral para mezclar con el texto */}
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-r from-transparent to-[#0d3320]" />
          </div>

          {/* Info — mitad derecha */}
          <div className="w-[42%] flex flex-col justify-between px-3 py-4">
            {/* Etiqueta + nombre */}
            <div>
              <h3 className="font-display font-black text-white text-lg leading-snug line-clamp-3">
                {combo.nombre}
              </h3>
              {combo.descripcion && (
                <p className="text-green-300 text-sm mt-1 line-clamp-2 leading-snug">
                  {combo.descripcion}
                </p>
              )}
            </div>

            {/* Precio */}
            <div className="mt-3">
              <PrecioGrande valor={combo.precioTotal} />
              {combo.descuento > 0 && (
                <span className="text-sm font-bold text-green-300 mt-0.5 block">
                  Ahorras {formatPrecio(combo.descuento)}
                </span>
              )}
            </div>

            {/* Botón Añadir */}
            <button
              onClick={() => agregarCombo(combo)}
              className="mt-3 w-full bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-gray-900 font-black text-sm py-2.5 rounded-full transition-all shadow-lg"
            >
              Añadir al carrito
            </button>
          </div>
        </div>

        {/* Flecha siguiente */}
        {combos.length > 1 && (
          <button
            onClick={() => handleIrA((actual + 1) % combos.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center transition"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Puntos de navegación */}
        {combos.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {combos.map((_, i) => (
              <button
                key={i}
                onClick={() => handleIrA(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === actual ? 20 : 7,
                  height: 7,
                  background: i === actual ? '#facc15' : 'rgba(255,255,255,0.35)',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
