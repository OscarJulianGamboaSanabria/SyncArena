/**
 * spawnRegistry.test.js
 * -----------------------
 * Pruebas de funcionamiento para el patrón Prototype aplicado al
 * spawn de entidades de SyncArena. Usa el test runner nativo de Node
 * (node:test).
 *
 * Ejecutar con: node --test
 */

const test = require("node:test");
const assert = require("node:assert/strict");

const { EnemigoZombie, PowerUpVida } = require("./entidadesConcretas");
const { crearInstancia, tiposDisponibles } = require("./spawnRegistry");

// ---------- Comportamiento del patrón Prototype ----------

test("clonar() devuelve una instancia distinta (no la misma referencia)", () => {
  const original = new EnemigoZombie();
  const clon = original.clonar();
  assert.notStrictEqual(original, clon);
});

test("clonar() conserva la clase concreta y sus métodos", () => {
  const original = new EnemigoZombie();
  const clon = original.clonar();
  assert.ok(clon instanceof EnemigoZombie);
  assert.strictEqual(typeof clon.clonar, "function");
});

test("clonar() copia los valores, no solo referencias vacías", () => {
  const original = new EnemigoZombie();
  const clon = original.clonar();
  assert.deepStrictEqual(clon.statsBase, original.statsBase);
  assert.deepStrictEqual(clon.tablaDrops, original.tablaDrops);
});

test("clonar() NO vuelve a ejecutar el setup costoso del constructor", () => {
  const vecesAntes = EnemigoZombie.vecesInicializado;
  const original = new EnemigoZombie(); // esto sí cuenta (+1)
  const vecesTrasConstruir = EnemigoZombie.vecesInicializado;

  original.clonar();
  original.clonar();
  original.clonar();
  const vecesTrasClonar = EnemigoZombie.vecesInicializado;

  assert.strictEqual(vecesTrasConstruir, vecesAntes + 1);
  assert.strictEqual(vecesTrasClonar, vecesTrasConstruir, "clonar() no debería reinicializar");
});

test("modificar un clon no afecta al original ni a otros clones (copia profunda)", () => {
  const original = new EnemigoZombie();
  const clonA = original.clonar();
  const clonB = original.clonar();

  clonA.statsBase.vida = 1;
  clonA.tablaDrops.push("item_raro");

  assert.strictEqual(original.statsBase.vida, 50);
  assert.strictEqual(clonB.statsBase.vida, 50);
  assert.strictEqual(original.tablaDrops.length, 2);
  assert.strictEqual(clonB.tablaDrops.length, 2);
});

// ---------- Registro de prototipos (spawnRegistry) ----------

test("crearInstancia() ubica la entidad en la posición pedida", () => {
  const zombie = crearInstancia("enemigo_zombie", { x: 15, y: 42 });
  assert.deepStrictEqual(zombie.posicion, { x: 15, y: 42 });
});

test("crearInstancia() con tipo desconocido lanza error", () => {
  assert.throws(() => crearInstancia("dragon_legendario"), /No hay un prototipo registrado/);
});

test("dos instancias creadas del mismo tipo son independientes entre sí", () => {
  const zombieA = crearInstancia("enemigo_zombie", { x: 0, y: 0 });
  const zombieB = crearInstancia("enemigo_zombie", { x: 5, y: 5 });

  zombieA.statsBase.vida = 1;
  assert.strictEqual(zombieB.statsBase.vida, 50);
  assert.notDeepStrictEqual(zombieA.posicion, zombieB.posicion);
});

test("tiposDisponibles() incluye los tipos registrados por defecto", () => {
  const tipos = tiposDisponibles();
  assert.ok(tipos.includes("enemigo_zombie"));
  assert.ok(tipos.includes("powerup_vida"));
});

test("crearInstancia() de un power-up conserva sus stats propios", () => {
  const powerUp = crearInstancia("powerup_vida", { x: 3, y: 3 });
  assert.ok(powerUp instanceof PowerUpVida);
  assert.strictEqual(powerUp.statsBase.curacion, 25);
});
