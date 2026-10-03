/**
 * efectoDecorator.js
 * ---------------------
 * "Decorator" abstracto del patrón: envuelve otro PersonajeComponente
 * (que puede ser un JugadorBase o, a su vez, otro decorador — así es
 * como se apilan varios efectos) y por defecto delega cada método al
 * componente envuelto, sin modificar nada.
 *
 * Además agrega algo muy propio de un motor de juegos: los efectos
 * suelen ser temporales. En vez de tener que "desenvolver" el objeto
 * cuando expira un efecto (lo cual rompería la cadena de decoradores
 * ya armada), cada decorador rastrea su propia duración y, una vez
 * expirado, simplemente deja de aplicar su modificador — vuelve a
 * comportarse como delegación pura, como si no estuviera.
 */

const { PersonajeComponente } = require("./personajeComponente");

class EfectoDecorator extends PersonajeComponente {
  constructor(componente, duracionTurnos = Infinity) {
    super();
    if (new.target === EfectoDecorator) {
      throw new Error("EfectoDecorator es abstracto, no se puede instanciar directamente.");
    }
    this._componente = componente;
    this._duracionTurnos = duracionTurnos;
    this._turnosTranscurridos = 0;
  }

  estaActivo() {
    return this._turnosTranscurridos < this._duracionTurnos;
  }

  // Avanza el turno de este decorador Y de toda la cadena que envuelve,
  // para que un efecto de adentro también pueda expirar.
  avanzarTurno() {
    this._turnosTranscurridos += 1;
    if (typeof this._componente.avanzarTurno === "function") {
      this._componente.avanzarTurno();
    }
  }

  // Delegación por defecto: una subclase que no sobrescribe un método
  // simplemente no modifica esa stat.
  obtenerDano() {
    return this._componente.obtenerDano();
  }

  obtenerDefensa() {
    return this._componente.obtenerDefensa();
  }

  obtenerVelocidad() {
    return this._componente.obtenerVelocidad();
  }

  describir() {
    return this._componente.describir();
  }
}

module.exports = { EfectoDecorator };
