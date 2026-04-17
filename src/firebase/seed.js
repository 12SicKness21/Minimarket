import { collection, addDoc, doc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from './config';

const productosEjemplo = [
  {
    nombre: 'Harina PAN 1kg',
    descripcion: 'Harina de maíz precocida para arepas',
    precio: 2.5,
    categoria: 'harinas',
    paises: ['venezuela'],
    imagenUrl: '',
    stockActual: 50,
    activo: true,
    recienLlegado: true,
    fechaCaducidad: Timestamp.fromDate(new Date('2026-12-01')),
    keywords: ['harina', 'pan', 'arepa', 'maiz', 'venezolano'],
  },
  {
    nombre: 'Malta Polar',
    descripcion: 'Bebida de malta venezolana 355ml',
    precio: 1.8,
    categoria: 'bebidas',
    paises: ['venezuela'],
    imagenUrl: '',
    stockActual: 30,
    activo: true,
    recienLlegado: true,
    fechaCaducidad: Timestamp.fromDate(new Date('2026-08-15')),
    keywords: ['malta', 'polar', 'bebida', 'venezolano'],
  },
  {
    nombre: 'Café Juan Valdez 250g',
    descripcion: 'Café colombiano premium molido',
    precio: 5.9,
    categoria: 'bebidas',
    paises: ['colombia'],
    imagenUrl: '',
    stockActual: 20,
    activo: true,
    recienLlegado: false,
    fechaCaducidad: Timestamp.fromDate(new Date('2027-03-01')),
    keywords: ['cafe', 'juan valdez', 'colombiano', 'molido'],
  },
  {
    nombre: 'Inca Kola 500ml',
    descripcion: 'Refresco peruano con sabor a hierba luisa',
    precio: 2.2,
    categoria: 'bebidas',
    paises: ['peru'],
    imagenUrl: '',
    stockActual: 40,
    activo: true,
    recienLlegado: true,
    fechaCaducidad: Timestamp.fromDate(new Date('2026-10-01')),
    keywords: ['inca', 'kola', 'refresco', 'peruano'],
  },
  {
    nombre: 'Salsa Valentina 370ml',
    descripcion: 'Salsa picante mexicana',
    precio: 2.0,
    categoria: 'conservas',
    paises: ['mexico'],
    imagenUrl: '',
    stockActual: 25,
    activo: true,
    recienLlegado: false,
    fechaCaducidad: Timestamp.fromDate(new Date('2027-06-01')),
    keywords: ['salsa', 'valentina', 'picante', 'mexicano'],
  },
  {
    nombre: 'Leche condensada La Lechera 397g',
    descripcion: 'Leche condensada azucarada',
    precio: 2.8,
    categoria: 'lacteos',
    paises: ['general'],
    imagenUrl: '',
    stockActual: 35,
    activo: true,
    recienLlegado: false,
    fechaCaducidad: Timestamp.fromDate(new Date('2027-01-15')),
    keywords: ['leche', 'condensada', 'lechera', 'dulce'],
  },
  {
    nombre: 'Platanitos Mayte',
    descripcion: 'Chips de plátano dulce ecuatoriano',
    precio: 1.5,
    categoria: 'snacks',
    paises: ['ecuador'],
    imagenUrl: '',
    stockActual: 60,
    activo: true,
    recienLlegado: true,
    fechaCaducidad: Timestamp.fromDate(new Date('2026-09-01')),
    keywords: ['platanitos', 'chips', 'platano', 'ecuatoriano', 'snack'],
  },
  {
    nombre: 'Mama Juana mix 500ml',
    descripcion: 'Mezcla tradicional dominicana de hierbas',
    precio: 8.5,
    categoria: 'bebidas',
    paises: ['republica_dominicana'],
    imagenUrl: '',
    stockActual: 10,
    activo: true,
    recienLlegado: false,
    fechaCaducidad: null,
    keywords: ['mama juana', 'dominicano', 'hierbas', 'bebida'],
  },
  {
    nombre: 'Café Cubita 250g',
    descripcion: 'Café cubano tostado y molido',
    precio: 4.5,
    categoria: 'bebidas',
    paises: ['cuba'],
    imagenUrl: '',
    stockActual: 15,
    activo: true,
    recienLlegado: false,
    fechaCaducidad: Timestamp.fromDate(new Date('2027-02-01')),
    keywords: ['cafe', 'cubita', 'cubano', 'molido'],
  },
  {
    nombre: 'Fabuloso Lavanda 1L',
    descripcion: 'Limpiador multiusos aroma lavanda',
    precio: 3.2,
    categoria: 'limpieza',
    paises: ['mexico', 'general'],
    imagenUrl: '',
    stockActual: 8,
    activo: true,
    recienLlegado: false,
    fechaCaducidad: null,
    keywords: ['fabuloso', 'limpiador', 'lavanda', 'limpieza'],
  },
];

const combosEjemplo = [
  {
    nombre: 'Combo Arepero',
    descripcion: 'Todo lo que necesitas para hacer arepas en casa',
    imagenUrl: '',
    precioTotal: 0, // se calcula después
    productos: [],   // se llena con IDs reales
    activo: true,
  },
  {
    nombre: 'Combo Cafetero',
    descripcion: 'Selección de cafés latinoamericanos',
    imagenUrl: '',
    precioTotal: 0,
    productos: [],
    activo: true,
  },
];

export async function ejecutarSeed() {
  const idsProductos = [];

  for (const producto of productosEjemplo) {
    const docRef = await addDoc(collection(db, 'productos'), {
      ...producto,
      creadoEn: serverTimestamp(),
      actualizadoEn: serverTimestamp(),
    });
    idsProductos.push({ id: docRef.id, nombre: producto.nombre, precio: producto.precio });
  }

  // Combo Arepero: Harina PAN + Malta Polar
  const comboArepero = {
    ...combosEjemplo[0],
    productos: [
      { productoId: idsProductos[0].id, cantidad: 2 },
      { productoId: idsProductos[1].id, cantidad: 3 },
    ],
    precioTotal: idsProductos[0].precio * 2 + idsProductos[1].precio * 3,
  };

  // Combo Cafetero: Café Juan Valdez + Café Cubita
  const comboCafetero = {
    ...combosEjemplo[1],
    productos: [
      { productoId: idsProductos[2].id, cantidad: 1 },
      { productoId: idsProductos[8].id, cantidad: 1 },
    ],
    precioTotal: idsProductos[2].precio + idsProductos[8].precio,
  };

  await addDoc(collection(db, 'combos'), { ...comboArepero, creadoEn: serverTimestamp() });
  await addDoc(collection(db, 'combos'), { ...comboCafetero, creadoEn: serverTimestamp() });

  // Configuración por defecto
  await setDoc(doc(db, 'configuracion', 'tienda'), {
    alertaStockUnidades: 10,
    alertaCaducidadDias: 90,
    costoEnvioBarrio: 2,
    costoEnvioFuera: 5,
    horaApertura: '09:00',
    horaCierre: '21:00',
    diasAbierto: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'],
    emailAlertas: '',
  });

  console.log(`Seed completado: ${idsProductos.length} productos, 2 combos, configuración creada.`);
  return idsProductos;
}
