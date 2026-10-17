/**
 * facade_decorator.test.js
 * ---------------------------
 * Pruebas de funcionamiento para la mezcla Facade + Decorator de
 * SyncArena. Usa el test runner nativo de Node (node:test).
 *
 * Ejecutar con: node --test
 */

const test = require("node:test");
const assert = require("node:assert/strict");

const { ServicioRecursos, ServicioConexion, ServicioPartidas } = require("./subsistemas");
const { PartidaServicio } = require("./partidaServicio");
const { PartidaFacade } = require("./partidaFacade");
const {
  LoggingDecorator,
  MetricasDecorator,
  NotificacionesDecorator,
} = require("./decoradoresConcretos");

// Arma una fachada con subsistemas a la vista, para poder inspeccionar
// qué hizo por dentro.
function crearFachada() {
  const recursos = new ServicioRecursos();
  const conexion = new ServicioConexion();
  const partidas = new ServicioPartidas();
  const fachada = new PartidaFacade({ recursos, conexion, partidas });
  return { fachada, recursos, conexion, partidas };
}

// Reloj falso: devuelve los valores dados, uno por llamada.
function relojFalso(valores) {
  let i = 0;
  return () => valores[i++];
}

// ---------- Facade: una llamada coordina los tres subsistemas ----------

test("iniciarPartida() carga recursos, crea la partida y conecta jugadores en una sola llamada", () => {
  const { fachada, recursos, conexion, partidas } = crearFachada();

  const resultado = fachada.iniciarPartida({ mapa: "arena_industrial" }, ["Oscar", "Jesus"]);

  assert.strictEqual(resultado.recursosCargados, 3);
  assert.strictEqual(recursos.cargas, 1);
  assert.strictEqual(conexion.totalConectados(), 2);
  assert.strictEqual(partidas.estado(resultado.idPartida), "en_curso");
});

test("sin jugadores falla antes de tocar ningún subsistema", () => {
  const { fachada, recursos } = crearFachada();

  assert.throws(() => fachada.iniciarPartida({ mapa: "arena_industrial" }, []), /al menos un jugador/);
  assert.strictEqual(recursos.cargas, 0);
});

test("un mapa desconocido falla sin dejar partida creada ni jugadores conectados", () => {
  const { fachada, conexion, partidas } = crearFachada();

  assert.throws(() => fachada.iniciarPartida({ mapa: "mapa_inventado" }, ["Oscar"]), /Mapa desconocido/);
  assert.strictEqual(conexion.totalConectados(), 0);
  assert.strictEqual(partidas.estado("partida_1"), null);
});

test("si falla la conexión de un jugador, la fachada deshace lo ya hecho (rollback)", () => {
  const { fachada, conexion, partidas } = crearFachada();

  // El segundo "Oscar" falla (ya está conectado) DESPUÉS de conectar al primero
  assert.throws(
    () => fachada.iniciarPartida({ mapa: "arena_industrial" }, ["Oscar", "Jesus", "Oscar"]),
    /ya está conectado/
  );

  assert.strictEqual(conexion.totalConectados(), 0); // Oscar y Jesus desconectados
  assert.strictEqual(partidas.estado("partida_1"), null); // partida cancelada, no huérfana
});

test("finalizarPartida() marca la partida finalizada y desconecta a sus jugadores", () => {
  const { fachada, conexion, partidas } = crearFachada();
  const { idPartida } = fachada.iniciarPartida({ mapa: "isla_norte" }, ["Oscar", "Jesus"]);

  const resultado = fachada.finalizarPartida(idPartida);

  assert.strictEqual(resultado.jugadoresDesconectados, 2);
  assert.strictEqual(conexion.totalConectados(), 0);
  assert.strictEqual(partidas.estado(idPartida), "finalizada");
});

// ---------- Decorator: registro de eventos ----------

test("LoggingDecorator registra inicio y éxito, y devuelve el mismo resultado", () => {
  const { fachada } = crearFachada();
  const conLog = new LoggingDecorator(fachada);

  const resultado = conLog.iniciarPartida({ mapa: "arena_industrial" }, ["Oscar"]);

  assert.deepStrictEqual(conLog.entradas(), [
    { evento: "iniciarPartida", fase: "inicio", mapa: "arena_industrial", jugadores: 1 },
    { evento: "iniciarPartida", fase: "ok", idPartida: resultado.idPartida },
  ]);
});

test("LoggingDecorator registra el error y lo relanza sin tragárselo", () => {
  const { fachada } = crearFachada();
  const conLog = new LoggingDecorator(fachada);

  assert.throws(() => conLog.iniciarPartida({ mapa: "mapa_inventado" }, ["Oscar"]), /Mapa desconocido/);

  const entradas = conLog.entradas();
  assert.strictEqual(entradas[1].fase, "error");
  assert.match(entradas[1].mensaje, /Mapa desconocido/);
});

// ---------- Decorator: medición de rendimiento ----------

test("MetricasDecorator acumula llamadas, duración total y promedio (reloj falso)", () => {
  const { fachada } = crearFachada();
  // iniciarPartida: 0 -> 40 (40 ms); finalizarPartida: 100 -> 130 (30 ms)
  const conMetricas = new MetricasDecorator(fachada, relojFalso([0, 40, 100, 130]));

  const { idPartida } = conMetricas.iniciarPartida({ mapa: "arena_industrial" }, ["Oscar"]);
  conMetricas.finalizarPartida(idPartida);

  const m = conMetricas.metricas();
  assert.strictEqual(m.iniciarPartida.llamadas, 1);
  assert.strictEqual(m.iniciarPartida.totalMs, 40);
  assert.strictEqual(m.finalizarPartida.totalMs, 30);
  assert.strictEqual(m.iniciarPartida.promedioMs, 40);
});

test("MetricasDecorator cuenta también las llamadas que fallan", () => {
  const { fachada } = crearFachada();
  const conMetricas = new MetricasDecorator(fachada, relojFalso([0, 10]));

  assert.throws(() => conMetricas.iniciarPartida({ mapa: "mapa_inventado" }, ["Oscar"]));

  const m = conMetricas.metricas().iniciarPartida;
  assert.strictEqual(m.llamadas, 1);
  assert.strictEqual(m.errores, 1);
  assert.strictEqual(m.totalMs, 10);
});

// ---------- Decorator: notificaciones ----------

test("NotificacionesDecorator avisa del éxito y del error en lenguaje humano", () => {
  const { fachada } = crearFachada();
  const conAvisos = new NotificacionesDecorator(fachada);

  const { idPartida } = conAvisos.iniciarPartida({ mapa: "templo_olvidado" }, ["Oscar", "Jesus"]);
  assert.throws(() => conAvisos.iniciarPartida({ mapa: "mapa_inventado" }, ["Ana"]));
  conAvisos.finalizarPartida(idPartida);

  assert.deepStrictEqual(conAvisos.mensajes(), [
    `Partida ${idPartida} iniciada en templo_olvidado con 2 jugador(es).`,
    "No se pudo iniciar la partida: Mapa desconocido: 'mapa_inventado'.",
    `Partida ${idPartida} finalizada.`,
  ]);
});

// ---------- La mezcla: apilar decoradores sobre la fachada ----------

test("los tres decoradores se apilan y cada capa ve la misma llamada", () => {
  const { fachada } = crearFachada();
  const conLog = new LoggingDecorator(fachada);
  const conMetricas = new MetricasDecorator(conLog, relojFalso([0, 5]));
  const conAvisos = new NotificacionesDecorator(conMetricas);

  const resultado = conAvisos.iniciarPartida({ mapa: "arena_industrial" }, ["Oscar", "Jesus"]);

  assert.strictEqual(conLog.entradas().length, 2); // inicio + ok
  assert.strictEqual(conMetricas.metricas().iniciarPartida.llamadas, 1);
  assert.strictEqual(conAvisos.mensajes().length, 1);
  assert.strictEqual(resultado.jugadores.length, 2);
});

test("el código cliente funciona igual con la fachada pelada que con tres decoradores encima", () => {
  function arrancar(servicio) {
    return servicio.iniciarPartida({ mapa: "arena_industrial" }, ["Oscar"]).jugadores;
  }

  const pelada = crearFachada().fachada;
  const decorada = new NotificacionesDecorator(
    new MetricasDecorator(new LoggingDecorator(crearFachada().fachada))
  );

  assert.deepStrictEqual(arrancar(pelada), ["Oscar"]);
  assert.deepStrictEqual(arrancar(decorada), ["Oscar"]);
  assert.ok(decorada instanceof PartidaServicio);
});

test("envolver la fachada no la modifica: la fachada pelada sigue sin registrar nada", () => {
  const { fachada } = crearFachada();
  const conLog = new LoggingDecorator(fachada);

  fachada.iniciarPartida({ mapa: "arena_industrial" }, ["Oscar"]); // se usa SIN pasar por el decorador

  assert.strictEqual(conLog.entradas().length, 0);
});
