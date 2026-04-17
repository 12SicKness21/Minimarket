import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './config';

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
