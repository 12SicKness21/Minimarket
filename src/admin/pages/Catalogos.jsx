import { useCatalogos } from '../../shared/hooks/useCatalogos';

export default function Catalogos() {
  const { categorias, paises } = useCatalogos();

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="font-display font-bold text-2xl text-gray-800">Catálogos</h1>

      {/* ── CATEGORÍAS ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
        <h2 className="font-display font-bold text-lg text-gray-800">Categorías</h2>
        <div className="space-y-2">
          {categorias.map((cat) => (
            <div key={cat.id} className="flex items-center gap-2">
              <span className="flex-1 text-sm font-medium text-gray-800 bg-gray-50 px-3 py-1.5 rounded-xl">
                {cat.label}
                <span className="text-xs text-gray-400 ml-2 font-normal">#{cat.id}</span>
              </span>
            </div>
          ))}
          {categorias.length === 0 && (
            <p className="text-sm text-gray-400">No hay categorías registradas.</p>
          )}
        </div>
      </div>

      {/* ── PAÍSES ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
        <h2 className="font-display font-bold text-lg text-gray-800">Países</h2>
        <div className="space-y-2">
          {paises.map((pais) => (
            <div key={pais.id} className="flex items-center gap-2">
              <span className="flex-1 text-sm font-medium text-gray-800 bg-gray-50 px-3 py-1.5 rounded-xl flex items-center gap-2">
                {pais.bandera && <span className="text-base">{pais.bandera}</span>}
                {pais.nombre}
                <span className="text-xs text-gray-400 font-normal">#{pais.id}</span>
              </span>
            </div>
          ))}
          {paises.length === 0 && (
            <p className="text-sm text-gray-400">No hay países registrados.</p>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400 px-1">
        ℹ️ Los catálogos son de solo lectura. Contacta al desarrollador para hacer cambios.
      </p>
    </div>
  );
}
