import { useState } from 'react';
import { useCatalogos } from '../../shared/hooks/useCatalogos';
import {
  contarProductosConCategoria,
  contarProductosConPais,
  slugify,
} from '../../firebase/catalogos';

export default function Catalogos() {
  const { categorias, paises, actualizarCategorias, actualizarPaises } = useCatalogos();

  // ── Categorías ──
  const [nuevaCat, setNuevaCat] = useState('');
  const [editandoCat, setEditandoCat] = useState(null); // { id, label }
  const [guardandoCat, setGuardandoCat] = useState(false);

  async function agregarCategoria() {
    if (!nuevaCat.trim()) return;
    const id = slugify(nuevaCat);
    if (categorias.find((c) => c.id === id)) return alert('Ya existe una categoría con ese nombre.');
    setGuardandoCat(true);
    await actualizarCategorias([...categorias, { id, label: nuevaCat.trim() }]);
    setNuevaCat('');
    setGuardandoCat(false);
  }

  async function editarCategoria() {
    if (!editandoCat?.label.trim()) return;
    setGuardandoCat(true);
    const nuevas = categorias.map((c) =>
      c.id === editandoCat.id ? { ...c, label: editandoCat.label } : c
    );
    await actualizarCategorias(nuevas);
    setEditandoCat(null);
    setGuardandoCat(false);
  }

  async function eliminarCategoria(cat) {
    const count = await contarProductosConCategoria(cat.id);
    if (count > 0) {
      const ok = window.confirm(
        `⚠️ La categoría "${cat.label}" tiene ${count} producto${count > 1 ? 's' : ''} asignado${count > 1 ? 's' : ''}.\n\nSi la eliminas, esos productos conservarán el valor pero no aparecerá en los filtros ni en el formulario.\n\n¿Deseas continuar?`
      );
      if (!ok) return;
    }
    await actualizarCategorias(categorias.filter((c) => c.id !== cat.id));
  }

  // ── Países ──
  const [nuevoPaisNombre, setNuevoPaisNombre] = useState('');
  const [nuevoPaisBandera, setNuevoPaisBandera] = useState('');
  const [editandoPais, setEditandoPais] = useState(null); // { id, nombre, bandera }
  const [guardandoPais, setGuardandoPais] = useState(false);

  async function agregarPais() {
    if (!nuevoPaisNombre.trim()) return;
    const id = slugify(nuevoPaisNombre);
    if (paises.find((p) => p.id === id)) return alert('Ya existe un país con ese nombre.');
    setGuardandoPais(true);
    await actualizarPaises([...paises, { id, nombre: nuevoPaisNombre.trim(), bandera: nuevoPaisBandera.trim() }]);
    setNuevoPaisNombre('');
    setNuevoPaisBandera('');
    setGuardandoPais(false);
  }

  async function editarPais() {
    if (!editandoPais?.nombre.trim()) return;
    setGuardandoPais(true);
    const nuevos = paises.map((p) =>
      p.id === editandoPais.id ? { ...p, nombre: editandoPais.nombre, bandera: editandoPais.bandera } : p
    );
    await actualizarPaises(nuevos);
    setEditandoPais(null);
    setGuardandoPais(false);
  }

  async function eliminarPais(pais) {
    const count = await contarProductosConPais(pais.id);
    if (count > 0) {
      const ok = window.confirm(
        `⚠️ El país "${pais.nombre}" tiene ${count} producto${count > 1 ? 's' : ''} asignado${count > 1 ? 's' : ''}.\n\nSi lo eliminas, esos productos lo conservarán pero no aparecerá en los filtros ni en el formulario.\n\n¿Deseas continuar?`
      );
      if (!ok) return;
    }
    await actualizarPaises(paises.filter((p) => p.id !== pais.id));
  }

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="font-display font-bold text-2xl text-gray-800">Catálogos</h1>

      {/* ── CATEGORÍAS ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h2 className="font-display font-bold text-lg text-gray-800">Categorías</h2>

        {/* Lista */}
        <div className="space-y-2">
          {categorias.map((cat) => (
            <div key={cat.id} className="flex items-center gap-2">
              {editandoCat?.id === cat.id ? (
                <>
                  <input
                    value={editandoCat.label}
                    onChange={(e) => setEditandoCat({ ...editandoCat, label: e.target.value })}
                    className="flex-1 px-3 py-1.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario"
                    onKeyDown={(e) => e.key === 'Enter' && editarCategoria()}
                  />
                  <button
                    onClick={editarCategoria}
                    disabled={guardandoCat}
                    className="px-3 py-1.5 bg-primario text-white text-sm font-semibold rounded-full transition disabled:opacity-50"
                  >
                    {guardandoCat ? '...' : 'Guardar'}
                  </button>
                  <button
                    onClick={() => setEditandoCat(null)}
                    className="px-3 py-1.5 border border-gray-200 text-gray-500 text-sm rounded-full hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm font-medium text-gray-800 bg-gray-50 px-3 py-1.5 rounded-xl">
                    {cat.label}
                    <span className="text-xs text-gray-400 ml-2 font-normal">#{cat.id}</span>
                  </span>
                  <button
                    onClick={() => setEditandoCat(cat)}
                    className="p-1.5 text-gray-400 hover:text-primario transition"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => eliminarCategoria(cat)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition"
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Añadir nueva */}
        <div className="flex gap-2 pt-2 border-t border-gray-100">
          <input
            value={nuevaCat}
            onChange={(e) => setNuevaCat(e.target.value)}
            placeholder="Nueva categoría..."
            className="flex-1 px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario"
            onKeyDown={(e) => e.key === 'Enter' && agregarCategoria()}
          />
          <button
            onClick={agregarCategoria}
            disabled={!nuevaCat.trim() || guardandoCat}
            className="bg-primario hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-full text-sm transition disabled:opacity-40"
          >
            {guardandoCat ? '...' : '+ Añadir'}
          </button>
        </div>
      </div>

      {/* ── PAÍSES ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h2 className="font-display font-bold text-lg text-gray-800">Países</h2>

        {/* Lista */}
        <div className="space-y-2">
          {paises.map((pais) => (
            <div key={pais.id} className="flex items-center gap-2">
              {editandoPais?.id === pais.id ? (
                <>
                  <input
                    value={editandoPais.bandera}
                    onChange={(e) => setEditandoPais({ ...editandoPais, bandera: e.target.value })}
                    placeholder="🏳️"
                    className="w-16 px-2 py-1.5 border rounded-xl text-sm text-center focus:outline-none focus:ring-2 focus:ring-primario/30"
                  />
                  <input
                    value={editandoPais.nombre}
                    onChange={(e) => setEditandoPais({ ...editandoPais, nombre: e.target.value })}
                    className="flex-1 px-3 py-1.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario"
                    onKeyDown={(e) => e.key === 'Enter' && editarPais()}
                  />
                  <button
                    onClick={editarPais}
                    disabled={guardandoPais}
                    className="px-3 py-1.5 bg-primario text-white text-sm font-semibold rounded-full transition disabled:opacity-50"
                  >
                    {guardandoPais ? '...' : 'Guardar'}
                  </button>
                  <button
                    onClick={() => setEditandoPais(null)}
                    className="px-3 py-1.5 border border-gray-200 text-gray-500 text-sm rounded-full hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm font-medium text-gray-800 bg-gray-50 px-3 py-1.5 rounded-xl flex items-center gap-2">
                    {pais.bandera && <span className="text-base">{pais.bandera}</span>}
                    {pais.nombre}
                    <span className="text-xs text-gray-400 font-normal">#{pais.id}</span>
                  </span>
                  <button
                    onClick={() => setEditandoPais(pais)}
                    className="p-1.5 text-gray-400 hover:text-primario transition"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => eliminarPais(pais)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition"
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Añadir nuevo */}
        <div className="flex gap-2 pt-2 border-t border-gray-100">
          <input
            value={nuevoPaisBandera}
            onChange={(e) => setNuevoPaisBandera(e.target.value)}
            placeholder="🏳️"
            className="w-16 px-2 py-2 border rounded-xl text-sm text-center focus:outline-none focus:ring-2 focus:ring-primario/30"
          />
          <input
            value={nuevoPaisNombre}
            onChange={(e) => setNuevoPaisNombre(e.target.value)}
            placeholder="Nombre del país..."
            className="flex-1 px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario"
            onKeyDown={(e) => e.key === 'Enter' && agregarPais()}
          />
          <button
            onClick={agregarPais}
            disabled={!nuevoPaisNombre.trim() || guardandoPais}
            className="bg-primario hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-full text-sm transition disabled:opacity-40"
          >
            {guardandoPais ? '...' : '+ Añadir'}
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-400 px-1">
        ℹ️ El ID (#id) se genera automáticamente al crear y no puede cambiarse para no romper productos existentes.
      </p>
    </div>
  );
}
