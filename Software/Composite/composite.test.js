/**
 * composite.test.js
 * -------------------
 * Pruebas de funcionamiento para el patrón Composite aplicado a la
 * estructura Jugador -> Equipo -> Partida de SyncArena. Usa el test
 * runner nativo de Node (node:test).
 *
 * Ejecutar con: node --test
 */

const test = require("node:test");
const assert = require("node:assert/strict");

const { Jugador } = require("./jugador");
const { Equipo } = require("./equipo");
const { Partida } = require("./partida");

// ---------- Comportamiento de la hoja ----------

test("un Jugador cuenta como 1 jugador y expone sus propias estadísticas", () => {
  const jugador = new Jugador("Oscar", { nivel: 5, kills: 10, muertes: 2 });
  assert.strictEqual(jugador.contarJugadores(), 1);
  assert.deepStrictEqual(jugador.estadisticas(), { jugadores: 1, kills: 10, muertes: 2 });
});

// ---------- Comportamiento del composite: Equipo ----------

test("un Equipo agrega el conteo y las estadísticas de sus jugadores", () => {
  const equipo = new Equipo("Rojo");
  equipo.agregar(new Jugador("Oscar", { kills: 10, muertes: 2 }));
  equipo.agregar(new Jugador("Jesus", { kills: 7, muertes: 4 }));

  assert.strictEqual(equipo.contarJugadores(), 2);
  assert.deepStrictEqual(equipo.estadisticas(), { jugadores: 2, kills: 17, muertes: 6 });
});

test("agregar() es encadenable (fluent)", () => {
  const equipo = new Equipo("Rojo");
  const resultado = equipo.agregar(new Jugador("Oscar")).agregar(new Jugador("Jesus"));
  assert.strictEqual(resultado, equipo);
  assert.strictEqual(equipo.contarJugadores(), 2);
});

test("quitar() remueve un jugador y las estadísticas se recalculan", () => {
  const equipo = new Equipo("Rojo");
  const oscar = new Jugador("Oscar", { kills: 10, muertes: 2 });
  equipo.agregar(oscar).agregar(new Jugador("Jesus", { kills: 5, muertes: 1 }));

  equipo.quitar(oscar);

  assert.strictEqual(equipo.contarJugadores(), 1);
  assert.strictEqual(equipo.estadisticas().kills, 5);
});

// ---------- Composite anidado: Partida contiene Equipos contienen Jugadores ----------

test("una Partida agrega recursivamente el conteo de todos los equipos", () => {
  const equipoA = new Equipo("Rojo")
    .agregar(new Jugador("Oscar", { kills: 10, muertes: 2 }))
    .agregar(new Jugador("Jesus", { kills: 7, muertes: 4 }));

  const equipoB = new Equipo("Azul")
    .agregar(new Jugador("Ana", { kills: 3, muertes: 5 }))
    .agregar(new Jugador("Luis", { kills: 2, muertes: 6 }))
    .agregar(new Jugador("Sara", { kills: 1, muertes: 1 }));

  const partida = new Partida("arena_01").agregar(equipoA).agregar(equipoB);

  assert.strictEqual(partida.contarJugadores(), 5);
  assert.deepStrictEqual(partida.estadisticas(), { jugadores: 5, kills: 23, muertes: 18 });
});

test("equipoConMasKills() identifica el equipo con más kills sin conocer sus jugadores", () => {
  const equipoA = new Equipo("Rojo").agregar(new Jugador("Oscar", { kills: 10 }));
  const equipoB = new Equipo("Azul")
    .agregar(new Jugador("Ana", { kills: 8 }))
    .agregar(new Jugador("Luis", { kills: 8 })); // 16 kills en total, gana el equipo

  const partida = new Partida("arena_02").agregar(equipoA).agregar(equipoB);

  assert.strictEqual(partida.equipoConMasKills(), equipoB);
});

test("equipoConMasKills() en una partida sin equipos devuelve null", () => {
  const partida = new Partida("arena_vacia");
  assert.strictEqual(partida.equipoConMasKills(), null);
});

// ---------- Composite de profundidad arbitraria (un equipo dentro de otro) ----------

test("un Equipo puede contener un sub-equipo anidado y la recursión sigue funcionando", () => {
  const escuadraSecundaria = new Equipo("Escuadra B").agregar(new Jugador("Eli", { kills: 4 }));
  const equipoPrincipal = new Equipo("Rojo")
    .agregar(new Jugador("Oscar", { kills: 10 }))
    .agregar(escuadraSecundaria); // un Equipo dentro de otro Equipo

  assert.strictEqual(equipoPrincipal.contarJugadores(), 2);
  assert.strictEqual(equipoPrincipal.estadisticas().kills, 14);
});

// ---------- Código cliente polimórfico ----------

test("código cliente trata Jugador y Equipo de forma uniforme (misma interfaz)", () => {
  const participantes = [
    new Jugador("SoloQueue", { kills: 3 }),
    new Equipo("Rojo").agregar(new Jugador("Oscar", { kills: 5 })).agregar(new Jugador("Jesus", { kills: 2 })),
  ];

  const totalJugadores = participantes.reduce((total, p) => total + p.contarJugadores(), 0);
  assert.strictEqual(totalJugadores, 3); // 1 (SoloQueue) + 2 (equipo Rojo)
});

// ---------- Estructura impresa ----------

test("imprimirEstructura() genera el árbol completo con sangría por nivel", () => {
  const equipo = new Equipo("Rojo").agregar(new Jugador("Oscar", { nivel: 5 }));
  const partida = new Partida("arena_03").agregar(equipo);

  const texto = partida.imprimirEstructura();
  const lineas = texto.split("\n");

  assert.strictEqual(lineas[0], "Partida: arena_03");
  assert.strictEqual(lineas[1], "  Equipo: Rojo");
  assert.ok(lineas[2].startsWith("    - Oscar"));
});
