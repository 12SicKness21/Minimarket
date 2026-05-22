import { useRef, useEffect } from 'react';

/**
 * Hook que hace auto-scroll horizontal continuo en un contenedor
 * y permite interacción táctil manual (pausa al tocar, reanuda solo).
 *
 * @param {number} speed  Píxeles por frame (≈ 60 fps). Default 0.55
 */
export function useAutoScroll(speed = 0.55) {
  const ref = useRef(null);
  const pausedRef = useRef(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafId;

    function tick() {
      if (!pausedRef.current) {
        el.scrollLeft += speed;
        // Cuando llegamos a la mitad (fin de la primera copia), volvemos a 0
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    function onTouchStart() {
      pausedRef.current = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    }

    function onTouchEnd() {
      timerRef.current = setTimeout(() => {
        pausedRef.current = false;
      }, 2500);
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend',   onTouchEnd,   { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timerRef.current);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend',   onTouchEnd);
    };
  }, [speed]);

  return ref;
}
