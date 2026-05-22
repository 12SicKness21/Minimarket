import { useState, useEffect } from 'react';
import {
  obtenerConfigTienda,
  guardarConfigTienda,
  guardarMensajePersonalizado,
  resetMensajePersonalizado,
  guardarRedes,
  guardarUbicacion,
  estaDentroDeHorario,
} from '../../firebase/config-tienda';

const DIAS_SEMANA = [
  { id: 'lunes', label: 'Lun' },
  { id: 'martes', label: 'Mar' },
  { id: 'miercoles', label: 'Mié' },
  { id: 'jueves', label: 'Jue' },
  { id: 'viernes', label: 'Vie' },
  { id: 'sabado', label: 'Sáb' },
  { id: 'domingo', label: 'Dom' },
];

export default function Configuracion() {
  const [form, setForm] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);

  // Mensaje temporal
  const [mensajeTemporal, setMensajeTemporal] = useState('');
  const [expiraTemporal, setExpiraTemporal] = useState('');
  const [guardandoMsg, setGuardandoMsg] = useState(false);
  const [msgGuardado, setMsgGuardado] = useState(false);

  // Redes sociales
  const REDES_DEFAULT = { instagram: { activo: false, url: '' }, tiktok: { activo: false, url: '' }, facebook: { activo: false, url: '' } };
  const [redes, setRedes] = useState(REDES_DEFAULT);
  const [guardandoRedes, setGuardandoRedes] = useState(false);
  const [redesGuardadas, setRedesGuardadas] = useState(false);

  // Ubicación
  const [ubicacion, setUbicacion] = useState({ imagenUrl: '', direccion: '', url: '' });
  const [mapaFile, setMapaFile] = useState(null);
  const [mapaPreview, setMapaPreview] = useState('');
  const [guardandoUbicacion, setGuardandoUbicacion] = useState(false);
  const [ubicacionGuardada, setUbicacionGuardada] = useState(false);

  // Preview horario
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    obtenerConfigTienda().then((cfg) => {
      setForm(cfg);
      if (cfg.redes) setRedes(cfg.redes);
      if (cfg.ubicacion) {
        setUbicacion(cfg.ubicacion);
        setMapaPreview(cfg.ubicacion.imagenUrl || '');
      }
      setMensajeTemporal(cfg.mensajePersonalizado || '');
      setExpiraTemporal(cfg.mensajePersonalizadoExpira
        ? new Date(cfg.mensajePersonalizadoExpira).toISOString().slice(0, 16)
        : '');
      setPreview(estaDentroDeHorario(cfg));
    });
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    const nuevo = { ...form, [name]: type === 'checkbox' ? checked : value };
    setForm(nuevo);
    setPreview(estaDentroDeHorario(nuevo));
  }

  function toggleDia(dia) {
    const nuevo = {
      ...form,
      diasAbierto: form.diasAbierto.includes(dia)
        ? form.diasAbierto.filter((d) => d !== dia)
        : [...form.diasAbierto, dia],
    };
    setForm(nuevo);
    setPreview(estaDentroDeHorario(nuevo));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setGuardando(true);
    await guardarConfigTienda({
      ...form,
      alertaStockUnidades: parseInt(form.alertaStockUnidades) || 10,
      alertaCaducidadDias: parseInt(form.alertaCaducidadDias) || 90,
      costoEnvioBarrio: parseFloat(form.costoEnvioBarrio) || 2,
      costoEnvioFuera: parseFloat(form.costoEnvioFuera) || 5,
    });
    setGuardando(false);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 3000);
  }

  async function handleGuardarMensaje() {
    setGuardandoMsg(true);
    const expiraISO = expiraTemporal ? new Date(expiraTemporal).toISOString() : null;
    await guardarMensajePersonalizado(mensajeTemporal, expiraISO);
    setForm((f) => ({ ...f, mensajePersonalizado: mensajeTemporal, mensajePersonalizadoExpira: expiraISO }));
    setGuardandoMsg(false);
    setMsgGuardado(true);
    setTimeout(() => setMsgGuardado(false), 3000);
  }

  async function handleGuardarRedes() {
    setGuardandoRedes(true);
    await guardarRedes(redes);
    setGuardandoRedes(false);
    setRedesGuardadas(true);
    setTimeout(() => setRedesGuardadas(false), 3000);
  }

  function handleMapaFile(e) {
    const file = e.target.files?.[0];
    if (file) {
      setMapaFile(file);
      setMapaPreview(URL.createObjectURL(file));
    }
  }

  async function handleGuardarUbicacion() {
    setGuardandoUbicacion(true);
    const imagenUrl = await guardarUbicacion(mapaFile, ubicacion);
    setUbicacion((u) => ({ ...u, imagenUrl }));
    setMapaFile(null);
    setGuardandoUbicacion(false);
    setUbicacionGuardada(true);
    setTimeout(() => setUbicacionGuardada(false), 3000);
  }

  async function handleResetMensaje() {
    await resetMensajePersonalizado();
    setMensajeTemporal('');
    setExpiraTemporal('');
    setForm((f) => ({ ...f, mensajePersonalizado: '', mensajePersonalizadoExpira: null }));
  }

  if (!form) return <p className="text-gray-400 text-center py-12">Cargando configuración...</p>;

  const tienesMensajeActivo = form.mensajePersonalizado && (
    !form.mensajePersonalizadoExpira || new Date(form.mensajePersonalizadoExpira) > new Date()
  );

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="font-display font-bold text-2xl text-gray-800">Configuración</h1>

      {/* ── Preview estado actual ── */}
      {preview && (
        <div className={`rounded-2xl px-4 py-3 flex items-center gap-3 text-sm font-medium ${preview.abierto
          ? 'bg-green-50 border border-green-200 text-green-700'
          : 'bg-amber-50 border border-amber-200 text-amber-700'
          }`}>
          <span className="text-lg">{preview.abierto ? '🟢' : '🔴'}</span>
          <span>{preview.abierto ? 'La tienda está abierta ahora mismo' : preview.mensaje}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-5">

        {/* ── Días abierto ── */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Días abierto</label>
          <div className="flex gap-1.5 flex-wrap">
            {DIAS_SEMANA.map((dia) => (
              <button
                key={dia.id}
                type="button"
                onClick={() => toggleDia(dia.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition border ${form.diasAbierto.includes(dia.id)
                  ? 'border-primario bg-green-50 text-primario'
                  : 'border-gray-200 text-gray-400 hover:border-gray-300'
                  }`}
              >
                {dia.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Turno mañana ── */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Turno mañana</label>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-400 mb-1 block">Apertura</label>
              <input
                name="horaApertura"
                type="time"
                value={form.horaApertura}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario"
              />
            </div>
            <span className="text-gray-300 mt-5">→</span>
            <div className="flex-1">
              <label className="text-xs text-gray-400 mb-1 block">Cierre</label>
              <input
                name="horaCierre"
                type="time"
                value={form.horaCierre}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario"
              />
            </div>
          </div>
        </div>

        {/* ── Turno tarde ── */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Turno tarde</label>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs text-gray-400">
                {form.tieneTurnoTarde ? 'Activado' : 'Desactivado'}
              </span>
              <button
                type="button"
                onClick={() => handleChange({ target: { name: 'tieneTurnoTarde', type: 'checkbox', checked: !form.tieneTurnoTarde } })}
                className={`w-10 h-6 rounded-full transition relative ${form.tieneTurnoTarde ? 'bg-primario' : 'bg-gray-200'}`}
              >
                <span className={`block w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${form.tieneTurnoTarde ? 'left-5' : 'left-1'}`} />
              </button>
            </label>
          </div>
          {form.tieneTurnoTarde && (
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-xs text-gray-400 mb-1 block">Apertura</label>
                <input
                  name="horaAperturaTarde"
                  type="time"
                  value={form.horaAperturaTarde}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario"
                />
              </div>
              <span className="text-gray-300 mt-5">→</span>
              <div className="flex-1">
                <label className="text-xs text-gray-400 mb-1 block">Cierre</label>
                <input
                  name="horaCierreTarde"
                  type="time"
                  value={form.horaCierreTarde}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario"
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Envíos ── */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Costos de envío</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Barrio (€)</label>
              <input name="costoEnvioBarrio" type="number" step="0.5" min="0"
                value={form.costoEnvioBarrio} onChange={handleChange}
                className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Fuera del barrio (€)</label>
              <input name="costoEnvioFuera" type="number" step="0.5" min="0"
                value={form.costoEnvioFuera} onChange={handleChange}
                className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario" />
            </div>
          </div>
        </div>

        {/* ── Alertas de inventario — comentado
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Alertas de inventario</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Stock mínimo (uds.)</label>
              <input name="alertaStockUnidades" type="number" min="0"
                value={form.alertaStockUnidades} onChange={handleChange}
                className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Caducidad (días)</label>
              <input name="alertaCaducidadDias" type="number" min="0"
                value={form.alertaCaducidadDias} onChange={handleChange}
                className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario" />
            </div>
          </div>
        </div>
        ── */}

        {/* ── Email para alertas — comentado
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Email para alertas</label>
          <input name="emailAlertas" type="email" value={form.emailAlertas} onChange={handleChange}
            placeholder="admin@ejemplo.com"
            className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario" />
        </div>
        ── */}

        {/* ── WhatsApp ── */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Número de WhatsApp</label>
          <input name="whatsapp" type="text" value={form.whatsapp || ''} onChange={handleChange}
            placeholder="Ej: 600123456"
            className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario" />
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button type="submit" disabled={guardando}
            className="bg-primario hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-full transition disabled:opacity-50">
            {guardando ? 'Guardando...' : 'Guardar configuración'}
          </button>
          {guardado && <span className="text-sm text-green-600 font-medium">✓ Guardado</span>}
        </div>
      </form>

      {/* ── Mensaje temporal ── */}
      <div className={`bg-white rounded-2xl border p-5 space-y-4 ${tienesMensajeActivo ? 'border-amber-300' : 'border-gray-100'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-800">Aviso temporal de cierre</h2>

          </div>
          {tienesMensajeActivo && (
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
              Activo ahora
            </span>
          )}
        </div>

        {/* Mensaje */}
        <div>
          <label className="text-xs text-gray-500 font-medium mb-1 block">Mensaje a mostrar</label>
          <input
            type="text"
            value={mensajeTemporal}
            onChange={(e) => setMensajeTemporal(e.target.value)}
            placeholder='Ej: "Cerrado porque me da la gana hasta las 18:00. ¡Disculpa!"'
            className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400"
            maxLength={120}
          />
          <p className="text-xs text-gray-300 mt-1 text-right">{mensajeTemporal.length}/120</p>
        </div>

        {/* Expiración */}
        <div>
          <label className="text-xs text-gray-500 font-medium mb-1 block">
            Volver al mensaje predeterminado el… <span className="text-gray-300">(opcional)</span>
          </label>
          <input
            type="datetime-local"
            value={expiraTemporal}
            onChange={(e) => setExpiraTemporal(e.target.value)}
            className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400"
          />
          <p className="text-xs text-gray-400 mt-1">
            Si lo dejas vacío, el mensaje se mantiene hasta que lo resetees manualmente.
          </p>
        </div>

        {/* Botones */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleGuardarMensaje}
            disabled={!mensajeTemporal.trim() || guardandoMsg}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-2.5 rounded-full text-sm transition disabled:opacity-40"
          >
            {guardandoMsg ? 'Guardando...' : 'Publicar aviso'}
          </button>

          {(tienesMensajeActivo || mensajeTemporal) && (
            <button
              type="button"
              onClick={handleResetMensaje}
              className="text-sm text-red-500 hover:text-red-700 font-medium hover:underline transition"
            >
              Resetear al predeterminado
            </button>
          )}

          {msgGuardado && <span className="text-sm text-amber-600 font-medium">✓ Aviso publicado</span>}
        </div>

        {/* Preview del mensaje */}
        {mensajeTemporal.trim() && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 flex items-center gap-2">
            <span>🔔</span>
            <span>{mensajeTemporal}</span>
          </div>
        )}
      </div>
      {/* ── Redes Sociales ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h2 className="font-semibold text-gray-800">Redes sociales</h2>

        {[
          { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/tutienda' },
          { key: 'tiktok',    label: 'TikTok',    placeholder: 'https://tiktok.com/@tutienda'  },
          { key: 'facebook',  label: 'Facebook',  placeholder: 'https://facebook.com/tutienda' },
        ].map(({ key, label, placeholder }) => (
          <div key={key} className="flex items-center gap-3">
            {/* Toggle */}
            <button
              type="button"
              onClick={() => setRedes((r) => ({ ...r, [key]: { ...r[key], activo: !r[key].activo } }))}
              className={`relative shrink-0 w-10 h-6 rounded-full transition-colors ${redes[key].activo ? 'bg-primario' : 'bg-gray-200'}`}
            >
              <span className={`block w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm ${redes[key].activo ? 'left-5' : 'left-1'}`} />
            </button>
            <div className="flex-1">
              <label className="text-xs text-gray-500 font-medium block mb-0.5">{label}</label>
              <input
                type="url"
                value={redes[key].url}
                onChange={(e) => setRedes((r) => ({ ...r, [key]: { ...r[key], url: e.target.value } }))}
                placeholder={placeholder}
                disabled={!redes[key].activo}
                className="w-full px-3 py-1.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario disabled:bg-gray-50 disabled:text-gray-300"
              />
            </div>
          </div>
        ))}

        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleGuardarRedes}
            disabled={guardandoRedes}
            className="bg-primario hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-full transition disabled:opacity-50 text-sm"
          >
            {guardandoRedes ? 'Guardando...' : 'Guardar redes'}
          </button>
          {redesGuardadas && <span className="text-sm text-green-600 font-medium">✓ Guardado</span>}
        </div>
      </div>

      {/* ── Ubicación ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h2 className="font-semibold text-gray-800">Ubicación</h2>

        {/* Imagen del mapa */}
        <div>
          <label className="text-xs text-gray-500 font-medium block mb-2">Imagen del mapa (captura de Google Maps)</label>
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="w-24 h-24 shrink-0 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden hover:border-primario transition">
              {mapaPreview
                ? <img src={mapaPreview} alt="Mapa" className="w-full h-full object-cover" />
                : <span className="text-2xl">🗺️</span>
              }
            </div>
            <div className="text-sm text-gray-500">
              <span className="text-primario font-medium">Toca para subir</span> la captura del mapa
              <p className="text-xs text-gray-400 mt-0.5">JPG o PNG · máx. 5 MB</p>
            </div>
            <input type="file" accept="image/*" onChange={handleMapaFile} className="sr-only" />
          </label>
        </div>

        {/* Dirección */}
        <div>
          <label className="text-xs text-gray-500 font-medium block mb-1">Dirección de la tienda</label>
          <input
            type="text"
            value={ubicacion.direccion}
            onChange={(e) => setUbicacion((u) => ({ ...u, direccion: e.target.value }))}
            placeholder="Ej: Calle Mayor 12, 28001 Madrid"
            className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario"
          />
        </div>

        {/* URL de Google Maps */}
        <div>
          <label className="text-xs text-gray-500 font-medium block mb-1">URL de Google Maps (botón "Cómo llegar")</label>
          <input
            type="url"
            value={ubicacion.url}
            onChange={(e) => setUbicacion((u) => ({ ...u, url: e.target.value }))}
            placeholder="https://maps.google.com/?q=..."
            className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario"
          />
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleGuardarUbicacion}
            disabled={guardandoUbicacion}
            className="bg-primario hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-full transition disabled:opacity-50 text-sm"
          >
            {guardandoUbicacion ? 'Guardando...' : 'Guardar ubicación'}
          </button>
          {ubicacionGuardada && <span className="text-sm text-green-600 font-medium">✓ Guardado</span>}
        </div>
      </div>

    </div>
  );
}
