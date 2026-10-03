/**
 * grupoParticipantes.js
 * ------------------------
 * "Composite" genérico del patrón: un contenedor de
 * ParticipanteComponente (que pueden ser Jugadores sueltos, u otros
 * grupos anidados). Esta misma clase es la base tanto de Equipo como
 * de Partida — un Equipo es, ni más ni menos, "un grupo de
 * jugadores", y una Partida es "un grupo de equipos". Es la misma
 * lógica de agregación en ambos niveles del árbol; por eso no hace
 * falta repetirla en cada clase.
 */

const { ParticipanteComponente } = require("./participanteComponente");

class GrupoParticipantes extends ParticipanteComponente {
  constructor(etiqueta, nombre) {
    super();
    this.etiqueta = etiqueta; // "Equipo", "Partida", o lo que use la subclase
    this.nombre = nombre;
    this._hijos = [];
  }

  agregar(componente) {
    this._hijos.push(componente);
    return this; // fluent, para poder encadenar varios agregar()
  }

  quitar(componente) {
    this._hijos = this._hijos.filter((hijo) => hijo !== componente);
    return this;
  }

  hijos() {
    return [...this._hijos];
  }

  contarJugadores() {
    return this._hijos.reduce((total, hijo) => total + hijo.contarJugadores(), 0);
  }

  estadisticas() {
    return this._hijos.reduce(
      (acumulado, hijo) => {
        const stats = hijo.estadisticas();
        return {
          jugadores: acumulado.jugadores + stats.jugadores,
          kills: acumulado.kills + stats.kills,
          muertes: acumulado.muertes + stats.muertes,
        };
      },
      { jugadores: 0, kills: 0, muertes: 0 }
    );
  }

  imprimirEstructura(profundidad = 0) {
    const sangria = "  ".repeat(profundidad);
    const encabezado = `${sangria}${this.etiqueta}: ${this.nombre}`;
    const lineasHijos = this._hijos.map((hijo) => hijo.imprimirEstructura(profundidad + 1));
    return [encabezado, ...lineasHijos].join("\n");
  }
}

module.exports = { GrupoParticipantes };
