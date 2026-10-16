/**
 * jugador.js
 * ------------
 * "Leaf" (hoja) del patrón Composite: un jugador individual. No tiene
 * hijos — es el caso base de la recursión que arma toda la estructura
 * Jugador -> Equipo -> Partida.
 */

const { ParticipanteComponente } = require("./participanteComponente");

class Jugador extends ParticipanteComponente {
  constructor(nombre, { nivel = 1, kills = 0, muertes = 0 } = {}) {
    super();
    this.nombre = nombre;
    this.nivel = nivel;
    this.kills = kills;
    this.muertes = muertes;
  }

  contarJugadores() {
    return 1;
  }

  estadisticas() {
    return { jugadores: 1, kills: this.kills, muertes: this.muertes };
  }

  imprimirEstructura(profundidad = 0) {
    const sangria = "  ".repeat(profundidad);
    return `${sangria}- ${this.nombre} (nivel ${this.nivel}, ${this.kills}K/${this.muertes}M)`;
  }
}

module.exports = { Jugador };
