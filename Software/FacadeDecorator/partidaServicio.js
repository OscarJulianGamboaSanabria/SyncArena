/**
 * partidaServicio.js
 * ---------------------
 * Interfaz simple que comparten la fachada (PartidaFacade) y todos
 * los decoradores. Es lo que hace posible la mezcla: como la fachada
 * ya expone una interfaz pequeña y estable, un decorador puede
 * envolverla (o envolver a otro decorador) y agregar registro,
 * métricas o notificaciones sin que el código cliente se entere de
 * si habla con la fachada pelada o con tres capas encima.
 */

class PartidaServicio {
  iniciarPartida(config, jugadores) {
    throw new Error("iniciarPartida() debe implementarse en la subclase.");
  }

  finalizarPartida(idPartida) {
    throw new Error("finalizarPartida() debe implementarse en la subclase.");
  }
}

module.exports = { PartidaServicio };
