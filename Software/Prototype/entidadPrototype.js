/**
 * entidadPrototype.js
 * ---------------------
 * Patrón Prototype aplicado al spawn de entidades de juego (enemigos
 * y power-ups) dentro de una partida de SyncArena.
 *
 * Idea central: en vez de construir cada entidad desde cero cada vez
 * que aparece en el mapa (recalculando tabla de drops, referencias de
 * comportamiento de IA, stats base, etc.), se prepara UN prototipo por
 * tipo de entidad una sola vez, y cada spawn se resuelve clonando ese
 * prototipo. Clonar copia campos ya calculados; no vuelve a ejecutar
 * el setup costoso del constructor.
 */

class EntidadPrototype {
  constructor(tipo, statsBase) {
    if (new.target === EntidadPrototype) {
      throw new Error("EntidadPrototype es abstracta, no se puede instanciar directamente.");
    }
    this.tipo = tipo;
    this.statsBase = { ...statsBase };
    this.posicion = { x: 0, y: 0 };
  }

  /**
   * Clonación genérica: copia el prototipo de la clase concreta (para
   * que el clon conserve sus métodos) y hace una copia superficial de
   * cada propiedad propia, con copia profunda de arrays/objetos
   * anidados para que dos clones nunca compartan el mismo array o
   * sub-objeto por referencia.
   *
   * A propósito NO se llama al constructor: eso es lo que evita
   * repetir el setup costoso de cada tipo de entidad.
   */
  clonar() {
    const copia = Object.create(Object.getPrototypeOf(this));
    for (const [clave, valor] of Object.entries(this)) {
      if (Array.isArray(valor)) {
        copia[clave] = [...valor];
      } else if (valor && typeof valor === "object") {
        copia[clave] = { ...valor };
      } else {
        copia[clave] = valor;
      }
    }
    return copia;
  }
}

module.exports = { EntidadPrototype };
