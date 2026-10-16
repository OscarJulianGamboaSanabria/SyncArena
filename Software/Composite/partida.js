/**
 * partida.js
 * ------------
 * Una Partida es, estructuralmente, un GrupoParticipantes cuyos hijos
 * son Equipos. Además de heredar contarJugadores()/estadisticas()/
 * imprimirEstructura() del Composite genérico, agrega una operación
 * propia de negocio (equipoConMasKills) que aprovecha justamente la
 * recursión del Composite: no necesita saber cuántos jugadores tiene
 * cada equipo ni cómo están organizados por dentro.
 */

const { GrupoParticipantes } = require("./grupoParticipantes");

class Partida extends GrupoParticipantes {
  constructor(nombre) {
    super("Partida", nombre);
  }

  equipoConMasKills() {
    const equipos = this.hijos();
    if (equipos.length === 0) return null;

    return equipos.reduce((mejor, equipoActual) => {
      const killsActual = equipoActual.estadisticas().kills;
      const killsMejor = mejor.estadisticas().kills;
      return killsActual > killsMejor ? equipoActual : mejor;
    });
  }
}

module.exports = { Partida };
