import { useState, useEffect, useRef } from 'react';
import {
  obtenerConfigTienda,
  guardarConfigTienda,
  guardarMensajePersonalizado,
  resetMensajePersonalizado,
  guardarRedes,
  guardarUbicacion,
  estaDentroDeHorario,
  obtenerServicios,
  guardarServicios,
  subirLogoServicio,
  SERVICIOS_DEFAULTS,
  obtenerImagenesLocal,
  guardarImagenesLocal,
  subirImagenLocal,
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

  // Servicios
  const [servicios, setServicios] = useState(null);
  const [guardandoServicios, setGuardandoServicios] = useState(false);
  const [serviciosGuardados, setServiciosGuardados] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoFile, setNuevoFile] = useState(null);
  const [nuevoPreview, setNuevoPreview] = useState('');
  const [agregando, setAgregando] = useState(false);
  const nuevoInputRef = useRef(null);

  // Galería del local
  const [galeria, setGaleria] = useState(null);
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const galeriaInputRef = useRef(null);

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
    obtenerServicios().then(setServicios);
    obtenerImagenesLocal().then(setGaleria);
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

  // ── Handlers servicios ──
  async function toggleServicio(id) {
    const nuevos = servicios.map((s) => s.id === id ? { ...s, activo: !s.activo } : s);
    setServicios(nuevos);
    await guardarServicios(nuevos);
  }

  async function eliminarServicio(id) {
    const nuevos = servicios.filter((s) => s.id !== id);
    setServicios(nuevos);
    await guardarServicios(nuevos);
  }

  function handleNuevoFile(e) {
    const file = e.target.files?.[0];
    if (file) {
      setNuevoFile(file);
      setNuevoPreview(URL.createObjectURL(file));
    }
  }

  async function handleAgregarServicio() {
    if (!nuevoNombre.trim() || !nuevoFile) return;
    setAgregando(true);
    const logoUrl = await subirLogoServicio(nuevoFile, nuevoNombre.trim());
    const nuevo = {
      id: `custom_${Date.now()}`,
      nombre: nuevoNombre.trim(),
      logoUrl,
      activo: true,
    };
    const nuevos = [...(servicios || []), nuevo];
    setServicios(nuevos);
    await guardarServicios(nuevos);
    setNuevoNombre('');
    setNuevoFile(null);
    setNuevoPreview('');
    if (nuevoInputRef.current) nuevoInputRef.current.value = '';
    setAgregando(false);
  }

  async function handleGuardarServicios() {
    setGuardandoServicios(true);
    await guardarServicios(servicios);
    setGuardandoServicios(false);
    setServiciosGuardados(true);
    setTimeout(() => setServiciosGuardados(false), 3000);
  }

  async function resetearServiciosDefault() {
    setServicios(SERVICIOS_DEFAULTS);
    await guardarServicios(SERVICIOS_DEFAULTS);
  }

  // ── Handlers galería ──
  async function handleSubirFoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubiendoFoto(true);
    const item = await subirImagenLocal(file);
    const nuevas = [...(galeria || []), item];
    setGaleria(nuevas);
    await guardarImagenesLocal(nuevas);
    setSubiendoFoto(false);
    if (galeriaInputRef.current) galeriaInputRef.current.value = '';
  }

  async function handleEliminarFoto(id) {
    const nuevas = galeria.filter((img) => img.id !== id);
    setGaleria(nuevas);
    await guardarImagenesLocal(nuevas);
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

      {/* ── Imágenes del local ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h2 className="font-semibold text-gray-800">Imágenes del local</h2>
        <p className="text-xs text-gray-400">
          Estas imágenes se muestran en "Imágenes nuestras" del menú de la tienda.
        </p>

        {!galeria ? (
          <p className="text-sm text-gray-400">Cargando...</p>
        ) : (
          <>
            {/* Cuadrícula de fotos existentes */}
            {galeria.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {galeria.map((img) => (
                  <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={img.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    {/* Botón eliminar al hacer hover */}
                    <button
                      type="button"
                      onClick={() => handleEliminarFoto(img.id)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                      title="Eliminar"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {galeria.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">Sin imágenes todavía.</p>
            )}

            {/* Botón subir nueva foto */}
            <label className="cursor-pointer flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-primario hover:bg-green-50 transition text-sm font-medium text-gray-500 hover:text-primario">
              {subiendoFoto ? (
                'Subiendo...'
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Agregar foto
                </>
              )}
              <input
                ref={galeriaInputRef}
                type="file"
                accept="image/*"
                onChange={handleSubirFoto}
                disabled={subiendoFoto}
                className="sr-only"
              />
            </label>
          </>
        )}
      </div>

      {/* ── Otros Servicios ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Otros Servicios</h2>
          <button
            type="button"
            onClick={resetearServiciosDefault}
            className="text-xs text-gray-400 hover:text-gray-600 underline transition"
          >
            Restaurar predeterminados
          </button>
        </div>

        {!servicios ? (
          <p className="text-sm text-gray-400">Cargando...</p>
        ) : (
          <>
            {/* Lista de servicios */}
            <div className="space-y-2">
              {servicios.map((s) => (
                <div key={s.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  {/* Toggle activo */}
                  <button
                    type="button"
                    onClick={() => toggleServicio(s.id)}
                    className={`relative shrink-0 w-9 h-5 rounded-full transition-colors ${s.activo ? 'bg-primario' : 'bg-gray-200'}`}
                  >
                    <span className={`block w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${s.activo ? 'left-4' : 'left-0.5'}`} />
                  </button>

                  {/* Logo */}
                  <div className="w-12 h-8 flex items-center justify-center shrink-0">
                    <img
                      src={s.logoUrl}
                      alt={s.nombre}
                      className="max-h-7 max-w-full w-auto object-contain"
                      style={{ opacity: s.activo ? 1 : 0.35 }}
                    />
                  </div>

                  {/* Nombre */}
                  <span className={`flex-1 text-sm ${s.activo ? 'text-gray-800' : 'text-gray-400'}`}>
                    {s.nombre}
                  </span>

                  {/* Eliminar */}
                  <button
                    type="button"
                    onClick={() => eliminarServicio(s.id)}
                    className="shrink-0 p-1.5 rounded-full hover:bg-red-50 text-gray-300 hover:text-red-500 transition"
                    title="Eliminar"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Guardar cambios de toggles */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleGuardarServicios}
                disabled={guardandoServicios}
                className="bg-primario hover:bg-green-700 text-white font-bold px-5 py-2 rounded-full text-sm transition disabled:opacity-50"
              >
                {guardandoServicios ? 'Guardando...' : 'Guardar cambios'}
              </button>
              {serviciosGuardados && <span className="text-sm text-green-600 font-medium">✓ Guardado</span>}
            </div>

            {/* Agregar nuevo servicio */}
            <div className="border-t border-gray-100 pt-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">Agregar servicio</h3>

              <div className="flex items-center gap-3">
                {/* Preview logo */}
                <label className="cursor-pointer shrink-0">
                  <div className="w-16 h-12 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden hover:border-primario transition">
                    {nuevoPreview
                      ? <img src={nuevoPreview} alt="preview" className="max-h-10 max-w-full object-contain" />
                      : <span className="text-xl">🖼️</span>
                    }
                  </div>
                  <input
                    ref={nuevoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleNuevoFile}
                    className="sr-only"
                  />
                </label>

                {/* Nombre */}
                <input
                  type="text"
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  placeholder="Nombre del servicio"
                  maxLength={40}
                  className="flex-1 px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario"
                />
              </div>

              <button
                type="button"
                onClick={handleAgregarServicio}
                disabled={agregando || !nuevoNombre.trim() || !nuevoFile}
                className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-5 py-2 rounded-full text-sm transition disabled:opacity-40"
              >
                {agregando ? 'Subiendo...' : '+ Agregar'}
              </button>
            </div>
          </>
        )}
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
          <label className="text-xs text-gray-500 font-medium block mb-1">URL de Google Maps</label>
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
