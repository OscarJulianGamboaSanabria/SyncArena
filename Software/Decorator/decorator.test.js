/**
 * decorator.test.js
 * --------------------
 * Pruebas de funcionamiento para el patrón Decorator aplicado a
 * habilidades/efectos de jugador en SyncArena. Usa el test runner
 * nativo de Node (node:test).
 *
 * Ejecutar con: node --test
 */

const test = require("node:test");
const assert = require("node:assert/strict");

const { JugadorBase } = require("./jugadorBase");
const {
  EscudoDecorator,
  BotasVelocidadDecorator,
  VenenoDecorator,
  FuriaDecorator,
} = require("./efectosConcretos");

// ---------- Comportamiento base ----------

test("JugadorBase sin efectos expone sus stats tal cual", () => {
  const jugador = new JugadorBase("Oscar", { dano: 10, defensa: 10, velocidad: 10 });
  assert.strictEqual(jugador.obtenerDano(), 10);
  assert.strictEqual(jugador.obtenerDefensa(), 10);
  assert.strictEqual(jugador.obtenerVelocidad(), 10);
  assert.strictEqual(jugador.describir(), "Oscar");
});

// ---------- Un solo decorador ----------

test("EscudoDecorator suma defensa sin tocar dano ni velocidad", () => {
  const jugador = new JugadorBase("Oscar", { dano: 10, defensa: 10, velocidad: 10 });
  const conEscudo = new EscudoDecorator(jugador);

  assert.strictEqual(conEscudo.obtenerDefensa(), 25);
  assert.strictEqual(conEscudo.obtenerDano(), 10);
  assert.strictEqual(conEscudo.obtenerVelocidad(), 10);
});

test("el objeto original NO se modifica al envolverlo (inmutabilidad del componente base)", () => {
  const jugador = new JugadorBase("Oscar", { defensa: 10 });
  new EscudoDecorator(jugador); // se envuelve pero no se usa la referencia

  assert.strictEqual(jugador.obtenerDefensa(), 10); // el original sigue intacto
});

test("describir() agrega el efecto a la descripción del jugador", () => {
  const jugador = new JugadorBase("Oscar");
  const conEscudo = new EscudoDecorator(jugador);
  assert.strictEqual(conEscudo.describir(), "Oscar + Escudo(+15 def)");
});

// ---------- Apilar varios decoradores ----------

test("varios efectos se pueden apilar y cada uno modifica su propia stat", () => {
  const jugador = new JugadorBase("Oscar", { dano: 10, defensa: 10, velocidad: 10 });
  const personaje = new BotasVelocidadDecorator(new FuriaDecorator(new EscudoDecorator(jugador)));

  assert.strictEqual(personaje.obtenerDefensa(), 25); // +15 del escudo
  assert.strictEqual(personaje.obtenerDano(), 15); // x1.5 de furia (10 -> 15)
  assert.strictEqual(personaje.obtenerVelocidad(), 13); // x1.3 de botas (10 -> 13)
});

test("apilar el mismo efecto multiplicativo dos veces compone su efecto", () => {
  const jugador = new JugadorBase("Oscar", { dano: 10 });
  const conDobleFuria = new FuriaDecorator(new FuriaDecorator(jugador));

  assert.strictEqual(conDobleFuria.obtenerDano(), 23); // round(round(10*1.5)*1.5) = round(15*1.5)=23
});

test("describir() encadena las descripciones de todos los efectos activos, en orden", () => {
  const jugador = new JugadorBase("Oscar");
  const personaje = new BotasVelocidadDecorator(new EscudoDecorator(jugador));

  assert.strictEqual(personaje.describir(), "Oscar + Escudo(+15 def) + Botas(x1.3 vel)");
});

// ---------- Efectos temporales (duración por turnos) ----------

test("un efecto con duración deja de aplicarse tras expirar, sin desarmar la cadena", () => {
  const jugador = new JugadorBase("Oscar", { defensa: 10 });
  const conVeneno = new VenenoDecorator(jugador, 2); // dura 2 turnos

  assert.strictEqual(conVeneno.obtenerDefensa(), 0); // 10 - 10, activo desde el turno 0

  conVeneno.avanzarTurno(); // turno 1, sigue activo
  assert.strictEqual(conVeneno.obtenerDefensa(), 0);

  conVeneno.avanzarTurno(); // turno 2, ya expiró
  assert.strictEqual(conVeneno.obtenerDefensa(), 10); // vuelve a la defensa base
  assert.strictEqual(conVeneno.estaActivo(), false);
});

test("avanzarTurno() se propaga por toda la cadena de decoradores anidados", () => {
  const jugador = new JugadorBase("Oscar", { defensa: 10 });
  // Veneno (temporal, 1 turno) envuelto DENTRO de Escudo (permanente)
  const personaje = new EscudoDecorator(new VenenoDecorator(jugador, 1));

  assert.strictEqual(personaje.obtenerDefensa(), 15); // (10-10)+15

  personaje.avanzarTurno(); // expira el veneno interno

  assert.strictEqual(personaje.obtenerDefensa(), 25); // 10 (sin veneno) + 15 (escudo, permanente)
});

test("un efecto permanente (sin duración) nunca deja de estar activo", () => {
  const jugador = new JugadorBase("Oscar", { defensa: 10 });
  const conEscudo = new EscudoDecorator(jugador); // sin duracionTurnos -> Infinity

  for (let i = 0; i < 100; i++) conEscudo.avanzarTurno();

  assert.strictEqual(conEscudo.estaActivo(), true);
  assert.strictEqual(conEscudo.obtenerDefensa(), 25);
});

// ---------- Código cliente polimórfico ----------

test("código cliente no necesita saber cuántos decoradores tiene un personaje", () => {
  function poderDeCombate(personaje) {
    return personaje.obtenerDano() + personaje.obtenerDefensa() + personaje.obtenerVelocidad();
  }

  const sinEfectos = new JugadorBase("Oscar", { dano: 10, defensa: 10, velocidad: 10 });
  const conEfectos = new FuriaDecorator(new EscudoDecorator(sinEfectos));

  assert.strictEqual(poderDeCombate(sinEfectos), 30);
  assert.strictEqual(poderDeCombate(conEfectos), 15 + 25 + 10); // furia + escudo
});
