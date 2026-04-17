import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './config';

const DOC_REF = doc(db, 'configuracion', 'catalogos');

export const CATEGORIAS_DEFAULT = [
  { id: 'harinas', label: 'Harinas' },
  { id: 'bebidas', label: 'Bebidas' },
  { id: 'lacteos', label: 'Lácteos' },
  { id: 'snacks', label: 'Snacks' },
  { id: 'conservas', label: 'Conservas' },
  { id: 'limpieza', label: 'Limpieza' },
  { id: 'otros', label: 'Otros' },
];

export const PAISES_DEFAULT = [
  { id: 'venezuela', nombre: 'Venezuela', bandera: '🇻🇪' },
  { id: 'colombia', nombre: 'Colombia', bandera: '🇨🇴' },
  { id: 'peru', nombre: 'Perú', bandera: '🇵🇪' },
  { id: 'ecuador', nombre: 'Ecuador', bandera: '🇪🇨' },
  { id: 'republica_dominicana', nombre: 'Rep. Dominicana', bandera: '🇩🇴' },
  { id: 'cuba', nombre: 'Cuba', bandera: '🇨🇺' },
  { id: 'general', nombre: 'General', bandera: '' },
];

export async function obtenerCatalogos() {
  const snap = await getDoc(DOC_REF);
  if (!snap.exists()) return { categorias: CATEGORIAS_DEFAULT, paises: PAISES_DEFAULT };
  const data = snap.data();
  return {
    categorias: data.categorias?.length ? data.categorias : CATEGORIAS_DEFAULT,
    paises: data.paises?.length ? data.paises : PAISES_DEFAULT,
  };
}

export async function guardarCatalogos({ categorias, paises }) {
  await setDoc(DOC_REF, { categorias, paises }, { merge: true });
}

export async function contarProductosConCategoria(categoriaId) {
  const q = query(collection(db, 'productos'), where('categoria', '==', categoriaId));
  const snap = await getDocs(q);
  return snap.size;
}

export async function contarProductosConPais(paisId) {
  const q = query(collection(db, 'productos'), where('paises', 'array-contains', paisId));
  const snap = await getDocs(q);
  return snap.size;
}

// Convierte texto a ID slug: "Recién Llegado" → "recien_llegado"
export function slugify(str) {
  return str
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}
