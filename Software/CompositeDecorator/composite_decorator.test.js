/**
 * composite_decorator.test.js
 * ------------------------------
 * Pruebas de funcionamiento para la mezcla Composite + Decorator de
 * SyncArena. Usa el test runner nativo de Node (node:test).
 *
 * Ejecutar con: node --test
 */

const test = require("node:test");
const assert = require("node:assert/strict");

const { Personaje, Arma, Objeto } = require("./entidadesHoja");
const { Grupo } = require("./grupo");
const {
  EscudoDecorator,
  VelocidadExtraDecorator,
  InvisibilidadDecorator,
  AuraLiderazgoDecorator,
} = require("./efectosConcretos");

// ---------- Comportamiento base (Composite solo) ----------

test("un Grupo suma el poder de personajes, armas y objetos mezclados", () => {
  const grupo = new Grupo("Escuadra")
    .agregar(new Personaje("Oscar", { dano: 10, defensa: 10, velocidad: 10 })) // poder 30
    .agregar(new Arma("Espada+1", 8))
    .agregar(new Objeto("Poción", 2));

  assert.strictEqual(grupo.obtenerPoder(), 40);
  assert.strictEqual(grupo.contarMiembros(), 3);
});

test("un Grupo anidado dentro de otro Grupo agrega su poder recursivamente", () => {
  const reserva = new Grupo("Reserva").agregar(new Personaje("Jesus", { dano: 5, defensa: 5, velocidad: 5 }));
  const principal = new Grupo("Principal")
    .agregar(new Personaje("Oscar", { dano: 10, defensa: 10, velocidad: 10 }))
    .agregar(reserva);

  assert.strictEqual(principal.obtenerPoder(), 45); // 30 + 15
  assert.strictEqual(principal.contarMiembros(), 2); // Oscar + Jesus (recursivo, no cuenta el sub-grupo como 1)
});

// ---------- Decorator sobre una hoja ----------

test("EscudoDecorator suma poder a un Personaje sin modificar el original", () => {
  const oscar = new Personaje("Oscar", { dano: 10, defensa: 10, velocidad: 10 });
  const conEscudo = new EscudoDecorator(oscar);

  assert.strictEqual(conEscudo.obtenerPoder(), 50); // 30 + 20
  assert.strictEqual(oscar.obtenerPoder(), 30); // el original queda intacto
});

test("varios efectos se apilan sobre la misma hoja", () => {
  const oscar = new Personaje("Oscar", { dano: 10, defensa: 10, velocidad: 10 });
  const personaje = new VelocidadExtraDecorator(new EscudoDecorator(oscar));

  assert.strictEqual(personaje.obtenerPoder(), 58); // 30 + 20 + 8
});

// ---------- El punto central: Decorator sobre un Grupo completo (Composite) ----------

test("EscudoDecorator también funciona envolviendo un Grupo entero, no solo una hoja", () => {
  const grupo = new Grupo("Escuadra")
    .agregar(new Personaje("Oscar", { dano: 10, defensa: 10, velocidad: 10 }))
    .agregar(new Personaje("Jesus", { dano: 5, defensa: 5, velocidad: 5 }));

  const grupoConEscudo = new EscudoDecorator(grupo);
  assert.strictEqual(grupoConEscudo.obtenerPoder(), 65); // (30+15) + 20
});

test("AuraLiderazgoDecorator escala +2 por miembro, sea una hoja o un Grupo", () => {
  const unaHoja = new Personaje("SoloQueue", { dano: 10, defensa: 0, velocidad: 0 });
  const conAuraHoja = new AuraLiderazgoDecorator(unaHoja);
  assert.strictEqual(conAuraHoja.obtenerPoder(), 12); // 10 + (1 miembro x 2)

  const grupoDeCinco = new Grupo("Escuadra");
  for (let i = 0; i < 5; i++) grupoDeCinco.agregar(new Personaje(`P${i}`, { dano: 0, defensa: 0, velocidad: 0 }));
  const conAuraGrupo = new AuraLiderazgoDecorator(grupoDeCinco);

  assert.strictEqual(conAuraGrupo.obtenerPoder(), 10); // 0 + (5 miembros x 2), mismo decorador sin cambios
});

// ---------- Composite conteniendo hojas YA decoradas ----------

test("un Grupo calcula su poder correctamente cuando sus miembros ya vienen decorados", () => {
  const oscarConEscudo = new EscudoDecorator(new Personaje("Oscar", { dano: 10, defensa: 10, velocidad: 10 }));
  const jesusNormal = new Personaje("Jesus", { dano: 5, defensa: 5, velocidad: 5 });

  const grupo = new Grupo("Escuadra").agregar(oscarConEscudo).agregar(jesusNormal);

  assert.strictEqual(grupo.obtenerPoder(), 65); // (30+20) + 15, NO 45
});

// ---------- Invisibilidad y la regla de agregación del Grupo ----------

test("un Grupo es invisible solo si TODOS sus miembros lo son", () => {
  const invisible1 = new InvisibilidadDecorator(new Personaje("Oscar"));
  const visible = new Personaje("Jesus");

  const grupoParcial = new Grupo("Escuadra").agregar(invisible1).agregar(visible);
  assert.strictEqual(grupoParcial.esInvisible(), false);

  const invisible2 = new InvisibilidadDecorator(new Personaje("Ana"));
  const grupoCompleto = new Grupo("Escuadra Fantasma").agregar(invisible1).agregar(invisible2);
  assert.strictEqual(grupoCompleto.esInvisible(), true);
});

test("InvisibilidadDecorator expira con el tiempo y el Grupo deja de ser invisible", () => {
  const invisible = new InvisibilidadDecorator(new Personaje("Oscar"), 2); // dura 2 turnos
  const grupo = new Grupo("Escuadra Fantasma").agregar(invisible);

  assert.strictEqual(grupo.esInvisible(), true);

  grupo.avanzarTurno();
  grupo.avanzarTurno(); // expira

  assert.strictEqual(grupo.esInvisible(), false);
});

// ---------- avanzarTurno() se propaga por toda la jerarquía mixta ----------

test("avanzarTurno() en un Grupo propaga a hojas, sub-grupos y decoradores anidados", () => {
  const liderTemporal = new EscudoDecorator(new Personaje("Lider", { dano: 10, defensa: 10, velocidad: 10 }), 1);
  const subgrupo = new Grupo("Reserva").agregar(new InvisibilidadDecorator(new Personaje("Ana"), 1));
  const grupoPrincipal = new Grupo("Principal").agregar(liderTemporal).agregar(subgrupo);

  assert.strictEqual(liderTemporal.estaActivo(), true);
  assert.strictEqual(subgrupo.esInvisible(), true);

  grupoPrincipal.avanzarTurno(); // un solo avance en la raíz, llega a TODO el árbol

  assert.strictEqual(liderTemporal.estaActivo(), false);
  assert.strictEqual(subgrupo.esInvisible(), false);
});
