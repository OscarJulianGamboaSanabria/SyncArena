/**
 * motorFisico.js
 * ----------------
 * Interfaz objetivo (target) del patrón Adapter: el contrato que el
 * resto de SyncArena (sistema de movimiento, detección de colisiones,
 * resolución de partidas) espera de CUALQUIER backend de física,
 * sin importar qué librería lo implemente por dentro.
 */

class MotorFisico {
  registrarCuerpo(idEntidad, posicionInicial) {
    throw new Error("registrarCuerpo() debe implementarse en el adapter.");
  }

  aplicarFuerza(idEntidad, vectorFuerza) {
    throw new Error("aplicarFuerza() debe implementarse en el adapter.");
  }

  actualizar(deltaSegundos) {
    throw new Error("actualizar() debe implementarse en el adapter.");
  }

  obtenerPosicion(idEntidad) {
    throw new Error("obtenerPosicion() debe implementarse en el adapter.");
  }

  // caja = { x, y, ancho, alto }
  hayColision(cajaA, cajaB) {
    throw new Error("hayColision() debe implementarse en el adapter.");
  }
}

module.exports = { MotorFisico };
