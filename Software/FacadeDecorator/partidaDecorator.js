/**
 * partidaDecorator.js
 * ----------------------
 * "Decorator" abstracto del patrón: envuelve cualquier
 * PartidaServicio — la fachada, o a su vez otro decorador — y por
 * defecto delega cada método sin modificar nada. Cada decorador
 * concreto sobrescribe solo lo que le interesa y agrega su
 * preocupación transversal (registro, métricas, notificaciones)
 * alrededor de la llamada delegada.
 */

const { PartidaServicio } = require("./partidaServicio");

class PartidaDecorator extends PartidaServicio {
  constructor(componente) {
    super();
    if (new.target === PartidaDecorator) {
      throw new Error("PartidaDecorator es abstracto, no se puede instanciar directamente.");
    }
    this._componente = componente;
  }

  iniciarPartida(config, jugadores) {
    return this._componente.iniciarPartida(config, jugadores);
  }

  finalizarPartida(idPartida) {
    return this._componente.finalizarPartida(idPartida);
  }
}

module.exports = { PartidaDecorator };
