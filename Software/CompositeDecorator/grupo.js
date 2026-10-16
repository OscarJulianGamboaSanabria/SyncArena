/**
 * grupo.js
 * ----------
 * "Composite": organiza personajes, armas y objetos — o incluso otros
 * Grupos anidados — en una estructura jerárquica. Un Grupo es, en sí
 * mismo, un EntidadComponente más: el resto del código no distingue
 * entre preguntarle su poder a un Personaje suelto o a un Grupo de 10
 * miembros.
 */

const { EntidadComponente } = require("./entidadComponente");

class Grupo extends EntidadComponente {
  constructor(nombre) {
    super();
    this.nombre = nombre;
    this._hijos = [];
  }

  agregar(componente) {
    this._hijos.push(componente);
    return this;
  }

  quitar(componente) {
    this._hijos = this._hijos.filter((hijo) => hijo !== componente);
    return this;
  }

  hijos() {
    return [...this._hijos];
  }

  obtenerPoder() {
    return this._hijos.reduce((total, hijo) => total + hijo.obtenerPoder(), 0);
  }

  describir(profundidad = 0) {
    const encabezado = `${"  ".repeat(profundidad)}Grupo: ${this.nombre} (poder total ${this.obtenerPoder()})`;
    const lineasHijos = this._hijos.map((hijo) => hijo.describir(profundidad + 1));
    return [encabezado, ...lineasHijos].join("\n");
  }

  // Un Grupo es invisible solo si TODOS sus miembros lo son — una
  // regla de agregación distinta a la suma, que demuestra que el
  // Composite no solo sirve para sumar números.
  esInvisible() {
    return this._hijos.length > 0 && this._hijos.every((hijo) => hijo.esInvisible());
  }

  contarMiembros() {
    return this._hijos.reduce((total, hijo) => total + hijo.contarMiembros(), 0);
  }

  avanzarTurno() {
    for (const hijo of this._hijos) hijo.avanzarTurno();
  }
}

module.exports = { Grupo };
