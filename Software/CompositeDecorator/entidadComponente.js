/**
 * entidadComponente.js
 * -----------------------
 * Interfaz común a las TRES piezas de esta mezcla:
 * - Hojas (Personaje, Arma, Objeto)
 * - El contenedor Composite (Grupo)
 * - Los decoradores de habilidades (EfectoDecorator y concretos)
 *
 * Que las tres compartan exactamente la misma interfaz es lo que
 * permite la combinación real: un Grupo puede contener personajes
 * decorados sin saberlo, y un decorador puede envolver tanto un
 * personaje suelto como un Grupo entero sin saberlo tampoco.
 */

class EntidadComponente {
  obtenerPoder() {
    throw new Error("obtenerPoder() debe implementarse en la subclase.");
  }

  describir(profundidad = 0) {
    throw new Error("describir() debe implementarse en la subclase.");
  }

  esInvisible() {
    throw new Error("esInvisible() debe implementarse en la subclase.");
  }

  // 1 para una hoja; para un Grupo, la suma recursiva de sus miembros.
  // La reutiliza AuraLiderazgoDecorator para escalar su bonus según el
  // tamaño de lo que esté envolviendo, sea una hoja o un Grupo entero.
  contarMiembros() {
    throw new Error("contarMiembros() debe implementarse en la subclase.");
  }

  // Avanza un turno de juego. Las hojas no hacen nada (no-op); el
  // Grupo lo propaga a sus hijos; los decoradores lo propagan y
  // además revisan si su propio efecto ya expiró.
  avanzarTurno() {}
}

module.exports = { EntidadComponente };
