/**
 * partidaConfigBuilder.js
 * -------------------------
 * Patrón Builder aplicado a la configuración de partidas de SyncArena.
 *
 * Por qué Builder aquí:
 * PartidaConfig tiene 8 parámetros, la mayoría opcionales. Un
 * constructor tradicional como
 *   new PartidaConfig("arena_x", "deathmatch", 10, 15, "normal", true, 5, false)
 * es ilegible y frágil: basta con invertir dos parámetros del mismo
 * tipo (dos booleanos, dos números) para crear una partida mal
 * configurada sin que nadie lo note.
 *
 * PartidaConfigBuilder arma la configuración paso a paso con métodos
 * encadenables y nombres explícitos (`conMapa(...)`, `conMaxJugadores(...)`),
 * aplica valores por defecto razonables, valida los datos antes de
 * construir, y solo entrega el objeto final al llamar `.build()`.
 */

const { PartidaConfig } = require("./partidaConfig");

const MODOS_VALIDOS = ["deathmatch", "captura_bandera", "battle_royale", "casual"];
const DIFICULTADES_VALIDAS = ["facil", "normal", "dificil"];

class PartidaConfigBuilder {
  constructor() {
    // Valores por defecto: una partida "casual" razonable
    this._mapa = "arena_default";
    this._modoDeJuego = "deathmatch";
    this._maxJugadores = 8;
    this._duracionMinutos = 10;
    this._dificultadBots = "normal";
    this._fuegoAmigo = false;
    this._tiempoRespawnSegundos = 5;
    this._permiteEspectadores = true;
  }

  conMapa(mapa) {
    this._mapa = mapa;
    return this; // permite encadenar llamadas (fluent interface)
  }

  conModoDeJuego(modo) {
    if (!MODOS_VALIDOS.includes(modo)) {
      throw new Error(`Modo de juego inválido: '${modo}'. Válidos: ${MODOS_VALIDOS.join(", ")}`);
    }
    this._modoDeJuego = modo;
    return this;
  }

  conMaxJugadores(cantidad) {
    if (cantidad < 2 || cantidad > 100) {
      throw new Error("maxJugadores debe estar entre 2 y 100.");
    }
    this._maxJugadores = cantidad;
    return this;
  }

  conDuracion(minutos) {
    if (minutos <= 0) {
      throw new Error("duracionMinutos debe ser mayor a 0.");
    }
    this._duracionMinutos = minutos;
    return this;
  }

  conDificultadBots(dificultad) {
    if (!DIFICULTADES_VALIDAS.includes(dificultad)) {
      throw new Error(
        `Dificultad inválida: '${dificultad}'. Válidas: ${DIFICULTADES_VALIDAS.join(", ")}`
      );
    }
    this._dificultadBots = dificultad;
    return this;
  }

  conFuegoAmigo(activo) {
    this._fuegoAmigo = Boolean(activo);
    return this;
  }

  conTiempoRespawn(segundos) {
    if (segundos < 0) {
      throw new Error("tiempoRespawnSegundos no puede ser negativo.");
    }
    this._tiempoRespawnSegundos = segundos;
    return this;
  }

  conEspectadores(permite) {
    this._permiteEspectadores = Boolean(permite);
    return this;
  }

  build() {
    // Validación cruzada: battle_royale no tiene sentido con pocos jugadores
    if (this._modoDeJuego === "battle_royale" && this._maxJugadores < 10) {
      throw new Error("battle_royale requiere al menos 10 jugadores.");
    }

    return new PartidaConfig({
      mapa: this._mapa,
      modoDeJuego: this._modoDeJuego,
      maxJugadores: this._maxJugadores,
      duracionMinutos: this._duracionMinutos,
      dificultadBots: this._dificultadBots,
      fuegoAmigo: this._fuegoAmigo,
      tiempoRespawnSegundos: this._tiempoRespawnSegundos,
      permiteEspectadores: this._permiteEspectadores,
    });
  }
}

/**
 * Director (opcional dentro del patrón Builder): agrupa recetas de
 * configuración comunes para que el código cliente no tenga que
 * repetir la misma cadena de llamadas para escenarios típicos.
 */
class PartidaConfigDirector {
  static partidaRapidaCasual() {
    return new PartidaConfigBuilder()
      .conModoDeJuego("casual")
      .conMaxJugadores(6)
      .conDuracion(5)
      .conFuegoAmigo(false)
      .build();
  }

  static partidaClasicaDeathmatch(mapa) {
    return new PartidaConfigBuilder()
      .conMapa(mapa)
      .conModoDeJuego("deathmatch")
      .conMaxJugadores(10)
      .conDuracion(15)
      .conDificultadBots("normal")
      .build();
  }

  static partidaTorneoCompetitivo(mapa) {
    return new PartidaConfigBuilder()
      .conMapa(mapa)
      .conModoDeJuego("captura_bandera")
      .conMaxJugadores(10)
      .conDuracion(20)
      .conFuegoAmigo(true)
      .conTiempoRespawn(10)
      .conEspectadores(true)
      .build();
  }

  static partidaBattleRoyale(mapa) {
    return new PartidaConfigBuilder()
      .conMapa(mapa)
      .conModoDeJuego("battle_royale")
      .conMaxJugadores(60)
      .conDuracion(25)
      .build();
  }
}

module.exports = { PartidaConfigBuilder, PartidaConfigDirector };
