/**
 * gameServerManager.js
 * ---------------------
 * Aporte concreto al pilar "Gestión de partidas, jugadores y rankings"
 * de SyncArena, usando el patrón Singleton.
 *
 * Por qué Singleton aquí:
 * En un motor multijugador debe existir UN solo punto de verdad que sepa
 * qué partidas están activas, qué jugadores están conectados y cuál es
 * el ranking global. Si cada módulo (chat, matchmaking, economía) creara
 * su propia copia de este gestor, el estado se desincronizaría entre
 * jugadores -> justo el problema que SyncArena busca evitar.
 */

const { crearSingleton } = require("./singleton");

class Partida {
  constructor(idPartida) {
    this.idPartida = idPartida;
    this.jugadores = [];
    this.estado = "esperando"; // esperando | en_curso | finalizada
  }
}

class GameServerManagerBase {
  constructor() {
    this._partidas = new Map();
    this._jugadoresConectados = [];
    this._ranking = new Map();
  }

  // ---------- Gestión de partidas ----------

  crearPartida(idPartida) {
    if (this._partidas.has(idPartida)) {
      throw new Error(`La partida '${idPartida}' ya existe.`);
    }
    const partida = new Partida(idPartida);
    this._partidas.set(idPartida, partida);
    return partida;
  }

  unirJugadorAPartida(idPartida, jugador) {
    const partida = this._partidas.get(idPartida);
    if (!partida) {
      throw new Error(`La partida '${idPartida}' no existe.`);
    }
    if (!partida.jugadores.includes(jugador)) {
      partida.jugadores.push(jugador);
    }
  }

  finalizarPartida(idPartida) {
    const partida = this._partidas.get(idPartida);
    if (!partida) {
      throw new Error(`La partida '${idPartida}' no existe.`);
    }
    partida.estado = "finalizada";
  }

  obtenerPartida(idPartida) {
    return this._partidas.get(idPartida);
  }

  // ---------- Gestión de jugadores conectados ----------

  conectarJugador(jugador) {
    if (!this._jugadoresConectados.includes(jugador)) {
      this._jugadoresConectados.push(jugador);
    }
    if (!this._ranking.has(jugador)) {
      this._ranking.set(jugador, 0);
    }
  }

  desconectarJugador(jugador) {
    this._jugadoresConectados = this._jugadoresConectados.filter(
      (j) => j !== jugador
    );
  }

  jugadoresConectados() {
    return [...this._jugadoresConectados];
  }

  // ---------- Ranking ----------

  sumarPuntos(jugador, puntos) {
    const actual = this._ranking.get(jugador) || 0;
    this._ranking.set(jugador, actual + puntos);
  }

  obtenerRanking() {
    return [...this._ranking.entries()].sort((a, b) => b[1] - a[1]);
  }
}

// Aplicamos el Singleton genérico sobre la clase base
const GameServerManager = crearSingleton(GameServerManagerBase);

module.exports = { GameServerManager };
