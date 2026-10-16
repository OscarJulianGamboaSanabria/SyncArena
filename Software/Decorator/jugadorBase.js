/**
 * jugadorBase.js
 * ----------------
 * Componente concreto: un jugador "desnudo", sin ningún efecto ni
 * habilidad encima. Es el objeto que los decoradores van a envolver.
 */

const { PersonajeComponente } = require("./personajeComponente");

class JugadorBase extends PersonajeComponente {
  constructor(nombre, { dano = 10, defensa = 10, velocidad = 10 } = {}) {
    super();
    this.nombre = nombre;
    this._dano = dano;
    this._defensa = defensa;
    this._velocidad = velocidad;
  }

  obtenerDano() {
    return this._dano;
  }

  obtenerDefensa() {
    return this._defensa;
  }

  obtenerVelocidad() {
    return this._velocidad;
  }

  describir() {
    return this.nombre;
  }
}

module.exports = { JugadorBase };
