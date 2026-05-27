import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import { db, storage } from './config';

const COLECCION = 'combos';

export async function obtenerCombosActivos() {
  const q = query(collection(db, COLECCION), where('activo', '==', true));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => {
      const fa = a.creadoEn?.toMillis?.() || 0;
      const fb = b.creadoEn?.toMillis?.() || 0;
      return fb - fa;
    });
}

export async function obtenerTodosCombos() {
  const snapshot = await getDocs(collection(db, COLECCION));
  return snapshot.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => {
      const fa = a.creadoEn?.toMillis?.() || 0;
      const fb = b.creadoEn?.toMillis?.() || 0;
      return fb - fa;
    });
}

export async function crearCombo(data, imagenFile) {
  const docRef = await addDoc(collection(db, COLECCION), {
    ...data,
    imagenUrl: '',
    creadoEn: serverTimestamp(),
  });

  if (imagenFile) {
    const url = await subirImagenCombo(docRef.id, imagenFile);
    await updateDoc(docRef, { imagenUrl: url });
  }

  return docRef.id;
}

export async function actualizarCombo(id, data, imagenFile) {
  const docRef = doc(db, COLECCION, id);
  await updateDoc(docRef, data);

  if (imagenFile) {
    const url = await subirImagenCombo(id, imagenFile);
    await updateDoc(docRef, { imagenUrl: url });
  }
}

async function subirImagenCombo(comboId, file) {
  // Comprime en dos pasos: primero reducción agresiva de resolución,
  // luego calidad — permite manejar fuentes de hasta ~80 MB
  const opciones = {
    maxWidthOrHeight: 1200,
    maxSizeMB: 1,
    initialQuality: 0.7,
    useWebWorker: true,
    fileType: 'image/webp',
  };
  const comprimida = await imageCompression(file, opciones);
  const storageRef = ref(storage, `combos/${comboId}/imagen.webp`);
  await uploadBytes(storageRef, comprimida);
  return getDownloadURL(storageRef);
}
