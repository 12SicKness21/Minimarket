import * as XLSX from 'xlsx';
import { crearProducto, actualizarProducto } from './productos';

function normalizarNombre(nombre) {
  return nombre.trim().toLowerCase();
}

const COLUMNAS = ['Nombre', 'Descripcion', 'Precio', 'Categoria', 'Paises', 'ImagenUrl', 'RecienLlegado', 'Activo'];

function esSi(valor) {
  const v = (valor ?? '').toString().trim().toLowerCase();
  return v === 'si' || v === 'sí' || v === 'true' || v === '1' || v === 'x';
}

export function generarPlantillaExcel(categorias, paises) {
  const ejemplo = {
    Nombre: 'Harina P.A.N. 1kg',
    Descripcion: 'Harina de maíz precocida para arepas',
    Precio: 2.5,
    Categoria: categorias[0]?.id || 'otros',
    Paises: paises[0]?.id || 'general',
    ImagenUrl: '',
    RecienLlegado: 'NO',
    Activo: 'SI',
  };

  const hojaProductos = XLSX.utils.json_to_sheet([ejemplo], { header: COLUMNAS });
  hojaProductos['!cols'] = [
    { wch: 28 }, { wch: 36 }, { wch: 10 }, { wch: 14 },
    { wch: 24 }, { wch: 30 }, { wch: 14 }, { wch: 10 },
  ];

  const filasCategorias = categorias.map((c) => ({ ID: c.id, Nombre: c.label }));
  const hojaCategorias = XLSX.utils.json_to_sheet(filasCategorias);
  hojaCategorias['!cols'] = [{ wch: 16 }, { wch: 20 }];

  const filasPaises = paises.map((p) => ({ ID: p.id, Nombre: p.nombre }));
  const hojaPaises = XLSX.utils.json_to_sheet(filasPaises);
  hojaPaises['!cols'] = [{ wch: 22 }, { wch: 20 }];

  const instrucciones = [
    { Instrucciones: 'Completa una fila por producto en la hoja "Productos".' },
    { Instrucciones: 'Nombre y Precio son obligatorios.' },
    { Instrucciones: 'Categoria debe ser uno de los ID listados en la hoja "Categorías".' },
    { Instrucciones: 'Paises acepta varios ID separados por coma, ej: venezuela,general (ver hoja "Países").' },
    { Instrucciones: 'ImagenUrl es opcional — si se deja vacío se usará una imagen por defecto.' },
    { Instrucciones: 'RecienLlegado y Activo se escriben como SI o NO.' },
    { Instrucciones: 'No agregues ni borres columnas de la hoja "Productos".' },
  ];
  const hojaInstrucciones = XLSX.utils.json_to_sheet(instrucciones);
  hojaInstrucciones['!cols'] = [{ wch: 70 }];

  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hojaInstrucciones, 'Instrucciones');
  XLSX.utils.book_append_sheet(libro, hojaProductos, 'Productos');
  XLSX.utils.book_append_sheet(libro, hojaCategorias, 'Categorías');
  XLSX.utils.book_append_sheet(libro, hojaPaises, 'Países');

  XLSX.writeFile(libro, 'plantilla-productos.xlsx');
}

export async function leerExcelProductos(file, { categorias, paises, productosExistentes = [] }) {
  const buffer = await file.arrayBuffer();
  const libro = XLSX.read(buffer, { type: 'array' });
  const hoja = libro.Sheets['Productos'] || libro.Sheets[libro.SheetNames[0]];
  const filas = XLSX.utils.sheet_to_json(hoja, { defval: '' });

  const idsCategorias = new Set(categorias.map((c) => c.id));
  const idsPaises = new Set(paises.map((p) => p.id));

  const mapaExistentes = new Map(
    productosExistentes.map((p) => [normalizarNombre(p.nombre || ''), p])
  );

  const validos = [];
  const errores = [];

  filas.forEach((fila, i) => {
    const numFila = i + 2; // +1 por índice base 0, +1 por fila de encabezado
    const nombre = (fila.Nombre || '').toString().trim();
    const precio = parseFloat(fila.Precio);
    const categoriaInput = (fila.Categoria || '').toString().trim();

    if (!nombre) {
      errores.push({ fila: numFila, motivo: 'Falta el nombre del producto' });
      return;
    }
    if (!precio || precio <= 0) {
      errores.push({ fila: numFila, motivo: `Precio inválido: "${fila.Precio}"` });
      return;
    }

    const categoria = idsCategorias.has(categoriaInput) ? categoriaInput : 'otros';

    const paisesInput = (fila.Paises || '').toString()
      .split(',')
      .map((p) => p.trim())
      .filter((p) => idsPaises.has(p));
    const paisesFinal = paisesInput.length > 0 ? paisesInput : ['general'];

    const existente = mapaExistentes.get(normalizarNombre(nombre)) || null;

    validos.push({
      nombre,
      descripcion: (fila.Descripcion || '').toString().trim(),
      precio,
      categoria,
      paises: paisesFinal,
      imagenUrl: (fila.ImagenUrl || '').toString().trim(),
      recienLlegado: esSi(fila.RecienLlegado),
      activo: fila.Activo === '' ? true : esSi(fila.Activo),
      keywords: [...new Set(`${nombre} ${fila.Descripcion || ''}`.toLowerCase().split(/\s+/).filter((w) => w.length > 2))],
      existenteId: existente?.id || null,
      accion: existente ? 'omitir' : 'crear',
    });
  });

  return { validos, errores };
}

export async function procesarProductosMasivo(items, onProgreso) {
  let creados = 0;
  let actualizados = 0;
  let omitidos = 0;
  const fallidos = [];
  let procesados = 0;

  for (const item of items) {
    const { existenteId, accion, ...data } = item;
    try {
      if (accion === 'omitir') {
        omitidos++;
      } else if (accion === 'actualizar' && existenteId) {
        await actualizarProducto(existenteId, data, null);
        actualizados++;
      } else {
        await crearProducto(data, null);
        creados++;
      }
    } catch (e) {
      fallidos.push({ nombre: data.nombre, motivo: e.message });
    }
    procesados++;
    onProgreso?.(procesados, items.length);
  }

  return { creados, actualizados, omitidos, fallidos };
}
