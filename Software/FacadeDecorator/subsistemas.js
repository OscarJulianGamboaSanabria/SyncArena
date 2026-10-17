/**
 * subsistemas.js
 * ----------------
 * Los tres subsistemas que hay que coordinar para arrancar una
 * partida. Cada uno tiene su propia API y sus propios errores; sin
 * una fachada, el código cliente tendría que conocerlos todos y
 * llamarlos en el orden correcto.
 *
 * Son simulaciones en memoria (no hay red ni disco real), pero
 * mantienen estado y lanzan errores reales, que es lo que la fachada
 * y los decoradores necesitan para demostrarse.
 */

class ServicioRecursos {
  constructor() {
    this._mapas = {
      arena_industrial: ["terreno", "texturas", "sonidos"],
      templo_olvidado: ["terreno", "texturas", "sonidos", "efectos_niebla"],
      isla_norte: ["terreno", "texturas", "sonidos", "agua", "vegetacion"],
    };
    this.cargas = 0;
  }

  cargar(mapa) {
    if (!(mapa in this._mapas)) {
      throw new Error(`Mapa desconocido: '${mapa}'.`);
    }
    this.cargas += 1;
    return [...this._mapas[mapa]];
  }
}

class ServicioConexion {
  constructor() {
    this._conectados = new Set();
  }

  conectar(jugador) {
    if (this._conectados.has(jugador)) {
      throw new Error(`El jugador '${jugador}' ya está conectado.`);
    }
    this._conectados.add(jugador);
  }

  desconectar(jugador) {
    this._conectados.delete(jugador);
  }

  estaConectado(jugador) {
    return this._conectados.has(jugador);
  }

  totalConectados() {
    return this._conectados.size;
  }
}

class ServicioPartidas {
  constructor() {
    this._partidas = new Map();
    this._contador = 0;
  }

  crear(config) {
    this._contador += 1;
    const id = `partida_${this._contador}`;
    this._partidas.set(id, { config, estado: "creada" });
    return id;
  }

  iniciar(id) {
    this._partidas.get(id).estado = "en_curso";
  }

  finalizar(id) {
    if (!this._partidas.has(id)) {
      throw new Error(`La partida '${id}' no existe.`);
    }
    this._partidas.get(id).estado = "finalizada";
  }

  cancelar(id) {
    this._partidas.delete(id);
  }

  // null si la partida no existe (por ejemplo, tras cancelarla)
  estado(id) {
    return this._partidas.has(id) ? this._partidas.get(id).estado : null;
  }
}

module.exports = { ServicioRecursos, ServicioConexion, ServicioPartidas };
