import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import { db, storage } from './config';

// ─── Servicios ───────────────────────────────────────────────────────────────

const SERVICIOS_REF = doc(db, 'configuracion', 'servicios');

export const SERVICIOS_DEFAULTS = [
  { id: 'amazon-hub', nombre: 'Amazon Hub',    logoUrl: '/servicios/Amazon Hub.avif', activo: true },
  { id: 'ctt',        nombre: 'CTT',           logoUrl: '/servicios/CTT.webp',        activo: true },
  { id: 'correos',    nombre: 'Correos',        logoUrl: '/servicios/Correos.png',     activo: true },
  { id: 'eco',        nombre: 'ECO',            logoUrl: '/servicios/ECO.avif',        activo: true },
  { id: 'gls',        nombre: 'GLS',            logoUrl: '/servicios/GLS.avif',        activo: true },
  { id: 'impresion',  nombre: 'Impresión',      logoUrl: '/servicios/Impresion.avif',  activo: true },
  { id: 'lebara',     nombre: 'Lebara',         logoUrl: '/servicios/LEBARA.png',      activo: true },
  { id: 'masmovil',   nombre: 'MásMóvil',       logoUrl: '/servicios/MASMOVIL.jpg',    activo: true },
  { id: 'mrw',        nombre: 'MRW',            logoUrl: '/servicios/MRW.webp',        activo: true },
  { id: 'orange',     nombre: 'Orange',         logoUrl: '/servicios/ORANGE.png',      activo: true },
  { id: 'ria',        nombre: 'RIA',            logoUrl: '/servicios/RIA.avif',        activo: true },
  { id: 'seur',       nombre: 'SEUR',           logoUrl: '/servicios/SEUR.avif',       activo: true },
  { id: 'tipsa',      nombre: 'TIPSA',          logoUrl: '/servicios/TIPSA.png',       activo: true },
  { id: 'wu',         nombre: 'Western Union',  logoUrl: '/servicios/WU.png',          activo: true },
];

export async function obtenerServicios() {
  const snap = await getDoc(SERVICIOS_REF);
  if (!snap.exists() || !snap.data()?.items?.length) return SERVICIOS_DEFAULTS;
  return snap.data().items;
}

export async function guardarServicios(items) {
  await setDoc(SERVICIOS_REF, { items });
}

export async function subirLogoServicio(file, nombre) {
  const comp = await imageCompression(file, {
    maxSizeMB: 0.3,
    maxWidthOrHeight: 400,
    useWebWorker: true,
  });
  const storageRef = ref(storage, `configuracion/servicios/${nombre.replace(/\s+/g, '_')}`);
  await uploadBytes(storageRef, comp);
  return await getDownloadURL(storageRef);
}

const DOC_REF = doc(db, 'configuracion', 'tienda');

export const DEFAULTS = {
  alertaStockUnidades: 10,
  alertaCaducidadDias: 90,
  costoEnvioBarrio: 2,
  costoEnvioFuera: 5,
  horaApertura: '09:00',
  horaCierre: '14:00',
  tieneTurnoTarde: true,
  horaAperturaTarde: '17:00',
  horaCierreTarde: '21:00',
  diasAbierto: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'],
  emailAlertas: '',
  mensajePersonalizado: '',
  mensajePersonalizadoExpira: null, // ISO string o null
  redes: {
    instagram: { activo: false, url: '' },
    tiktok:    { activo: false, url: '' },
    facebook:  { activo: false, url: '' },
  },
  ubicacion: {
    imagenUrl: '',
    direccion: '',
    url: '',
  },
};

export async function obtenerConfigTienda() {
  const snap = await getDoc(DOC_REF);
  if (!snap.exists()) return DEFAULTS;
  return { ...DEFAULTS, ...snap.data() };
}

export async function guardarConfigTienda(data) {
  await setDoc(DOC_REF, data, { merge: true });
}

export async function guardarMensajePersonalizado(mensaje, expiraISO) {
  await updateDoc(DOC_REF, {
    mensajePersonalizado: mensaje,
    mensajePersonalizadoExpira: expiraISO || null,
  });
}

export async function guardarRedes(redes) {
  await updateDoc(DOC_REF, { redes });
}

export async function guardarUbicacion(imagenFile, datos) {
  let imagenUrl = datos.imagenUrl || '';
  if (imagenFile) {
    const comp = await imageCompression(imagenFile, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
    });
    const storageRef = ref(storage, 'configuracion/mapa');
    await uploadBytes(storageRef, comp);
    imagenUrl = await getDownloadURL(storageRef);
  }
  const ubicacion = { ...datos, imagenUrl };
  await updateDoc(DOC_REF, { ubicacion });
  return imagenUrl;
}

export async function resetMensajePersonalizado() {
  await updateDoc(DOC_REF, {
    mensajePersonalizado: '',
    mensajePersonalizadoExpira: null,
  });
}

// ─── Lógica de horario ───────────────────────────────────────────────────────

const DIAS_ES = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
const DIAS_LABEL = {
  lunes: 'el lunes', martes: 'el martes', miercoles: 'el miércoles',
  jueves: 'el jueves', viernes: 'el viernes', sabado: 'el sábado', domingo: 'el domingo',
};

function minutosDeHora(horaStr) {
  const [h, m] = horaStr.split(':').map(Number);
  return h * 60 + m;
}

function proximoDiaAbierto(diasAbierto, desdeIndice) {
  for (let i = 1; i <= 7; i++) {
    const idx = (desdeIndice + i) % 7;
    if (diasAbierto.includes(DIAS_ES[idx])) return DIAS_ES[idx];
  }
  return diasAbierto[0] || 'lunes';
}

export function estaDentroDeHorario(config) {
  const ahora = new Date();
  const diaActual = DIAS_ES[ahora.getDay()];
  const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();

  // ── Mensaje personalizado vigente ──
  if (config.mensajePersonalizado) {
    const expira = config.mensajePersonalizadoExpira;
    if (!expira || new Date(expira) > ahora) {
      return { abierto: false, mensaje: config.mensajePersonalizado, esPersonalizado: true };
    }
    // Expiró — se ignora (debería haberse limpiado ya)
  }

  // ── Día cerrado ──
  if (!config.diasAbierto.includes(diaActual)) {
    const proximo = proximoDiaAbierto(config.diasAbierto, ahora.getDay());
    return {
      abierto: false,
      mensaje: `Hoy no abrimos. Volvemos ${DIAS_LABEL[proximo]} a las ${config.horaApertura}`,
      esPersonalizado: false,
    };
  }

  const aperturaMañana = minutosDeHora(config.horaApertura);
  const cierreMañana = minutosDeHora(config.horaCierre);
  const aperturaTarde = config.tieneTurnoTarde ? minutosDeHora(config.horaAperturaTarde) : null;
  const cierreTarde = config.tieneTurnoTarde ? minutosDeHora(config.horaCierreTarde) : null;

  // Dentro del turno de mañana
  if (minutosAhora >= aperturaMañana && minutosAhora < cierreMañana) {
    return { abierto: true, mensaje: '' };
  }

  // Dentro del turno de tarde (si existe)
  if (aperturaTarde !== null && minutosAhora >= aperturaTarde && minutosAhora < cierreTarde) {
    return { abierto: true, mensaje: '' };
  }

  // Antes de abrir por la mañana
  if (minutosAhora < aperturaMañana) {
    return {
      abierto: false,
      mensaje: `Abrimos hoy a las ${config.horaApertura}`,
      esPersonalizado: false,
    };
  }

  // Entre turno mañana y turno tarde (pausa del mediodía)
  if (aperturaTarde !== null && minutosAhora >= cierreMañana && minutosAhora < aperturaTarde) {
    return {
      abierto: false,
      mensaje: `Volvemos hoy a las ${config.horaAperturaTarde} 🕔`,
      esPersonalizado: false,
    };
  }

  // Después del cierre del día
  const proximo = proximoDiaAbierto(config.diasAbierto, ahora.getDay());
  const mismodia = proximo === diaActual; // si solo abre un día
  return {
    abierto: false,
    mensaje: `Volvemos ${mismodia ? 'mañana' : DIAS_LABEL[proximo]} a las ${config.horaApertura}`,
    esPersonalizado: false,
  };
}
