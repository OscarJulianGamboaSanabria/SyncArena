/**
 * physicsAdapters.test.js
 * --------------------------
 * Pruebas de funcionamiento para el patrón Adapter aplicado a la capa
 * de físicas de SyncArena. Usa el test runner nativo de Node
 * (node:test).
 *
 * Ejecutar con: node --test
 */

const test = require("node:test");
const assert = require("node:assert/strict");

const { MotorFisico } = require("./motorFisico");
const { LitePhysicsAdapter, ArcadePhysicsAdapter } = require("./physicsAdapters");

const adaptersAProbar = [
  ["LitePhysicsAdapter", LitePhysicsAdapter],
  ["ArcadePhysicsAdapter", ArcadePhysicsAdapter],
];

// ---------- Ambos adapters cumplen la misma interfaz ----------

for (const [nombre, Adapter] of adaptersAProbar) {
  test(`${nombre} es una instancia de MotorFisico`, () => {
    const motor = new Adapter();
    assert.ok(motor instanceof MotorFisico);
  });

  test(`${nombre}: registrar y obtener posición inicial`, () => {
    const motor = new Adapter();
    motor.registrarCuerpo("jugador_1", { x: 10, y: 20 });
    assert.deepStrictEqual(motor.obtenerPosicion("jugador_1"), { x: 10, y: 20 });
  });

  test(`${nombre}: aplicar fuerza y avanzar el tiempo mueve el cuerpo`, () => {
    const motor = new Adapter();
    motor.registrarCuerpo("jugador_1", { x: 0, y: 0 });
    motor.aplicarFuerza("jugador_1", { x: 5, y: 0 }); // velocidad 5 en X

    motor.actualizar(1); // 1 segundo

    const posicion = motor.obtenerPosicion("jugador_1");
    assert.strictEqual(posicion.x, 5);
    assert.strictEqual(posicion.y, 0);
  });

  test(`${nombre}: detecta colisión entre dos cajas superpuestas`, () => {
    const motor = new Adapter();
    const cajaA = { x: 0, y: 0, ancho: 10, alto: 10 };
    const cajaB = { x: 5, y: 5, ancho: 10, alto: 10 };
    assert.strictEqual(motor.hayColision(cajaA, cajaB), true);
  });

  test(`${nombre}: NO detecta colisión entre dos cajas separadas`, () => {
    const motor = new Adapter();
    const cajaA = { x: 0, y: 0, ancho: 5, alto: 5 };
    const cajaB = { x: 100, y: 100, ancho: 5, alto: 5 };
    assert.strictEqual(motor.hayColision(cajaA, cajaB), false);
  });
}

// ---------- El código cliente funciona igual sin importar el adapter ----------

function simularFrame(motorFisico) {
  motorFisico.registrarCuerpo("bala_1", { x: 0, y: 0 });
  motorFisico.aplicarFuerza("bala_1", { x: 10, y: 0 });
  motorFisico.actualizar(0.5); // medio segundo
  return motorFisico.obtenerPosicion("bala_1");
}

test("el mismo código cliente produce el mismo resultado con ambos adapters", () => {
  const resultadoLite = simularFrame(new LitePhysicsAdapter());
  const resultadoArcade = simularFrame(new ArcadePhysicsAdapter());

  assert.deepStrictEqual(resultadoLite, resultadoArcade);
  assert.deepStrictEqual(resultadoLite, { x: 5, y: 0 });
});

test("ArcadePhysicsAdapter convierte correctamente segundos a milisegundos", () => {
  const motor = new ArcadePhysicsAdapter();
  motor.registrarCuerpo("e1", { x: 0, y: 0 });
  motor.aplicarFuerza("e1", { x: 2, y: 0 });
  motor.actualizar(2); // 2 segundos -> internamente 2000 ms

  assert.strictEqual(motor.obtenerPosicion("e1").x, 4);
});
