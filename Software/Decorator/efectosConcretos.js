/**
 * efectosConcretos.js
 * ----------------------
 * Decoradores concretos: cada uno modifica UNA stat de combate y dice
 * cómo se agrega a la descripción — solo mientras `estaActivo()`.
 */

const { EfectoDecorator } = require("./efectoDecorator");

class EscudoDecorator extends EfectoDecorator {
  // Sin duracionTurnos -> permanente (equipo, no un buff temporal)
  obtenerDefensa() {
    const base = this._componente.obtenerDefensa();
    return this.estaActivo() ? base + 15 : base;
  }

  describir() {
    const base = this._componente.describir();
    return this.estaActivo() ? `${base} + Escudo(+15 def)` : base;
  }
}

class BotasVelocidadDecorator extends EfectoDecorator {
  obtenerVelocidad() {
    const base = this._componente.obtenerVelocidad();
    return this.estaActivo() ? Math.round(base * 1.3) : base;
  }

  describir() {
    const base = this._componente.describir();
    return this.estaActivo() ? `${base} + Botas(x1.3 vel)` : base;
  }
}

class VenenoDecorator extends EfectoDecorator {
  obtenerDefensa() {
    const base = this._componente.obtenerDefensa();
    return this.estaActivo() ? Math.max(0, base - 10) : base;
  }

  describir() {
    const base = this._componente.describir();
    return this.estaActivo() ? `${base} + Veneno(-10 def)` : base;
  }
}

class FuriaDecorator extends EfectoDecorator {
  obtenerDano() {
    const base = this._componente.obtenerDano();
    return this.estaActivo() ? Math.round(base * 1.5) : base;
  }

  describir() {
    const base = this._componente.describir();
    return this.estaActivo() ? `${base} + Furia(x1.5 dano)` : base;
  }
}

module.exports = { EscudoDecorator, BotasVelocidadDecorator, VenenoDecorator, FuriaDecorator };
