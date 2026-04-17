import { useState } from 'react';
import { ejecutarSeed } from './firebase/seed';

export default function SeedPage() {
  const [estado, setEstado] = useState('idle');
  const [mensaje, setMensaje] = useState('');

  async function handleSeed() {
    setEstado('cargando');
    setMensaje('Creando productos, combos y configuración...');
    try {
      const resultado = await ejecutarSeed();
      setEstado('completado');
      setMensaje(`Seed completado: ${resultado.length} productos creados, 2 combos y configuración.`);
    } catch (err) {
      setEstado('error');
      setMensaje(`Error: ${err.message}`);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md text-center">
        <span className="text-5xl">🌱</span>
        <h1 className="font-display font-bold text-2xl text-gray-800 mt-4 mb-2">Seed de datos</h1>
        <p className="text-sm text-gray-500 mb-6">
          Esto creará 10 productos de prueba, 2 combos y la configuración inicial en tu Firestore.
        </p>

        {estado === 'idle' && (
          <button
            onClick={handleSeed}
            className="bg-primario hover:bg-green-700 text-white font-bold px-6 py-3 rounded-full transition"
          >
            Ejecutar seed
          </button>
        )}

        {estado === 'cargando' && (
          <p className="text-secundario font-medium animate-pulse">{mensaje}</p>
        )}

        {estado === 'completado' && (
          <div>
            <p className="text-green-600 font-medium mb-4">{mensaje}</p>
            <a href="/" className="text-primario font-semibold hover:underline">
              Ir a la tienda →
            </a>
          </div>
        )}

        {estado === 'error' && (
          <div>
            <p className="text-red-500 font-medium mb-4">{mensaje}</p>
            <button
              onClick={() => setEstado('idle')}
              className="text-primario font-semibold hover:underline"
            >
              Reintentar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
