/**
 * partidaConfig.js
 * -----------------
 * "Producto" del patrón Builder aplicado a la configuración de partidas
 * de SyncArena.
 *
 * Una partida en un motor multijugador tiene muchos parámetros: mapa,
 * modo de juego, máximo de jugadores, duración, dificultad de bots,
 * fuego amigo, tiempo de respawn, si tiene espectadores, etc. La
 * mayoría son opcionales y tienen un valor por defecto razonable.
 * Representar esto con un constructor tradicional obligaría a pasar
 * muchos parámetros posicionales (o un objeto gigante sin validar),
 * lo cual es propenso a errores. PartidaConfig es intencionalmente
 * "tonta": solo guarda los datos ya validados por el Builder.
 */

class PartidaConfig {
  constructor({
    mapa,
    modoDeJuego,
    maxJugadores,
    duracionMinutos,
    dificultadBots,
    fuegoAmigo,
    tiempoRespawnSegundos,
    permiteEspectadores,
  }) {
    this.mapa = mapa;
    this.modoDeJuego = modoDeJuego;
    this.maxJugadores = maxJugadores;
    this.duracionMinutos = duracionMinutos;
    this.dificultadBots = dificultadBots;
    this.fuegoAmigo = fuegoAmigo;
    this.tiempoRespawnSegundos = tiempoRespawnSegundos;
    this.permiteEspectadores = permiteEspectadores;

    Object.freeze(this); // la configuración, una vez construida, no cambia
  }

  resumen() {
    return (
      `${this.modoDeJuego} en "${this.mapa}" — ` +
      `${this.maxJugadores} jugadores máx, ${this.duracionMinutos} min, ` +
      `bots ${this.dificultadBots}, fuego amigo ${this.fuegoAmigo ? "ON" : "OFF"}, ` +
      `respawn ${this.tiempoRespawnSegundos}s, ` +
      `espectadores ${this.permiteEspectadores ? "sí" : "no"}`
    );
  }
}

module.exports = { PartidaConfig };
