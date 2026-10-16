/**
 * entidadesHoja.js
 * -------------------
 * "Leaf" del Composite: las tres clases de entidad que puede contener
 * un Grupo, y que un EfectoDecorator puede envolver directamente.
 */

const { EntidadComponente } = require("./entidadComponente");

class Personaje extends EntidadComponente {
  constructor(nombre, { dano = 10, defensa = 10, velocidad = 10 } = {}) {
    super();
    this.nombre = nombre;
    this._poder = dano + defensa + velocidad;
  }

  obtenerPoder() {
    return this._poder;
  }

  describir(profundidad = 0) {
    return `${"  ".repeat(profundidad)}- ${this.nombre} (Personaje, poder ${this.obtenerPoder()})`;
  }

  esInvisible() {
    return false;
  }

  contarMiembros() {
    return 1;
  }
}

class Arma extends EntidadComponente {
  constructor(nombre, bonusDano = 5) {
    super();
    this.nombre = nombre;
    this._bonusDano = bonusDano;
  }

  obtenerPoder() {
    return this._bonusDano;
  }

  describir(profundidad = 0) {
    return `${"  ".repeat(profundidad)}- ${this.nombre} (Arma, +${this._bonusDano} daño)`;
  }

  esInvisible() {
    return false;
  }

  contarMiembros() {
    return 1;
  }
}

class Objeto extends EntidadComponente {
  constructor(nombre, valor = 2) {
    super();
    this.nombre = nombre;
    this._valor = valor;
  }

  obtenerPoder() {
    return this._valor;
  }

  describir(profundidad = 0) {
    return `${"  ".repeat(profundidad)}- ${this.nombre} (Objeto, valor ${this._valor})`;
  }

  esInvisible() {
    return false;
  }

  contarMiembros() {
    return 1;
  }
}

module.exports = { Personaje, Arma, Objeto };
