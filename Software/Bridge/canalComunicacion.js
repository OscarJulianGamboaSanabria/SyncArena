/**
 * canalComunicacion.js
 * ----------------------
 * "Implementor" del patrón Bridge: el contrato que debe cumplir
 * cualquier forma de comunicarse por red, sin importar el protocolo
 * real que use por dentro (WebSocket, UDP, o el que se agregue después).
 *
 * Esta jerarquía (canales) es completamente independiente de la
 * jerarquía de tipos de sesión/partida (ver sesionJuego.js). El
 * Bridge es justamente el puente entre las dos: cualquier tipo de
 * sesión puede usar cualquier canal, sin que una jerarquía conozca los
 * detalles internos de la otra.
 */

class CanalComunicacion {
  conectar() {
    throw new Error("conectar() debe implementarse en el canal concreto.");
  }

  desconectar() {
    throw new Error("desconectar() debe implementarse en el canal concreto.");
  }

  // destinatarios: array de ids de jugador; mensaje: objeto plano serializable
  enviar(mensaje, destinatarios) {
    throw new Error("enviar() debe implementarse en el canal concreto.");
  }

  estadisticas() {
    throw new Error("estadisticas() debe implementarse en el canal concreto.");
  }
}

module.exports = { CanalComunicacion };
