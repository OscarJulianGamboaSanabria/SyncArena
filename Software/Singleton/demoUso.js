/**
 * demoUso.js
 * ----------
 * Pequeña demo ejecutable (no es una prueba formal) que muestra cómo
 * distintos "módulos" del motor obtendrían siempre el mismo estado al
 * usar el GameServerManager Singleton.
 */

const { GameServerManager } = require("./gameServerManager");

function moduloMatchmaking() {
  const gestor = new GameServerManager();
  gestor.crearPartida("arena_01");
  gestor.unirJugadorAPartida("arena_01", "OscarJulian");
  gestor.unirJugadorAPartida("arena_01", "JesusJavier");
}

function moduloChat() {
  // Este "módulo" nunca recibió el objeto por parámetro, lo vuelve a
  // pedir por su cuenta... y aun así ve el mismo estado.
  const gestor = new GameServerManager();
  const partida = gestor.obtenerPartida("arena_01");
  console.log(`[chat] Jugadores en ${partida.idPartida}:`, partida.jugadores);
}

function moduloRanking() {
  const gestor = new GameServerManager();
  gestor.sumarPuntos("OscarJulian", 100);
  gestor.sumarPuntos("JesusJavier", 150);
  console.log("[ranking] Tabla actual:", gestor.obtenerRanking());
}

// No hay id() nativo en JS como en Python, así que comparamos referencias
const instancia1 = new GameServerManager();
console.log("¿instancia1 === nueva llamada?", instancia1 === new GameServerManager());

moduloMatchmaking();
moduloChat();
moduloRanking();

const instancia2 = new GameServerManager();
console.log("¿instancia1 === instancia2 (tras usar los módulos)?", instancia1 === instancia2);
