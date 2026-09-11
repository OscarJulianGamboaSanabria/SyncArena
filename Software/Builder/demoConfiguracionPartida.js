/**
 * demoConfiguracionPartida.js
 * ------------------------------
 * Demo ejecutable (no es una prueba formal) que muestra tres formas
 * de usar el Builder: paso a paso, encadenado, y vía el Director con
 * recetas predefinidas.
 */

const { PartidaConfigBuilder, PartidaConfigDirector } = require("./partidaConfigBuilder");

// 1) Uso directo del Builder, encadenado (fluent interface)
const configPersonalizada = new PartidaConfigBuilder()
  .conMapa("templo_olvidado")
  .conModoDeJuego("captura_bandera")
  .conMaxJugadores(12)
  .conDuracion(20)
  .conFuegoAmigo(true)
  .build();

console.log("[personalizada]", configPersonalizada.resumen());

// 2) Uso con valores por defecto (nadie configura nada)
const configPorDefecto = new PartidaConfigBuilder().build();
console.log("[por defecto]  ", configPorDefecto.resumen());

// 3) Uso a través del Director, con recetas ya armadas
console.log("[rapida casual]", PartidaConfigDirector.partidaRapidaCasual().resumen());
console.log("[deathmatch]   ", PartidaConfigDirector.partidaClasicaDeathmatch("arena_industrial").resumen());
console.log("[torneo]       ", PartidaConfigDirector.partidaTorneoCompetitivo("fortaleza_norte").resumen());
console.log("[battle royale]", PartidaConfigDirector.partidaBattleRoyale("isla_norte").resumen());

// 4) Validación en acción: esto debe lanzar un error controlado
try {
  new PartidaConfigBuilder().conModoDeJuego("battle_royale").conMaxJugadores(4).build();
} catch (error) {
  console.log("[validación]   Error esperado ->", error.message);
}
