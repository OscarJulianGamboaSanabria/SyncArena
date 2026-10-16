/**
 * efectosConcretos.js
 * ----------------------
 * Cuatro habilidades/efectos concretos. Las tres primeras funcionan
 * igual sobre una hoja o sobre un Grupo (no necesitan saber cuál es).
 * AuraLiderazgoDecorator es la pieza que más muestra la mezcla: usa
 * `contarMiembros()` — que viene tanto de las hojas (siempre 1) como
 * del Grupo (recursivo) — para escalar su bonus, sin preguntar nunca
 * "¿esto que envuelvo es un personaje o un grupo?".
 */

const { EfectoDecorator } = require("./efectoDecorator");

const BONO_ESCUDO = 20;
const BONO_VELOCIDAD = 8;
const BONO_AURA_POR_MIEMBRO = 2;

/**
 * Agrega una etiqueta SOLO a la primera línea de lo que devuelve
 * describir() del componente envuelto. Esto importa cuando se decora
 * un Grupo (varias líneas): la etiqueta debe quedar junto al
 * encabezado del grupo, no pegada después del último hijo.
 */
function etiquetarPrimeraLinea(textoBase, etiqueta) {
  const lineas = textoBase.split("\n");
  lineas[0] = `${lineas[0]} ${etiqueta}`;
  return lineas.join("\n");
}

class EscudoDecorator extends EfectoDecorator {
  obtenerPoder() {
    const base = this._componente.obtenerPoder();
    return this.estaActivo() ? base + BONO_ESCUDO : base;
  }

  describir(profundidad = 0) {
    const base = this._componente.describir(profundidad);
    return this.estaActivo() ? etiquetarPrimeraLinea(base, `[+Escudo +${BONO_ESCUDO}]`) : base;
  }
}

class VelocidadExtraDecorator extends EfectoDecorator {
  obtenerPoder() {
    const base = this._componente.obtenerPoder();
    return this.estaActivo() ? base + BONO_VELOCIDAD : base;
  }

  describir(profundidad = 0) {
    const base = this._componente.describir(profundidad);
    return this.estaActivo() ? etiquetarPrimeraLinea(base, `[+Velocidad +${BONO_VELOCIDAD}]`) : base;
  }
}

class InvisibilidadDecorator extends EfectoDecorator {
  esInvisible() {
    return this.estaActivo() ? true : this._componente.esInvisible();
  }

  describir(profundidad = 0) {
    const base = this._componente.describir(profundidad);
    return this.estaActivo() ? etiquetarPrimeraLinea(base, "[+Invisible]") : base;
  }
}

class AuraLiderazgoDecorator extends EfectoDecorator {
  // +2 (BONO_AURA_POR_MIEMBRO) de poder por cada miembro que tenga lo que envuelve: una hoja
  // suma +2; un Grupo de 5 miembros suma +10. El mismo decorador, sin
  // modificar una línea, escala solo con el tamaño real de lo que
  // decora — esa es la combinación Composite + Decorator en acción.
  obtenerPoder() {
    const base = this._componente.obtenerPoder();
    if (!this.estaActivo()) return base;
    return base + this._bono();
  }

  _bono() {
    return this._componente.contarMiembros() * BONO_AURA_POR_MIEMBRO;
  }

  describir(profundidad = 0) {
    const base = this._componente.describir(profundidad);
    if (!this.estaActivo()) return base;
    return etiquetarPrimeraLinea(base, `[+Aura de Liderazgo +${this._bono()}]`);
  }
}

module.exports = {
  EscudoDecorator,
  VelocidadExtraDecorator,
  InvisibilidadDecorator,
  AuraLiderazgoDecorator,
};
