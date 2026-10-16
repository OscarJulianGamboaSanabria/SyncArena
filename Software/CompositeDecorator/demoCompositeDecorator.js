/**
 * demoCompositeDecorator.js
 * ----------------------------
 * Demo ejecutable (no es una prueba formal) que arma una escuadra
 * mixta: un líder decorado con Escudo + Invisibilidad temporal, un
 * miembro normal, un arma suelta, un objeto, y una sub-escuadra de
 * reserva envuelta en Aura de Liderazgo — y muestra cómo todo eso se
 * agrega en un único árbol, y cómo cambia con el paso de los turnos.
 */

const { Personaje, Arma, Objeto } = require("./entidadesHoja");
const { Grupo } = require("./grupo");
const {
  EscudoDecorator,
  VelocidadExtraDecorator,
  InvisibilidadDecorator,
  AuraLiderazgoDecorator,
} = require("./efectosConcretos");

const lider = new EscudoDecorator(
  new InvisibilidadDecorator(new Personaje("Oscar", { dano: 12, defensa: 10, velocidad: 8 }), 2)
);

const apoyo = new VelocidadExtraDecorator(new Personaje("Jesus", { dano: 8, defensa: 8, velocidad: 10 }));

const reserva = new AuraLiderazgoDecorator(
  new Grupo("Reserva")
    .agregar(new Personaje("Ana", { dano: 6, defensa: 6, velocidad: 6 }))
    .agregar(new Personaje("Luis", { dano: 6, defensa: 6, velocidad: 6 }))
);

const escuadra = new Grupo("Escuadra Alfa")
  .agregar(lider)
  .agregar(apoyo)
  .agregar(new Arma("Espada Encantada", 8))
  .agregar(new Objeto("Poción de maná", 3))
  .agregar(reserva);

console.log("=== Estructura completa de la escuadra ===");
console.log(escuadra.describir());

console.log("\n=== Totales ===");
console.log("Poder total de la escuadra:", escuadra.obtenerPoder());
console.log("Entidades totales (personajes + armas + objetos):", escuadra.contarMiembros(), "(4 personajes, 1 arma, 1 objeto)");
console.log("¿La escuadra es invisible?", escuadra.esInvisible(), "(no, porque solo Oscar lo es)");

console.log("\n--- Pasan 2 turnos (expira la invisibilidad de Oscar) ---");
escuadra.avanzarTurno();
escuadra.avanzarTurno();

console.log("\n=== Estructura tras 2 turnos ===");
console.log(escuadra.describir());
console.log("\nPoder total de la escuadra:", escuadra.obtenerPoder(), "(Escudo de Oscar sigue activo, permanente)");
