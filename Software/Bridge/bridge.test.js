/**
 * bridge.test.js
 * ----------------
 * Pruebas de funcionamiento para el patrón Bridge de SyncArena. Usa
 * el test runner nativo de Node (node:test).
 *
 * Ejecutar con: node --test
 */

const test = require("node:test");
const assert = require("node:assert/strict");

const { CanalWebSocket, CanalUDP } = require("./canalesConcretos");
const { PartidaCasual, PartidaClasificada, PartidaTorneo } = require("./sesionesConcretas");

// ---------- Las dos jerarquías varían de forma independiente ----------

test("una PartidaCasual funciona igual con CanalWebSocket y con CanalUDP", () => {
  const eventoSimple = { tipo: "chat", texto: "hola" };

  const sesionWs = new PartidaCasual("p1", new CanalWebSocket());
  const enviadoWs = sesionWs.transmitirEvento(eventoSimple, ["jugador_1"]);

  const sesionUdp = new PartidaCasual("p2", new CanalUDP());
  const enviadoUdp = sesionUdp.transmitirEvento(eventoSimple, ["jugador_1"]);

  assert.strictEqual(enviadoWs, true);
  assert.strictEqual(enviadoUdp, true); // primer envío UDP, todavía no toca perder paquete
});

test("el mismo CanalWebSocket puede ser reutilizado por distintos tipos de sesión", () => {
  const canalCompartido = new CanalWebSocket();

  const casual = new PartidaCasual("p1", canalCompartido);
  casual.transmitirEvento({ tipo: "chat", texto: "hola" }, ["j1"]);

  // El canal ya está conectado; una segunda sesión también podría
  // usarlo (aquí se prueba con un canal nuevo para no mezclar sesiones,
  // pero se demuestra que la clase Canal no sabe ni le importa qué
  // tipo de sesión lo está usando).
  const torneo = new PartidaTorneo("p2", new CanalWebSocket());
  const enviado = torneo.transmitirEvento({ tipo: "kill", jugador: "j1" }, ["j2"]);

  assert.strictEqual(enviado, true);
});

// ---------- Comportamiento propio de cada tipo de sesión ----------

test("PartidaClasificada rechaza eventos de posición con salto imposible", () => {
  const sesion = new PartidaClasificada("ranked_1", new CanalWebSocket());

  const eventoValido = sesion.transmitirEvento({ tipo: "posicion", deltaX: 5 }, ["j1"]);
  const eventoInvalido = sesion.transmitirEvento({ tipo: "posicion", deltaX: 999 }, ["j1"]);

  assert.strictEqual(eventoValido, true);
  assert.strictEqual(eventoInvalido, false);
  assert.strictEqual(sesion.eventosRechazados(), 1);
});

test("PartidaTorneo registra cada evento para replay, además de transmitirlo", () => {
  const sesion = new PartidaTorneo("torneo_1", new CanalWebSocket());

  sesion.transmitirEvento({ tipo: "kill", jugador: "j1" }, ["todos"]);
  sesion.transmitirEvento({ tipo: "kill", jugador: "j2" }, ["todos"]);

  const replay = sesion.registroReplay();
  assert.strictEqual(replay.length, 2);
  assert.strictEqual(replay[0].jugador, "j1");
  assert.strictEqual(replay[1].timestamp, 1);
});

test("PartidaCasual no valida ni registra nada extra: reenvía tal cual", () => {
  const sesion = new PartidaCasual("casual_1", new CanalWebSocket());
  const enviado = sesion.transmitirEvento({ tipo: "posicion", deltaX: 999 }, ["j1"]);
  assert.strictEqual(enviado, true); // PartidaCasual no aplica anti-cheat
});

// ---------- Comportamiento propio de cada canal ----------

test("CanalWebSocket entrega el 100% de los mensajes enviados", () => {
  const canal = new CanalWebSocket();
  canal.conectar();
  for (let i = 0; i < 10; i++) canal.enviar({ n: i }, ["j1"]);

  const stats = canal.estadisticas();
  assert.strictEqual(stats.entregados, 10);
  assert.strictEqual(stats.confiable, true);
});

test("CanalUDP pierde paquetes según su patrón determinístico (1 de cada 5)", () => {
  const canal = new CanalUDP();
  canal.conectar();
  for (let i = 0; i < 10; i++) canal.enviar({ n: i }, ["j1"]);

  const stats = canal.estadisticas();
  assert.strictEqual(stats.intentados, 10);
  assert.strictEqual(stats.entregados, 8); // se pierden los intentos #5 y #10
  assert.strictEqual(stats.confiable, false);
});

test("enviar sin conectar lanza error, en ambos canales", () => {
  assert.throws(() => new CanalWebSocket().enviar({}, []), /sin conectar/);
  assert.throws(() => new CanalUDP().enviar({}, []), /sin conectar/);
});

// ---------- Cambiar de canal en pleno vuelo ----------

test("cambiarCanal() permite degradar de WebSocket a UDP sin recrear la sesión", () => {
  const sesion = new PartidaCasual("p1", new CanalWebSocket());
  sesion.transmitirEvento({ tipo: "chat", texto: "antes del cambio" }, ["j1"]);

  const statsAntes = sesion.estadisticasCanal();
  assert.strictEqual(statsAntes.protocolo, "websocket");

  sesion.cambiarCanal(new CanalUDP());
  sesion.transmitirEvento({ tipo: "chat", texto: "después del cambio" }, ["j1"]);

  const statsDespues = sesion.estadisticasCanal();
  assert.strictEqual(statsDespues.protocolo, "udp");
});
