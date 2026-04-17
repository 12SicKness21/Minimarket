import { useState, useEffect } from 'react';
import { obtenerTodosCombos, crearCombo, actualizarCombo } from '../../firebase/combos';
import { formatPrecio } from '../../shared/utils/formatters';
import ComboForm from '../components/ComboForm';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';

export default function Combos() {
  const [combos, setCombos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [comboEditando, setComboEditando] = useState(null);
  const [guardando, setGuardando] = useState(false);

  async function cargar() {
    setCargando(true);
    const data = await obtenerTodosCombos();
    setCombos(data);
    setCargando(false);
  }

  useEffect(() => { cargar(); }, []);

  async function handleGuardar(data, imagen) {
    setGuardando(true);
    if (comboEditando) {
      await actualizarCombo(comboEditando.id, data, imagen);
    } else {
      await crearCombo(data, imagen);
    }
    setGuardando(false);
    setModalAbierto(false);
    setComboEditando(null);
    cargar();
  }

  async function toggleActivo(id, valorActual) {
    await updateDoc(doc(db, 'combos', id), { activo: !valorActual });
    setCombos((prev) => prev.map((c) => (c.id === id ? { ...c, activo: !valorActual } : c)));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl text-gray-800">Combos</h1>
        <button
          onClick={() => { setComboEditando(null); setModalAbierto(true); }}
          className="bg-primario hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-full text-sm transition"
        >
          + Nuevo combo
        </button>
      </div>

      {cargando ? (
        <p className="text-gray-400 text-center py-12">Cargando combos...</p>
      ) : combos.length === 0 ? (
        <p className="text-gray-400 text-center py-12">No hay combos creados.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {combos.map((combo) => (
            <div key={combo.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-green-400 to-primario flex items-center justify-center p-6 text-center">
                <span className="font-display font-black text-3xl md:text-4xl text-white drop-shadow-lg leading-tight tracking-wide">
                  {combo.nombre}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-display font-bold text-lg text-gray-800">{combo.nombre}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">{combo.descripcion}</p>
                <div className="flex flex-col mt-2">
                  {combo.descuento > 0 && (
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded w-fit mb-1 border border-green-100">
                      Ahorro: {formatPrecio(combo.descuento)}
                    </span>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-xl text-primario">{formatPrecio(combo.precioTotal)}</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleActivo(combo.id, combo.activo)}
                        className={`w-8 h-5 rounded-full transition ${combo.activo ? 'bg-primario' : 'bg-gray-200'} relative`}
                      >
                        <span className={`block w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${combo.activo ? 'left-4' : 'left-0.5'}`} />
                      </button>
                      <button
                        onClick={() => { setComboEditando(combo); setModalAbierto(true); }}
                        className="text-primario text-xs font-semibold hover:underline"
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalAbierto && (
        <ComboForm
          combo={comboEditando}
          onGuardar={handleGuardar}
          onCerrar={() => { setModalAbierto(false); setComboEditando(null); }}
          guardando={guardando}
        />
      )}
    </div>
  );
}
