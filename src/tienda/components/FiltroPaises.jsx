import { useCatalogos } from '../../shared/hooks/useCatalogos';

export default function FiltroPaises({ seleccionados, onChange }) {
  const { paises } = useCatalogos();

  function togglePais(paisId) {
    if (seleccionados.includes(paisId)) {
      onChange(seleccionados.filter((p) => p !== paisId));
    } else {
      onChange([...seleccionados, paisId]);
    }
  }

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 snap-x">
      {paises.map((pais) => {
        const activo = seleccionados.includes(pais.id);
        return (
          <button
            key={pais.id}
            onClick={() => togglePais(pais.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition snap-start ${
              activo
                ? 'bg-primario text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {pais.bandera && <span className="text-base">{pais.bandera}</span>}
            <span>{pais.nombre}</span>
          </button>
        );
      })}
    </div>
  );
}
