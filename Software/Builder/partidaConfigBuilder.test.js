/**
 * partidaConfigBuilder.test.js
 * -------------------------------
 * Pruebas de funcionamiento para el Builder de configuración de
 * partidas de SyncArena. Usa el test runner nativo de Node (node:test).
 *
 * Ejecutar con: node --test
 */

const test = require("node:test");
const assert = require("node:assert/strict");

const { PartidaConfig } = require("./partidaConfig");
const { PartidaConfigBuilder, PartidaConfigDirector } = require("./partidaConfigBuilder");

// ---------- Comportamiento del patrón Builder ----------

test("build() devuelve una instancia de PartidaConfig", () => {
  const config = new PartidaConfigBuilder().build();
  assert.ok(config instanceof PartidaConfig);
});

test("los métodos son encadenables (fluent interface)", () => {
  const builder = new PartidaConfigBuilder();
  const resultado = builder.conMapa("arena_x").conMaxJugadores(12);
  assert.strictEqual(resultado, builder); // cada método debe devolver `this`
});

test("sin llamar ningún método, build() aplica los valores por defecto", () => {
  const config = new PartidaConfigBuilder().build();
  assert.strictEqual(config.mapa, "arena_default");
  assert.strictEqual(config.modoDeJuego, "deathmatch");
  assert.strictEqual(config.maxJugadores, 8);
});

test("la configuración construida es inmutable", () => {
  const config = new PartidaConfigBuilder().build();
  assert.ok(Object.isFrozen(config));

  // En modo no estricto (CommonJS por defecto) una asignación a un
  // objeto congelado se ignora en silencio en vez de lanzar; por eso
  // se verifica el valor real en lugar de esperar una excepción.
  config.maxJugadores = 999;
  assert.strictEqual(config.maxJugadores, 8);
});

test("dos builds seguidos con distintos parámetros no se contaminan entre sí", () => {
  const configA = new PartidaConfigBuilder().conMapa("arena_a").conMaxJugadores(4).build();
  const configB = new PartidaConfigBuilder().conMapa("arena_b").conMaxJugadores(20).build();

  assert.strictEqual(configA.mapa, "arena_a");
  assert.strictEqual(configB.mapa, "arena_b");
  assert.notStrictEqual(configA.maxJugadores, configB.maxJugadores);
});

// ---------- Validaciones ----------

test("conModoDeJuego() rechaza un modo inválido", () => {
  assert.throws(
    () => new PartidaConfigBuilder().conModoDeJuego("modo_inventado"),
    /Modo de juego inválido/
  );
});

test("conMaxJugadores() rechaza valores fuera de rango", () => {
  assert.throws(() => new PartidaConfigBuilder().conMaxJugadores(1), /entre 2 y 100/);
  assert.throws(() => new PartidaConfigBuilder().conMaxJugadores(150), /entre 2 y 100/);
});

test("build() rechaza battle_royale con muy pocos jugadores", () => {
  assert.throws(
    () =>
      new PartidaConfigBuilder()
        .conModoDeJuego("battle_royale")
        .conMaxJugadores(4)
        .build(),
    /battle_royale requiere al menos 10 jugadores/
  );
});

// ---------- Configuración completa personalizada ----------

test("configuración completa personalizada arma todos los campos correctamente", () => {
  const config = new PartidaConfigBuilder()
    .conMapa("templo_olvidado")
    .conModoDeJuego("captura_bandera")
    .conMaxJugadores(12)
    .conDuracion(20)
    .conDificultadBots("dificil")
    .conFuegoAmigo(true)
    .conTiempoRespawn(8)
    .conEspectadores(false)
    .build();

  assert.strictEqual(config.mapa, "templo_olvidado");
  assert.strictEqual(config.modoDeJuego, "captura_bandera");
  assert.strictEqual(config.maxJugadores, 12);
  assert.strictEqual(config.duracionMinutos, 20);
  assert.strictEqual(config.dificultadBots, "dificil");
  assert.strictEqual(config.fuegoAmigo, true);
  assert.strictEqual(config.tiempoRespawnSegundos, 8);
  assert.strictEqual(config.permiteEspectadores, false);
});

// ---------- Director ----------

test("PartidaConfigDirector.partidaRapidaCasual() arma una config casual válida", () => {
  const config = PartidaConfigDirector.partidaRapidaCasual();
  assert.strictEqual(config.modoDeJuego, "casual");
  assert.strictEqual(config.duracionMinutos, 5);
});

test("PartidaConfigDirector.partidaBattleRoyale() arma una config con suficientes jugadores", () => {
  const config = PartidaConfigDirector.partidaBattleRoyale("isla_norte");
  assert.strictEqual(config.modoDeJuego, "battle_royale");
  assert.ok(config.maxJugadores >= 10);
});
