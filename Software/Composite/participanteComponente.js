/**
 * participanteComponente.js
 * ----------------------------
 * "Component" del patrón Composite: la interfaz común que comparten
 * un Jugador individual (hoja) y cualquier agrupación de jugadores
 * (Equipo, Partida — ambos "contenedores" o "composites").
 *
 * Gracias a esta interfaz compartida, el resto del motor puede pedirle
 * a un Jugador, a un Equipo o a una Partida completa las mismas cosas
 * — cuántos jugadores contiene, sus estadísticas agregadas, su
 * estructura — sin necesidad de preguntar primero "¿esto es un
 * jugador suelto o un grupo?".
 */

class ParticipanteComponente {
  contarJugadores() {
    throw new Error("contarJugadores() debe implementarse en la subclase.");
  }

  estadisticas() {
    // Forma esperada del resultado: { jugadores, kills, muertes }
    throw new Error("estadisticas() debe implementarse en la subclase.");
  }

  imprimirEstructura(profundidad = 0) {
    throw new Error("imprimirEstructura() debe implementarse en la subclase.");
  }
}

module.exports = { ParticipanteComponente };
