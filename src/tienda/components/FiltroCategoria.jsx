import { useCatalogos } from '../../shared/hooks/useCatalogos';

export default function FiltroCategoria({ seleccionada, onChange }) {
  const { categorias } = useCatalogos();

  const todas = [{ id: '', label: 'Todas' }, ...categorias];

  return (
    <div className="flex gap-2 flex-wrap">
      {todas.map((cat) => {
        const activa = seleccionada === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
              activa
                ? 'bg-secundario text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
