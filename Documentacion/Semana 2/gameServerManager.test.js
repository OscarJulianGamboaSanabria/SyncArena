/**
 * gameServerManager.test.js
 * ---------------------------
 * Pruebas de funcionamiento para el aporte Singleton de SyncArena en JS.
 * Usa el test runner nativo de Node (node:test) + assert, sin dependencias
 * externas.
 *
 * Ejecutar con: node --test
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const { GameServerManager } = require("./gameServerManager");

// ---------- Comportamiento del patrón Singleton ----------

test("misma instancia en llamadas repetidas", () => {
  GameServerManager.resetInstance();
  const instancia1 = new GameServerManager();
  const instancia2 = new GameServerManager();
  assert.strictEqual(instancia1, instancia2);
});

test("estado compartido entre referencias", () => {
  GameServerManager.resetInstance();
  const instancia1 = new GameServerManager();
  instancia1.conectarJugador("Oscar");

  const instancia2 = new GameServerManager(); // "otra" referencia
  assert.ok(instancia2.jugadoresConectados().includes("Oscar"));
});

test("una sola instancia con creaciones concurrentes (Promise.all)", async () => {
  GameServerManager.resetInstance();

  const crearInstanciaAsync = () =>
    new Promise((resolve) => {
      // Simula trabajo asíncrono antes de crear la instancia
      setImmediate(() => resolve(new GameServerManager()));
    });

  const instancias = await Promise.all(
    Array.from({ length: 50 }, () => crearInstanciaAsync())
  );

  const referenciaUnica = instancias[0];
  const todasIguales = instancias.every((i) => i === referenciaUnica);
  assert.ok(todasIguales, "Se crearon múltiples instancias del Singleton");
});

// ---------- Lógica de negocio del GameServerManager ----------

test("crear partida y unir jugadores", () => {
  GameServerManager.resetInstance();
  const gestor = new GameServerManager();

  gestor.crearPartida("partida_1");
  gestor.unirJugadorAPartida("partida_1", "Oscar");
  gestor.unirJugadorAPartida("partida_1", "Jesus");

  const partida = gestor.obtenerPartida("partida_1");
  assert.deepStrictEqual(partida.jugadores, ["Oscar", "Jesus"]);
  assert.strictEqual(partida.estado, "esperando");
});

test("no permite partidas duplicadas", () => {
  GameServerManager.resetInstance();
  const gestor = new GameServerManager();

  gestor.crearPartida("partida_1");
  assert.throws(() => gestor.crearPartida("partida_1"), /ya existe/);
});

test("finalizar partida", () => {
  GameServerManager.resetInstance();
  const gestor = new GameServerManager();

  gestor.crearPartida("partida_1");
  gestor.finalizarPartida("partida_1");
  assert.strictEqual(gestor.obtenerPartida("partida_1").estado, "finalizada");
});

test("conectar y desconectar jugador", () => {
  GameServerManager.resetInstance();
  const gestor = new GameServerManager();

  gestor.conectarJugador("Oscar");
  assert.ok(gestor.jugadoresConectados().includes("Oscar"));

  gestor.desconectarJugador("Oscar");
  assert.ok(!gestor.jugadoresConectados().includes("Oscar"));
});

test("ranking se ordena de mayor a menor", () => {
  GameServerManager.resetInstance();
  const gestor = new GameServerManager();

  gestor.conectarJugador("Oscar");
  gestor.conectarJugador("Jesus");

  gestor.sumarPuntos("Oscar", 50);
  gestor.sumarPuntos("Jesus", 120);
  gestor.sumarPuntos("Oscar", 30); // Oscar queda con 80

  const ranking = gestor.obtenerRanking();
  assert.deepStrictEqual(ranking[0], ["Jesus", 120]);
  assert.deepStrictEqual(ranking[1], ["Oscar", 80]);
});
