/**
 * equipo.js
 * -----------
 * Un Equipo es, estructuralmente, un GrupoParticipantes cuyos hijos
 * suelen ser Jugadores (aunque el Composite no lo obliga: también
 * podría contener un sub-equipo/escuadra anidada, sin cambiar nada
 * del resto del código — esa es la flexibilidad que da el patrón).
 */

const { GrupoParticipantes } = require("./grupoParticipantes");

class Equipo extends GrupoParticipantes {
  constructor(nombre) {
    super("Equipo", nombre);
  }
}

module.exports = { Equipo };
