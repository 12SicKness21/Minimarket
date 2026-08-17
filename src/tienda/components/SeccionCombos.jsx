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

  // Soporte para deslizamiento con el dedo (swipe)
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const touchEndY = useRef(0);

  function handleTouchStart(e) {
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
  }

  function handleTouchMove(e) {
    touchEndX.current = e.targetTouches[0].clientX;
    touchEndY.current = e.targetTouches[0].clientY;
  }

  function handleTouchEnd() {
    if (!touchStartX.current || !touchEndX.current) return;
    const diffX = touchStartX.current - touchEndX.current;
    const diffY = touchStartY.current - touchEndY.current;
    const minSwipeDistance = 50;

    // Solo activar si el deslizamiento es predominantemente horizontal
    if (Math.abs(diffX) > minSwipeDistance && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        // Deslizar izquierda -> ir a Siguiente
        handleIrA((actual + 1) % combos.length);
      } else {
        // Deslizar derecha -> ir a Anterior
        handleIrA((actual - 1 + combos.length) % combos.length);
      }
    }

    // Resetear coordenadas
    touchStartX.current = 0;
    touchStartY.current = 0;
    touchEndX.current = 0;
    touchEndY.current = 0;
  }

  return (
    <section className="mb-8">
      {/* Cabecera — imagen redondeada integrada en el grid */}
      <div className="w-full mb-4 overflow-hidden rounded-2xl shadow-sm border border-gray-100">
        <img src="/combo.avif" alt="Combos" className="w-full object-cover" style={{ maxHeight: 100 }} />
      </div>

      <div
        className="relative overflow-hidden rounded-3xl shadow-xl border border-white/10 min-h-[420px] md:min-h-[300px]"
        style={{
          background: 'linear-gradient(135deg, #061e12 0%, #0b3520 50%, #104c2e 100%)',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Contenido del slide */}
        <div
          className="flex flex-col md:flex-row min-h-[420px] md:min-h-[300px] transition-opacity duration-250 p-3 pb-4 md:p-4 md:gap-4"
          style={{ opacity: fadeIn ? 1 : 0 }}
        >
          {/* Imagen — superior en móvil, izquierda en desktop (con borde y redondeado) */}
          <div className="w-full aspect-video md:aspect-auto md:w-[56%] relative overflow-hidden rounded-2xl border border-white/15 shadow-sm">
            {combo.imagenUrl ? (
              <img
                src={combo.imagenUrl}
                alt={combo.nombre}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/10">
                <span className="font-display font-black text-2xl text-white/20 text-center leading-tight">
                  {combo.nombre}
                </span>
              </div>
            )}
          </div>

          {/* Info — inferior en móvil, derecha en desktop */}
          <div className="w-full md:w-[44%] flex flex-col justify-between pt-1 md:pt-0 gap-3">
            {/* Etiqueta + nombre */}
            <div>
              <h3 className="font-display font-black text-white text-lg md:text-xl leading-snug line-clamp-3">
                {combo.nombre}
              </h3>
              {combo.descripcion && (
                <p className="text-green-300 text-sm mt-1 line-clamp-2 md:line-clamp-3 leading-snug">
                  {combo.descripcion}
                </p>
              )}
            </div>

            {/* Precio */}
            <div className="mt-2 md:mt-3">
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
              className="mt-2 md:mt-3 w-full bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-gray-900 font-black text-sm py-2.5 rounded-full transition-all shadow-lg"
            >
              Añadir al carrito
            </button>
          </div>
        </div>

        {/* Flecha siguiente */}
        {combos.length > 1 && (
          <button
            onClick={() => handleIrA((actual + 1) % combos.length)}
            className="absolute right-2 top-[26%] md:top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center transition"
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
