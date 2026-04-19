const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Resend } = require('resend');
const algoliasearch = require('algoliasearch');

admin.initializeApp();
const db = admin.firestore();

// ───── Función 1: Alertas diarias (scheduled) ─────

exports.alertasDiarias = functions
  .runWith({ timeoutSeconds: 120 })
  .pubsub.schedule('0 8 * * *')
  .timeZone('Europe/Madrid')
  .onRun(async () => {
    const configSnap = await db.doc('configuracion/tienda').get();
    const config = configSnap.exists ? configSnap.data() : {};

    const umbralStock = config.alertaStockUnidades || 10;
    const umbralDias = config.alertaCaducidadDias || 90;
    const emailDestino = config.emailAlertas;

    if (!emailDestino) {
      console.log('No hay email de alertas configurado.');
      return null;
    }

    // Productos con stock bajo
    const snapStock = await db
      .collection('productos')
      .where('activo', '==', true)
      .where('stockActual', '<=', umbralStock)
      .get();

    // Productos próximos a caducar
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + umbralDias);

    const snapCaducidad = await db
      .collection('productos')
      .where('activo', '==', true)
      .where('fechaCaducidad', '<=', admin.firestore.Timestamp.fromDate(fechaLimite))
      .get();

    const stockBajo = snapStock.docs.map((d) => ({ id: d.id, ...d.data() }));
    const proximosCaducar = snapCaducidad.docs.filter((d) => d.data().fechaCaducidad != null).map((d) => ({ id: d.id, ...d.data() }));

    if (stockBajo.length === 0 && proximosCaducar.length === 0) {
      console.log('Sin alertas hoy.');
      return null;
    }

    // Construir email
    let html = '<h2>🔔 Alertas Minimarket</h2>';

    if (stockBajo.length > 0) {
      html += '<h3>🔴 Stock bajo</h3><ul>';
      stockBajo.forEach((p) => {
        html += `<li><strong>${p.nombre}</strong> — Stock: ${p.stockActual} unidades</li>`;
      });
      html += '</ul>';
    }

    if (proximosCaducar.length > 0) {
      html += '<h3>🟠 Próximos a caducar</h3><ul>';
      proximosCaducar.forEach((p) => {
        const fecha = p.fechaCaducidad.toDate().toLocaleDateString('es-ES');
        html += `<li><strong>${p.nombre}</strong> — Caduca: ${fecha}</li>`;
      });
      html += '</ul>';
    }

    // Enviar con Resend
    const resendKey = process.env.RESEND_KEY;
    if (!resendKey) {
      console.log('Resend API key no configurada. Email no enviado.');
      console.log(html);
      return null;
    }

    const resend = new Resend(resendKey);
    await resend.emails.send({
      from: 'Minimarket <onboarding@resend.dev>',
      to: emailDestino,
      subject: `🔔 Alertas Minimarket — ${stockBajo.length} stock bajo, ${proximosCaducar.length} próximos a caducar`,
      html,
    });

    console.log('Email de alertas enviado correctamente.');
    return null;
  });

// ───── Función 2: Sincronizar con Algolia (onWrite) ─────

exports.sincronizarAlgolia = functions.firestore
  .document('productos/{productoId}')
  .onWrite(async (change, context) => {
    const algoliaAppId = process.env.ALGOLIA_APP_ID;
    const algoliaAdminKey = process.env.ALGOLIA_ADMIN_KEY;

    if (!algoliaAppId || !algoliaAdminKey) {
      console.log('Algolia no configurado. Sincronización omitida.');
      return null;
    }

    const client = algoliasearch(algoliaAppId, algoliaAdminKey);
    const index = client.initIndex('productos');

    // Documento eliminado
    if (!change.after.exists) {
      await index.deleteObject(context.params.productoId);
      console.log(`Producto ${context.params.productoId} eliminado de Algolia.`);
      return null;
    }

    const data = change.after.data();
    const record = {
      objectID: context.params.productoId,
      nombre: data.nombre,
      descripcion: data.descripcion,
      precio: data.precio,
      categoria: data.categoria,
      paises: data.paises,
      imagenUrl: data.imagenUrl,
      activo: data.activo,
      recienLlegado: data.recienLlegado,
      stockActual: data.stockActual,
      keywords: data.keywords,
    };

    await index.saveObject(record);
    console.log(`Producto ${context.params.productoId} sincronizado con Algolia.`);
    return null;
  });
