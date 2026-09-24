/**
 * sesionesConcretas.js
 * ----------------------
 * Abstracciones refinadas del Bridge: tres tipos de sesión de
 * SyncArena, cada uno con reglas propias sobre sus eventos, pero
 * todos completamente ajenos a qué canal de red los transporta.
 */

const { SesionJuego } = require("./sesionJuego");

class PartidaCasual extends SesionJuego {
  transmitirEvento(evento, destinatarios) {
    // Sin reglas extra: reenvía tal cual.
    return this._canal.enviar(evento, destinatarios);
  }
}

class PartidaClasificada extends SesionJuego {
  constructor(idPartida, canal) {
    super(idPartida, canal);
    this._eventosRechazados = 0;
  }

  transmitirEvento(evento, destinatarios) {
    // Regla propia de esta sesión: valida el evento antes de
    // delegar el envío (ej: anti-cheat simple).
    if (!this._esEventoValido(evento)) {
      this._eventosRechazados += 1;
      return false;
    }
    return this._canal.enviar(evento, destinatarios);
  }

  _esEventoValido(evento) {
    if (evento.tipo === "posicion" && Math.abs(evento.deltaX || 0) > 50) {
      return false; // movimiento imposible en un solo evento -> descartado
    }
    return true;
  }

  eventosRechazados() {
    return this._eventosRechazados;
  }
}

class PartidaTorneo extends SesionJuego {
  constructor(idPartida, canal) {
    super(idPartida, canal);
    this._registroReplay = [];
  }

  transmitirEvento(evento, destinatarios) {
    // Regla propia: registra cada evento para poder reconstruir un
    // replay del torneo después, además de transmitirlo.
    this._registroReplay.push({ ...evento, timestamp: this._registroReplay.length });
    return this._canal.enviar(evento, destinatarios);
  }

  registroReplay() {
    return [...this._registroReplay];
  }
}

module.exports = { PartidaCasual, PartidaClasificada, PartidaTorneo };
