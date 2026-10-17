/**
 * partidaFacade.js
 * -------------------
 * Patrón Facade: una sola llamada, `iniciarPartida(config, jugadores)`,
 * reemplaza la secuencia completa que antes tenía que conocer el
 * código cliente:
 *
 *   1. cargar los recursos del mapa
 *   2. crear la partida
 *   3. conectar a cada jugador
 *   4. marcar la partida como en curso
 *
 * Además esconde algo que el cliente casi seguro olvidaría: si un
 * paso intermedio falla (por ejemplo, un jugador duplicado en el
 * tercer paso), la fachada deshace lo que ya había hecho — desconecta
 * a los jugadores conectados y cancela la partida — para no dejar el
 * servidor en un estado a medias.
 */

const { PartidaServicio } = require("./partidaServicio");
const { ServicioRecursos, ServicioConexion, ServicioPartidas } = require("./subsistemas");

class PartidaFacade extends PartidaServicio {
  constructor({
    recursos = new ServicioRecursos(),
    conexion = new ServicioConexion(),
    partidas = new ServicioPartidas(),
  } = {}) {
    super();
    this._recursos = recursos;
    this._conexion = conexion;
    this._partidas = partidas;
    this._jugadoresPorPartida = new Map();
  }

  iniciarPartida(config, jugadores) {
    if (!Array.isArray(jugadores) || jugadores.length === 0) {
      throw new Error("Se necesita al menos un jugador para iniciar una partida.");
    }

    const recursosCargados = this._recursos.cargar(config.mapa);
    const idPartida = this._partidas.crear(config);

    const conectados = [];
    try {
      for (const jugador of jugadores) {
        this._conexion.conectar(jugador);
        conectados.push(jugador);
      }
      this._partidas.iniciar(idPartida);
    } catch (error) {
      // Rollback: no dejar jugadores conectados ni una partida huérfana
      conectados.forEach((jugador) => this._conexion.desconectar(jugador));
      this._partidas.cancelar(idPartida);
      throw error;
    }

    this._jugadoresPorPartida.set(idPartida, conectados);
    return {
      idPartida,
      mapa: config.mapa,
      jugadores: [...conectados],
      recursosCargados: recursosCargados.length,
    };
  }

  finalizarPartida(idPartida) {
    this._partidas.finalizar(idPartida);
    const jugadores = this._jugadoresPorPartida.get(idPartida) || [];
    jugadores.forEach((jugador) => this._conexion.desconectar(jugador));
    this._jugadoresPorPartida.delete(idPartida);
    return { idPartida, jugadoresDesconectados: jugadores.length };
  }
}

module.exports = { PartidaFacade };
