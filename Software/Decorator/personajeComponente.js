/**
 * personajeComponente.js
 * -------------------------
 * "Component" del patrón Decorator: la interfaz de stats de combate
 * que comparten un JugadorBase (sin ningún efecto encima) y cualquier
 * decorador que lo envuelva (Escudo, Botas de velocidad, Veneno,
 * Furia...). Gracias a esta interfaz común, el resto del motor
 * pregunta "¿cuánto daño hace este personaje ahora mismo?" sin saber
 * ni importarle cuántos efectos tiene encima.
 */

class PersonajeComponente {
  obtenerDano() {
    throw new Error("obtenerDano() debe implementarse en la subclase.");
  }

  obtenerDefensa() {
    throw new Error("obtenerDefensa() debe implementarse en la subclase.");
  }

  obtenerVelocidad() {
    throw new Error("obtenerVelocidad() debe implementarse en la subclase.");
  }

  describir() {
    throw new Error("describir() debe implementarse en la subclase.");
  }
}

module.exports = { PersonajeComponente };
