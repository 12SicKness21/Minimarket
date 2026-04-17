# PLAN.md — Minimarket App

## Instrucción principal
Lee este archivo completo antes de escribir una sola línea de código. Construye el proyecto entero de forma autónoma siguiendo esta arquitectura. No preguntes por cada detalle menor, toma decisiones razonables y continúa.

---

## Identificadores del proyecto

| Campo | Valor |
|---|---|
| Nombre del proyecto | Minimarket |
| Repo GitHub | 12SicKness21/Minimarket |
| Proyecto Firebase | minimarket-21 |
| Despliegue frontend | Vercel |
| Backend | Firebase (Firestore + Storage + Cloud Functions) |

---

## Stack tecnológico

- **Frontend**: React + Vite + React Router v6
- **Estilos**: Tailwind CSS v3
- **Base de datos**: Firebase Firestore
- **Almacenamiento de imágenes**: Firebase Storage
- **Backend serverless**: Firebase Cloud Functions (Node.js 18)
- **Autenticación admin**: Firebase Authentication (email/password, solo 1 usuario admin)
- **Búsqueda**: Algolia (índice `productos`, free tier)
- **Despliegue**: Netlify (frontend) + Firebase (backend)

---

## Variables de entorno

Crear archivo `.env` en la raíz con estas claves (valores vacíos, el desarrollador los completa):

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_ALGOLIA_APP_ID=
VITE_ALGOLIA_SEARCH_KEY=
VITE_WHATSAPP_NUMBER=34XXXXXXXXX
VITE_TIENDA_NOMBRE=Minimarket
VITE_TIENDA_HORARIO=Lun–Sáb 9:00–21:00
```

Crear también `.env.example` con las mismas claves vacías y añadir `.env` al `.gitignore`.

---

## Estructura de carpetas

```
minimarket/
├── public/
├── src/
│   ├── admin/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Productos.jsx
│   │   │   ├── Combos.jsx
│   │   │   ├── Alertas.jsx
│   │   │   └── Configuracion.jsx
│   │   └── components/
│   │       ├── AdminLayout.jsx
│   │       ├── ProductoForm.jsx
│   │       └── ComboForm.jsx
│   ├── tienda/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Catalogo.jsx
│   │   │   └── Carrito.jsx
│   │   └── components/
│   │       ├── ProductoCard.jsx
│   │       ├── FiltroPaises.jsx
│   │       ├── FiltroCategoria.jsx
│   │       ├── BannerRecienLlegado.jsx
│   │       ├── SeccionCombos.jsx
│   │       ├── CarritoDrawer.jsx
│   │       └── SelectorEnvio.jsx
│   ├── shared/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── BotonWhatsApp.jsx
│   │   ├── hooks/
│   │   │   ├── useCarrito.js
│   │   │   └── useUltimoPedido.js
│   │   └── utils/
│   │       ├── whatsapp.js
│   │       └── formatters.js
│   ├── firebase/
│   │   ├── config.js
│   │   ├── productos.js
│   │   ├── combos.js
│   │   └── config-tienda.js
│   ├── App.jsx
│   └── main.jsx
├── functions/
│   ├── index.js
│   └── package.json
├── PLAN.md
├── .env
├── .env.example
├── .gitignore
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
└── package.json
```

---

## Modelo de datos Firestore

### Colección: `productos`
```js
{
  id: string,                        // auto-generado
  nombre: string,                    // "Harina PAN 1kg"
  descripcion: string,
  precio: number,                    // en euros, ej: 2.50
  categoria: string,                 // "harinas" | "bebidas" | "lacteos" | "snacks" | "conservas" | "limpieza" | "otros"
  paises: string[],                  // ["venezuela", "colombia", "peru", "ecuador", "mexico", "republica_dominicana", "cuba", "general"]
  imagenUrl: string,                 // URL de Firebase Storage
  stockActual: number,
  activo: boolean,                   // true = visible en tienda
  recienLlegado: boolean,            // true = aparece en banner de home
  fechaCaducidad: timestamp | null,  // null si no caduca
  creadoEn: timestamp,
  actualizadoEn: timestamp,
  keywords: string[]                 // para búsqueda: ["harina", "pan", "venezolano", ...]
}
```

### Colección: `combos`
```js
{
  id: string,
  nombre: string,              // "Combo Arepero"
  descripcion: string,
  imagenUrl: string,
  precioTotal: number,         // calculado al guardar (suma de productos)
  productos: [
    { productoId: string, cantidad: number }
  ],
  activo: boolean,
  creadoEn: timestamp
}
```

### Colección: `pedidos`
```js
{
  id: string,
  items: [
    { productoId: string, nombre: string, cantidad: number, precioUnitario: number }
  ],
  subtotal: number,
  costoEnvio: number,
  total: number,
  tipoEnvio: "recogida" | "barrio" | "fuera",
  metodoPago: "efectivo" | "transferencia" | "bizum",
  direccionEntrega: string,
  telefono: string,
  estado: "pendiente" | "confirmado" | "entregado" | "cancelado",
  creadoEn: timestamp
}
```

### Documento: `configuracion/tienda`
```js
{
  alertaStockUnidades: number,    // default: 10
  alertaCaducidadDias: number,    // default: 90
  costoEnvioBarrio: number,       // default: 2
  costoEnvioFuera: number,        // default: 5
  horaApertura: string,           // "09:00"
  horaCierre: string,             // "21:00"
  diasAbierto: string[],          // ["lunes","martes","miercoles","jueves","viernes","sabado"]
  emailAlertas: string
}
```

---

## Índices Firestore (`firestore.indexes.json`)

Crear índices compuestos para:
1. `productos` → `activo` ASC + `paises` ARRAY_CONTAINS + `categoria` ASC
2. `productos` → `activo` ASC + `recienLlegado` ASC
3. `productos` → `activo` ASC + `stockActual` ASC
4. `productos` → `activo` ASC + `fechaCaducidad` ASC

---

## Reglas de Firestore (`firestore.rules`)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Solo admin autenticado puede escribir
    match /productos/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /combos/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /pedidos/{id} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
    match /configuracion/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## Páginas y funcionalidades

### TIENDA (pública)

#### Home (`/`)
- Navbar con logo, buscador, ícono de carrito con contador
- **Banner "Recién Llegado"**: productos con `recienLlegado: true`, carrusel horizontal con scroll snap. Muestra foto, nombre, precio y botón "Añadir"
- **Sección Combos**: grid de combos activos. Botón "Añadir combo" descompone en productos individuales en el carrito
- **Filtro por país**: fila de banderas clickeables (emojis de banderas + nombre del país). Al hacer clic filtra el catálogo. Múltiple selección permitida
  - 🇻🇪 Venezuela · 🇨🇴 Colombia · 🇵🇪 Perú · 🇪🇨 Ecuador · 🇲🇽 México · 🇩🇴 Rep. Dominicana · 🇨🇺 Cuba · 🌎 General
- **Grid de productos**: paginación de 24 en 24. Filtros activos de país y categoría se aplican combinados
- Botón flotante de WhatsApp para consultas

#### Catálogo (`/catalogo`)
- Misma lógica de filtros del Home
- Barra de búsqueda conectada a Algolia
- Filtro lateral/superior por categoría (chips clickeables)
- ProductoCard: imagen, nombre, país (banderita), precio, botón "Añadir al carrito"

#### Carrito (drawer lateral)
- Abre desde cualquier página al hacer clic en el ícono
- Lista de productos con foto, nombre, cantidad (+/-), precio
- **SelectorEnvio**: dropdown con 3 opciones:
  - "Recogida en tienda — Gratis"
  - "Envío en mi barrio — 2€"
  - "Envío fuera del barrio — 5€"
- Selector de método de pago: Efectivo / Transferencia / Bizum (botones visuales, no input)
- Campo de dirección de entrega (solo visible si no es recogida)
- Campo de teléfono
- Subtotal + costo envío + **Total**
- Botón "Enviar pedido por WhatsApp" → genera mensaje estructurado y abre `wa.me/`
- **Botón "Cargar último pedido"**: si existe en localStorage, carga los ítems del pedido anterior

#### Lógica de horario
- Si la hora actual está fuera del horario configurado, el botón de enviar pedido se reemplaza por: "Estamos cerrados. Volvemos el [día] a las [hora de apertura]"
- Usar la configuración de `configuracion/tienda` para calcular esto

### ADMIN (privado, ruta `/admin`)

#### Login (`/admin/login`)
- Formulario email + contraseña
- Firebase Authentication
- Redirige a Dashboard si ya está logueado

#### Dashboard (`/admin`)
- Resumen: total productos, total combos, pedidos pendientes
- **Panel de Alertas** (destacado en rojo/naranja):
  - Productos con `stockActual <=` `alertaStockUnidades`
  - Productos con `fechaCaducidad` dentro de los próximos `alertaCaducidadDias` días
  - Lista con nombre, stock actual, fecha de caducidad y botón "Ver producto"

#### Gestión de Productos (`/admin/productos`)
- Tabla paginada con búsqueda por nombre
- Columnas: imagen (thumbnail), nombre, categoría, países, precio, stock, caducidad, recién llegado (toggle), activo (toggle)
- Botón "Nuevo producto" → abre modal con `ProductoForm`
- Botón editar por fila → mismo modal con datos precargados
- **ProductoForm** incluye:
  - Nombre, descripción, precio, categoría (select), países (checkboxes con banderas)
  - Stock actual
  - Fecha de caducidad (date picker, opcional)
  - Toggle "Recién llegado"
  - Toggle "Activo"
  - Subida de imagen → Firebase Storage, path: `productos/{id}/imagen.jpg`
  - Campo keywords (auto-generado desde nombre + descripción, editable)

#### Gestión de Combos (`/admin/combos`)
- Lista de combos con imagen, nombre, precio total, activo (toggle)
- **ComboForm**: nombre, descripción, imagen, buscador para añadir productos con cantidad, precio total calculado automáticamente

#### Configuración (`/admin/configuracion`)
- Formulario para editar `configuracion/tienda`:
  - Umbral de alerta de stock (número)
  - Umbral de alerta de caducidad en días (número)
  - Costo envío barrio (€)
  - Costo envío fuera de barrio (€)
  - Hora apertura y hora cierre
  - Días abiertos (checkboxes)
  - Email para alertas

---

## Generación del mensaje de WhatsApp

Archivo `src/shared/utils/whatsapp.js`:

```js
export function generarMensajeWhatsApp({ items, subtotal, costoEnvio, total, tipoEnvio, metodoPago, direccion, telefono }) {
  const lineasProductos = items
    .map(item => `🛒 ${item.cantidad}x ${item.nombre} (${(item.precioUnitario * item.cantidad).toFixed(2)}€)`)
    .join('\n');

  const etiquetaEnvio = {
    recogida: '🏪 Recogida en tienda — Gratis',
    barrio: `🚚 Envío en mi barrio — ${costoEnvio.toFixed(2)}€`,
    fuera: `🚚 Envío fuera del barrio — ${costoEnvio.toFixed(2)}€`
  }[tipoEnvio];

  const etiquetaPago = {
    efectivo: '💵 Efectivo',
    transferencia: '🏦 Transferencia bancaria',
    bizum: '📱 Bizum'
  }[metodoPago];

  const lineaDireccion = tipoEnvio !== 'recogida' ? `📍 Dirección: ${direccion}\n` : '';
  const lineaTelefono = telefono ? `📞 Teléfono: ${telefono}\n` : '';

  return encodeURIComponent(
    `¡Hola! Quiero hacer este pedido:\n\n${lineasProductos}\n\n${etiquetaEnvio}\n${lineaDireccion}${lineaTelefono}💳 Pago: ${etiquetaPago}\n💰 Subtotal: ${subtotal.toFixed(2)}€\n💰 Total: ${total.toFixed(2)}€`
  );
}
```

---

## Hook: último pedido en localStorage

Archivo `src/shared/hooks/useUltimoPedido.js`:

```js
const CLAVE = 'minimarket_ultimo_pedido';

export function guardarUltimoPedido(items) {
  localStorage.setItem(CLAVE, JSON.stringify(items));
}

export function cargarUltimoPedido() {
  const data = localStorage.getItem(CLAVE);
  return data ? JSON.parse(data) : null;
}
```

Al enviar el pedido por WhatsApp, guardar automáticamente los ítems en localStorage.

---

## Cloud Functions (`functions/index.js`)

### Función 1: `alertasDiarias` (Scheduled)
- Se ejecuta cada día a las 08:00 (hora España, Europe/Madrid)
- Lee `configuracion/tienda` para obtener los umbrales
- Consulta productos con `stockActual <=` umbral de stock
- Consulta productos con `fechaCaducidad <=` (hoy + días de alerta)
- Si hay productos en alguna lista, envía email al `emailAlertas` configurado
- Usar **Nodemailer con Gmail** o **Resend** (preferir Resend, más simple)
- El email debe listar claramente los productos en alerta con su stock y fecha de caducidad

### Función 2: `sincronizarAlgolia` (onWrite en productos)
- Se dispara cuando se crea o actualiza un documento en `productos`
- Sincroniza el documento con el índice de Algolia
- Usar el SDK oficial de Algolia para Node.js (`algoliasearch`)
- Añadir las variables de entorno de Algolia en Firebase Functions config

Añadir al `.env` del proyecto las claves de Algolia para Functions:
```
ALGOLIA_APP_ID=
ALGOLIA_ADMIN_KEY=
```

---

## Diseño visual

- **Paleta**: fondo blanco o crema claro, acento principal verde vibrante (#16a34a), acento secundario amarillo cálido (#eab308)
- **Tipografía**: Google Fonts — display: `Syne` o `Plus Jakarta Sans`, body: `Inter`
- **Estilo general**: limpio, moderno, cálido. Que transmita frescura y productos de calidad
- Las banderas de países deben ser los emojis nativos del sistema, no imágenes externas
- Botones redondeados (rounded-full o rounded-xl)
- Sombras suaves en cards de productos
- El carrito debe ser un drawer desde la derecha, no una página separada
- En móvil, el filtro de países debe hacer scroll horizontal

---

## Configuración de Vercel

No se necesita archivo de configuración adicional. Vercel detecta Vite automáticamente al conectar el repo de GitHub.

Crear `vercel.json` en la raíz solo para manejar el routing de SPA:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Las variables de entorno se configuran en el dashboard de Vercel:
Settings → Environment Variables → pegar cada clave del `.env`.

---

## Notas importantes para Claude Code

1. **No crear sistema de registro de usuarios**. Solo existe un admin cuya cuenta se crea manualmente en Firebase Console
2. **No integrar pasarela de pago**. Los métodos (efectivo, transferencia, Bizum) son solo informativos en el mensaje de WhatsApp
3. **Paginación obligatoria** en el catálogo desde el inicio. Usar `startAfter` de Firestore, 24 productos por página
4. **Optimizar imágenes** al subir: máximo 800px de ancho, comprimir antes de enviar a Storage. Usar `browser-image-compression` npm package
5. **Proteger rutas `/admin`**: si no hay usuario autenticado, redirigir a `/admin/login`
6. **El precio siempre en euros** con 2 decimales. Usar `toFixed(2)` consistentemente
7. **Responsive first**: diseñar primero para móvil, la mayoría de clientes usará el catálogo desde el teléfono
8. **Al añadir un combo al carrito**, descomponer en productos individuales y verificar que cada producto esté activo y con stock > 0
9. **Firestore**: usar `onSnapshot` solo en el panel de alertas del admin. En el catálogo usar `getDocs` con paginación para no quemar lecturas
10. Generar datos de ejemplo (`seed`) en un archivo `src/firebase/seed.js` con 10 productos de prueba de distintos países y 2 combos, para poder probar la app inmediatamente después de configurar Firebase
