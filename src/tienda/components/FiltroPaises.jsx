import { useCatalogos } from '../../shared/hooks/useCatalogos';
import BanderaPais from '../../shared/components/BanderaPais';

export default function FiltroPaises({ seleccionados, onChange }) {
  const { paises } = useCatalogos();

  function togglePais(paisId) {
    // Selección única: clic en activo → deselecciona; clic en otro → reemplaza
    onChange(seleccionados.includes(paisId) ? [] : [paisId]);
  }

  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 snap-x">
      {paises.map((pais) => {
        const activo = seleccionados.includes(pais.id);
        return (
          <button
            key={pais.id}
            onClick={() => togglePais(pais.id)}
            className={`shrink-0 flex flex-col items-center gap-1 px-1 pt-1 pb-1.5 rounded-xl transition snap-start ${
              activo ? 'ring-2 ring-primario bg-green-50' : 'hover:bg-gray-50'
            }`}
          >
            <BanderaPais pais={pais} className="w-16 h-11 shadow-sm" />
            <span className={`text-[11px] font-medium whitespace-nowrap ${activo ? 'text-primario' : 'text-gray-600'}`}>
              {pais.nombre}
            </span>
          </button>
        );
      })}
    </div>
  );
}
