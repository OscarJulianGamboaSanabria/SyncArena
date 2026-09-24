/**
 * sesionJuego.js
 * ----------------
 * "Abstracción" del patrón Bridge: representa un tipo de sesión o
 * partida (casual, clasificada, torneo...). Cada sesión NO sabe cómo
 * se transmiten los datos por la red; solo conoce la interfaz
 * `CanalComunicacion` y le delega el envío real.
 *
 * Esta es la mitad "conceptual" del Bridge: qué reglas tiene cada
 * tipo de partida sobre sus eventos. La otra mitad, cómo viajan esos
 * eventos por la red, vive en canalesConcretos.js y es intercambiable
 * sin tocar esta clase.
 */

class SesionJuego {
  constructor(idPartida, canal) {
    if (new.target === SesionJuego) {
      throw new Error("SesionJuego es abstracta, no se puede instanciar directamente.");
    }
    this.idPartida = idPartida;
    this._canal = canal; // el "puente" hacia el canal de comunicación real
    this._canal.conectar();
  }

  /**
   * Cambiar de canal en pleno vuelo (por ejemplo, si el servidor
   * detecta que conviene degradar de WebSocket a UDP, o viceversa).
   * Esto es posible justamente porque la sesión nunca depende de los
   * detalles internos de un canal concreto.
   */
  cambiarCanal(nuevoCanal) {
    this._canal.desconectar();
    this._canal = nuevoCanal;
    this._canal.conectar();
  }

  // Cada tipo de sesión decide qué hacer con un evento ANTES de
  // delegar el envío real al canal.
  transmitirEvento(evento, destinatarios) {
    throw new Error("transmitirEvento() debe implementarse en la sesión concreta.");
  }

  estadisticasCanal() {
    return this._canal.estadisticas();
  }
}

module.exports = { SesionJuego };
