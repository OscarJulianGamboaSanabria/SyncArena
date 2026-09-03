/**
 * notificacionCreator.test.js
 * -----------------------------
 * Pruebas de funcionamiento para el Factory Method de notificaciones
 * de SyncArena. Usa el test runner nativo de Node (node:test).
 *
 * Ejecutar con: node --test
 */

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  NotificacionLogro,
  NotificacionInvitacionPartida,
  NotificacionMensajeChat,
  NotificacionCompra,
} = require("./notificacion");

const {
  NotificacionCreator,
  CreadorNotificacionLogro,
  CreadorNotificacionCompra,
  obtenerCreador,
} = require("./notificacionCreator");

// ---------- Comportamiento del patrón Factory Method ----------

test("el creador de logros construye una NotificacionLogro", () => {
  const creador = new CreadorNotificacionLogro();
  const notificacion = creador.crearNotificacion({
    destinatario: "Oscar",
    nombreLogro: "Primera victoria",
  });
  assert.ok(notificacion instanceof NotificacionLogro);
});

test("no se puede instanciar el creador abstracto sin sobrescribir crearNotificacion", () => {
  const creadorBase = new NotificacionCreator();
  assert.throws(
    () => creadorBase.crearNotificacion({}),
    /debe implementarse en la subclase/
  );
});

test("obtenerCreador() devuelve el creador correcto según el tipo", () => {
  const creador = obtenerCreador("compra");
  assert.ok(creador instanceof CreadorNotificacionCompra);
});

test("obtenerCreador() lanza error si el tipo no existe", () => {
  assert.throws(() => obtenerCreador("tipo_inventado"), /No existe un creador/);
});

// ---------- El método plantilla notificar() funciona igual para todos ----------

test("notificar() de logro arma el paquete con canal push", () => {
  const creador = obtenerCreador("logro");
  const paquete = creador.notificar({ destinatario: "Oscar", nombreLogro: "Primera victoria" });

  assert.strictEqual(paquete.canal, "push");
  assert.strictEqual(paquete.destinatario, "Oscar");
  assert.match(paquete.mensaje, /Primera victoria/);
});

test("notificar() de invitación a partida arma el paquete con canal in_game", () => {
  const creador = obtenerCreador("invitacion_partida");
  const paquete = creador.notificar({
    destinatario: "Jesus",
    idPartida: "arena_01",
    jugadorQueInvita: "Oscar",
  });

  assert.strictEqual(paquete.canal, "in_game");
  assert.match(paquete.mensaje, /Oscar te invitó/);
});

test("notificar() de mensaje de chat arma el paquete con canal in_game", () => {
  const creador = obtenerCreador("mensaje_chat");
  const paquete = creador.notificar({
    destinatario: "Jesus",
    remitente: "Oscar",
    textoPreview: "¿Listo para la partida?",
  });

  assert.strictEqual(paquete.canal, "in_game");
  assert.match(paquete.mensaje, /¿Listo para la partida\?/);
});

test("notificar() de compra arma el paquete con canal email", () => {
  const creador = obtenerCreador("compra");
  const paquete = creador.notificar({
    destinatario: "Oscar",
    item: "Skin Dragón",
    monto: 9.99,
  });

  assert.strictEqual(paquete.canal, "email");
  assert.match(paquete.mensaje, /Skin Dragón/);
});

// ---------- El código cliente no necesita conocer la clase concreta ----------

test("código cliente polimórfico: procesa notificaciones sin conocer su clase concreta", () => {
  const solicitudes = [
    { tipo: "logro", datos: { destinatario: "Oscar", nombreLogro: "Racha x10" } },
    {
      tipo: "invitacion_partida",
      datos: { destinatario: "Jesus", idPartida: "arena_02", jugadorQueInvita: "Oscar" },
    },
  ];

  const paquetes = solicitudes.map(({ tipo, datos }) => obtenerCreador(tipo).notificar(datos));

  assert.strictEqual(paquetes.length, 2);
  paquetes.forEach((paquete) => {
    assert.ok("canal" in paquete);
    assert.ok("mensaje" in paquete);
  });
});
