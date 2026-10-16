/**
 * efectoDecorator.js
 * ---------------------
 * "Decorator" abstracto: envuelve CUALQUIER EntidadComponente — un
 * Personaje suelto, un Arma, o un Grupo entero (incluido un Grupo que
 * ya tenga otros decoradores encima) — y por defecto delega cada
 * método sin modificar nada.
 *
 * Igual que en el Decorator de efectos de jugador, cada decorador
 * puede tener una duración limitada en turnos: una vez expira, deja
 * de aplicar su modificador automáticamente.
 */

const { EntidadComponente } = require("./entidadComponente");

class EfectoDecorator extends EntidadComponente {
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

  avanzarTurno() {
    this._turnosTranscurridos += 1;
    this._componente.avanzarTurno(); // se propaga hacia adentro (hoja o Grupo)
  }

  obtenerPoder() {
    return this._componente.obtenerPoder();
  }

  describir(profundidad = 0) {
    return this._componente.describir(profundidad);
  }

  esInvisible() {
    return this._componente.esInvisible();
  }

  contarMiembros() {
    return this._componente.contarMiembros();
  }
}

module.exports = { EfectoDecorator };
