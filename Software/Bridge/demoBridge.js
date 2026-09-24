/**
 * demoBridge.js
 * ---------------
 * Demo ejecutable (no es una prueba formal) que arma la matriz
 * completa de 3 tipos de sesión x 2 canales (6 combinaciones), para
 * mostrar que ambas jerarquías varían de forma independiente sin
 * necesitar una subclase por cada combinación.
 */

const { CanalWebSocket, CanalUDP } = require("./canalesConcretos");
const { PartidaCasual, PartidaClasificada, PartidaTorneo } = require("./sesionesConcretas");

const tiposDeSesion = [
  ["PartidaCasual", PartidaCasual],
  ["PartidaClasificada", PartidaClasificada],
  ["PartidaTorneo", PartidaTorneo],
];

const tiposDeCanal = [
  ["CanalWebSocket", CanalWebSocket],
  ["CanalUDP", CanalUDP],
];

console.log("Matriz de combinaciones (tipo de sesión x canal de red):\n");

for (const [nombreSesion, Sesion] of tiposDeSesion) {
  for (const [nombreCanal, Canal] of tiposDeCanal) {
    const sesion = new Sesion(`${nombreSesion}_${nombreCanal}`, new Canal());

    for (let i = 0; i < 6; i++) {
      sesion.transmitirEvento({ tipo: "posicion", deltaX: 3 }, ["jugador_1"]);
    }

    const stats = sesion.estadisticasCanal();
    console.log(
      `[${nombreSesion} + ${nombreCanal}] entregados: ${stats.entregados}/${stats.intentados} ` +
        `(confiable: ${stats.confiable})`
    );
  }
}

console.log("\n--- Cambio de canal en pleno vuelo (degradación WebSocket -> UDP) ---");
const sesionCritica = new PartidaClasificada("ranked_demo", new CanalWebSocket());
sesionCritica.transmitirEvento({ tipo: "posicion", deltaX: 4 }, ["jugador_1"]);
console.log("Canal inicial:", sesionCritica.estadisticasCanal().protocolo);

sesionCritica.cambiarCanal(new CanalUDP());
sesionCritica.transmitirEvento({ tipo: "posicion", deltaX: 4 }, ["jugador_1"]);
console.log("Canal tras cambiarCanal():", sesionCritica.estadisticasCanal().protocolo);
