import { useRegisterSW } from 'virtual:pwa-register/react';

// Chequea si hay una versión nueva del service worker cada 30 min,
// y también cada vez que la PWA vuelve a primer plano (típico en Android:
// el usuario reanuda la app desde el multitarea en vez de recargarla).
const INTERVALO_CHEQUEO_MS = 30 * 60 * 1000;

export default function ActualizacionPWA() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      if (!registration) return;

      setInterval(() => registration.update(), INTERVALO_CHEQUEO_MS);

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') registration.update();
      });
    },
    onRegisterError(error) {
      console.error('Error al registrar el service worker:', error);
    },
  });

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] w-[92%] max-w-sm">
      <div className="bg-gray-900 text-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3">
        <span className="text-lg shrink-0">🔄</span>
        <p className="text-sm flex-1 leading-snug">
          Hay una versión nueva de la app disponible.
        </p>
        <button
          onClick={() => updateServiceWorker(true)}
          className="shrink-0 bg-primario hover:bg-green-700 text-white text-sm font-semibold px-3 py-1.5 rounded-full transition"
        >
          Actualizar
        </button>
      </div>
    </div>
  );
}
