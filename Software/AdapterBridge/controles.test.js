/**
 * controles.test.js
 * --------------------
 * Pruebas de funcionamiento para la mezcla Adapter + Bridge aplicada
 * al sistema de controles de SyncArena. Usa el test runner nativo de
 * Node (node:test).
 *
 * Ejecutar con: node --test
 */

const test = require("node:test");
const assert = require("node:assert/strict");

const { TecladoNativo, MandoNativo, PantallaTactilNativa } = require("./dispositivosNativos");
const { TecladoAdapter, MandoAdapter, PantallaTactilAdapter } = require("./adaptadoresDispositivo");
const { EsquemaEstandar, EsquemaInvertido, EsquemaAccesibilidad } = require("./esquemasConcretos");

// ---------- Adapter: cada dispositivo normaliza correctamente ----------

test("TecladoAdapter traduce teclas WASD a ejes discretos [-1, 1]", () => {
  const teclado = new TecladoNativo();
  teclado.presionar("d");
  teclado.presionar("w");
  teclado.presionar("espacio");

  const adapter = new TecladoAdapter(teclado);
  const estado = adapter.leerEstado();

  assert.strictEqual(estado.ejeX, 1);
  assert.strictEqual(estado.ejeY, 1);
  assert.strictEqual(estado.accionPrimaria, true);
  assert.strictEqual(estado.accionSecundaria, false);
});

test("TecladoAdapter con teclas opuestas se cancela a 0", () => {
  const teclado = new TecladoNativo();
  teclado.presionar("a");
  teclado.presionar("d");

  const estado = new TecladoAdapter(teclado).leerEstado();
  assert.strictEqual(estado.ejeX, 0);
});

test("MandoAdapter pasa el stick ya normalizado prácticamente sin cambios", () => {
  const mando = new MandoNativo();
  mando.moverStickIzquierdo(0.5, -0.8);
  mando.presionarBoton("A");

  const estado = new MandoAdapter(mando).leerEstado();
  assert.strictEqual(estado.ejeX, 0.5);
  assert.strictEqual(estado.ejeY, -0.8);
  assert.strictEqual(estado.accionPrimaria, true);
});

test("PantallaTactilAdapter normaliza píxeles a [-1, 1] con clamp", () => {
  const pantalla = new PantallaTactilNativa(50); // radio máximo 50px
  pantalla.arrastrarJoystickVirtual(25, -100); // X a mitad de camino, Y se excede del radio
  pantalla.tocarBotonVirtual("primario");

  const estado = new PantallaTactilAdapter(pantalla).leerEstado();
  assert.strictEqual(estado.ejeX, 0.5);
  assert.strictEqual(estado.ejeY, -1); // clamp: -100/50 = -2 -> se recorta a -1
  assert.strictEqual(estado.accionPrimaria, true);
});

// ---------- Bridge: el esquema no sabe (ni le importa) qué dispositivo usa ----------

test("EsquemaEstandar produce el mismo resultado semántico con cualquier dispositivo", () => {
  const teclado = new TecladoNativo();
  teclado.presionar("d");
  const porTeclado = new EsquemaEstandar(new TecladoAdapter(teclado)).procesarEntrada();

  const mando = new MandoNativo();
  mando.moverStickIzquierdo(1, 0);
  const porMando = new EsquemaEstandar(new MandoAdapter(mando)).procesarEntrada();

  assert.deepStrictEqual(porTeclado.mover, { x: 1, y: 0 });
  assert.deepStrictEqual(porMando.mover, { x: 1, y: 0 });
});

test("EsquemaInvertido invierte solo el eje Y, sin importar el dispositivo", () => {
  const mando = new MandoNativo();
  mando.moverStickIzquierdo(0.4, 0.6);

  const resultado = new EsquemaInvertido(new MandoAdapter(mando)).procesarEntrada();
  assert.strictEqual(resultado.mover.x, 0.4);
  assert.strictEqual(resultado.mover.y, -0.6);
});

test("EsquemaAccesibilidad aplica zona muerta: movimientos pequeños se ignoran", () => {
  const mando = new MandoNativo();
  mando.moverStickIzquierdo(0.1, 0.1); // magnitud ~0.14, por debajo de la zona muerta 0.3

  const resultado = new EsquemaAccesibilidad(new MandoAdapter(mando)).procesarEntrada();
  assert.deepStrictEqual(resultado.mover, { x: 0, y: 0 });
});

test("EsquemaAccesibilidad ajusta (\"snap\") un movimiento fuerte a 8 direcciones", () => {
  const mando = new MandoNativo();
  mando.moverStickIzquierdo(0.9, 0.1); // casi horizontal puro -> debería ajustarse a (1, 0)

  const resultado = new EsquemaAccesibilidad(new MandoAdapter(mando)).procesarEntrada();
  assert.strictEqual(resultado.mover.x, 1);
  assert.strictEqual(resultado.mover.y, 0);
});

// ---------- Cambiar de dispositivo sin perder el esquema (el puente del Bridge) ----------

test("cambiarDispositivo() permite pasar de teclado a mando sin perder el esquema elegido", () => {
  const teclado = new TecladoNativo();
  teclado.presionar("w");
  const esquema = new EsquemaInvertido(new TecladoAdapter(teclado));

  assert.strictEqual(esquema.dispositivoActual(), "teclado");
  assert.strictEqual(esquema.procesarEntrada().mover.y, -1); // invertido: w (arriba) -> -1

  const mando = new MandoNativo();
  mando.moverStickIzquierdo(0, 1);
  esquema.cambiarDispositivo(new MandoAdapter(mando));

  assert.strictEqual(esquema.dispositivoActual(), "mando");
  assert.strictEqual(esquema.procesarEntrada().mover.y, -1); // sigue invertido, ahora con el mando
});

// ---------- Las dos jerarquías combinadas: matriz completa sin clases extra ----------

test("las 3 esquemas funcionan con los 3 dispositivos sin ninguna clase adicional", () => {
  const dispositivos = [
    new TecladoAdapter((() => {
      const t = new TecladoNativo();
      t.presionar("d");
      return t;
    })()),
    new MandoAdapter((() => {
      const m = new MandoNativo();
      m.moverStickIzquierdo(1, 0);
      return m;
    })()),
    new PantallaTactilAdapter((() => {
      const p = new PantallaTactilNativa(50);
      p.arrastrarJoystickVirtual(50, 0);
      return p;
    })()),
  ];

  const Esquemas = [EsquemaEstandar, EsquemaInvertido, EsquemaAccesibilidad];

  for (const dispositivo of dispositivos) {
    for (const Esquema of Esquemas) {
      const resultado = new Esquema(dispositivo).procesarEntrada();
      assert.ok("mover" in resultado); // las 9 combinaciones responden con la misma forma
    }
  }
});
