import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import { db, storage } from './config';

const COLECCION = 'productos';

function generarSKU(categoria) {
  const prefijo = (categoria || 'GEN').slice(0, 3).toUpperCase();
  const sufijo = Date.now().toString().slice(-6);
  return `${prefijo}-${sufijo}`;
}

export async function obtenerProductos({ paises, categoria } = {}) {
  // Consulta simple sin indices compuestos — filtrado y orden client-side
  const q = query(collection(db, COLECCION), where('activo', '==', true));
  const snapshot = await getDocs(q);

  let productos = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

  // Filtrar por paises client-side
  if (paises && paises.length > 0) {
    productos = productos.filter((p) =>
      p.paises?.some((pais) => paises.includes(pais))
    );
  }

  // Filtrar por categoria client-side
  if (categoria) {
    productos = productos.filter((p) => p.categoria === categoria);
  }

  // Ordenar por fecha de creacion (mas recientes primero)
  productos.sort((a, b) => {
    const fa = a.creadoEn?.toMillis?.() || 0;
    const fb = b.creadoEn?.toMillis?.() || 0;
    return fb - fa;
  });

  return { productos, ultimoDoc: null };
}

export async function obtenerRecienLlegados() {
  // Consulta simple: solo filtra por activo, luego filtra recienLlegado client-side
  const q = query(collection(db, COLECCION), where('activo', '==', true));
  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((p) => p.recienLlegado)
    .sort((a, b) => {
      const fa = a.actualizadoEn?.toMillis?.() || a.creadoEn?.toMillis?.() || 0;
      const fb = b.actualizadoEn?.toMillis?.() || b.creadoEn?.toMillis?.() || 0;
      return fb - fa;
    })
    .slice(0, 12);
}

export async function obtenerProductoPorId(id) {
  const snap = await getDoc(doc(db, COLECCION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function obtenerTodosProductos() {
  const snapshot = await getDocs(collection(db, COLECCION));
  return snapshot.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));
}

export async function crearProducto(data, imagenFile) {
  const docRef = await addDoc(collection(db, COLECCION), {
    ...data,
    imagenUrl: data.imagenUrl || '',
    sku: generarSKU(data.categoria),
    creadoEn: serverTimestamp(),
    actualizadoEn: serverTimestamp(),
  });

  if (imagenFile) {
    const url = await subirImagen(docRef.id, imagenFile);
    await updateDoc(docRef, { imagenUrl: url });
  }

  return docRef.id;
}

export async function actualizarProducto(id, data, imagenFile) {
  const docRef = doc(db, COLECCION, id);
  await updateDoc(docRef, {
    ...data,
    actualizadoEn: serverTimestamp(),
  });

  if (imagenFile) {
    const url = await subirImagen(id, imagenFile);
    await updateDoc(docRef, { imagenUrl: url });
  }
}

async function subirImagen(productoId, file) {
  const opciones = {
    maxWidthOrHeight: 800,
    maxSizeMB: 0.5,
    useWebWorker: true,
    fileType: 'image/webp'
  };
  const comprimida = await imageCompression(file, opciones);
  const storageRef = ref(storage, `productos/${productoId}/imagen.webp`);
  await uploadBytes(storageRef, comprimida);
  return getDownloadURL(storageRef);
}
