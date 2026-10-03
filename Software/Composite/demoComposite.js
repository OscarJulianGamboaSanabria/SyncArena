/**
 * demoComposite.js
 * -------------------
 * Demo ejecutable (no es una prueba formal) que arma una Partida
 * completa con 2 Equipos de 3 Jugadores cada uno, imprime el árbol
 * completo de la estructura, sus estadísticas agregadas, y determina
 * el equipo ganador — todo usando la misma interfaz sin importar el
 * nivel del árbol.
 */

const { Jugador } = require("./jugador");
const { Equipo } = require("./equipo");
const { Partida } = require("./partida");

const equipoRojo = new Equipo("Rojo")
  .agregar(new Jugador("Oscar", { nivel: 12, kills: 14, muertes: 6 }))
  .agregar(new Jugador("Jesus", { nivel: 10, kills: 9, muertes: 5 }))
  .agregar(new Jugador("Ana", { nivel: 8, kills: 6, muertes: 7 }));

const equipoAzul = new Equipo("Azul")
  .agregar(new Jugador("Luis", { nivel: 11, kills: 8, muertes: 3 }))
  .agregar(new Jugador("Sara", { nivel: 9, kills: 5, muertes: 4 }))
  .agregar(new Jugador("Eli", { nivel: 13, kills: 12, muertes: 2 }));

const partida = new Partida("arena_industrial").agregar(equipoRojo).agregar(equipoAzul);

console.log("=== Estructura completa de la partida ===");
console.log(partida.imprimirEstructura());

console.log("\n=== Estadísticas agregadas (recursivas) ===");
console.log("Partida completa:", partida.estadisticas());
console.log("Solo equipo Rojo:", equipoRojo.estadisticas());
console.log("Solo equipo Azul:", equipoAzul.estadisticas());

console.log("\n=== Conteo de jugadores por nivel del árbol ===");
console.log("Jugadores en toda la partida:", partida.contarJugadores());
console.log("Jugadores en equipo Rojo:", equipoRojo.contarJugadores());

const ganador = partida.equipoConMasKills();
console.log("\n=== Equipo con más kills ===");
console.log(`${ganador.nombre} (${ganador.estadisticas().kills} kills en total)`);
