/**
 * decoradoresConcretos.js
 * --------------------------
 * Tres preocupaciones transversales, cada una en su propio decorador:
 *
 * - LoggingDecorator: registra cada llamada (inicio, éxito o error).
 * - MetricasDecorator: mide cuánto tarda cada operación y cuántas
 *   veces falló. Recibe el reloj como parámetro para que las pruebas
 *   no dependan del tiempo real de la máquina.
 * - NotificacionesDecorator: avisa del resultado en lenguaje humano.
 *
 * Ninguno toca la fachada ni los subsistemas: solo envuelven la
 * llamada. Y como los tres respetan la misma interfaz, se pueden
 * apilar en cualquier combinación.
 */

const { PartidaDecorator } = require("./partidaDecorator");

class LoggingDecorator extends PartidaDecorator {
  // `registrar` es opcional: por defecto guarda las entradas en memoria
  // (consultables con entradas()); en producción podría escribir a un
  // archivo o a un servicio de logs.
  constructor(componente, registrar = null) {
    super(componente);
    this._entradas = [];
    this._registrar = registrar || ((entrada) => this._entradas.push(entrada));
  }

  iniciarPartida(config, jugadores) {
    const cantidad = Array.isArray(jugadores) ? jugadores.length : 0;
    this._registrar({ evento: "iniciarPartida", fase: "inicio", mapa: config.mapa, jugadores: cantidad });
    try {
      const resultado = super.iniciarPartida(config, jugadores);
      this._registrar({ evento: "iniciarPartida", fase: "ok", idPartida: resultado.idPartida });
      return resultado;
    } catch (error) {
      this._registrar({ evento: "iniciarPartida", fase: "error", mensaje: error.message });
      throw error;
    }
  }

  finalizarPartida(idPartida) {
    this._registrar({ evento: "finalizarPartida", fase: "inicio", idPartida });
    try {
      const resultado = super.finalizarPartida(idPartida);
      this._registrar({ evento: "finalizarPartida", fase: "ok", idPartida });
      return resultado;
    } catch (error) {
      this._registrar({ evento: "finalizarPartida", fase: "error", mensaje: error.message });
      throw error;
    }
  }

  entradas() {
    return [...this._entradas];
  }
}

class MetricasDecorator extends PartidaDecorator {
  constructor(componente, reloj = () => performance.now()) {
    super(componente);
    this._reloj = reloj;
    this._metricas = {
      iniciarPartida: { llamadas: 0, errores: 0, totalMs: 0 },
      finalizarPartida: { llamadas: 0, errores: 0, totalMs: 0 },
    };
  }

  _medir(nombre, operacion) {
    const inicio = this._reloj();
    try {
      return operacion();
    } catch (error) {
      this._metricas[nombre].errores += 1;
      throw error;
    } finally {
      // Se cuenta la llamada y su duración tanto si salió bien como si falló
      this._metricas[nombre].llamadas += 1;
      this._metricas[nombre].totalMs += this._reloj() - inicio;
    }
  }

  iniciarPartida(config, jugadores) {
    return this._medir("iniciarPartida", () => super.iniciarPartida(config, jugadores));
  }

  finalizarPartida(idPartida) {
    return this._medir("finalizarPartida", () => super.finalizarPartida(idPartida));
  }

  metricas() {
    const resultado = {};
    for (const [nombre, m] of Object.entries(this._metricas)) {
      resultado[nombre] = {
        ...m,
        promedioMs: m.llamadas === 0 ? 0 : m.totalMs / m.llamadas,
      };
    }
    return resultado;
  }
}

class NotificacionesDecorator extends PartidaDecorator {
  // `notificar` es opcional: por defecto acumula los mensajes (como
  // haría una cola de avisos hacia la interfaz del jugador).
  constructor(componente, notificar = null) {
    super(componente);
    this._mensajes = [];
    this._notificar = notificar || ((mensaje) => this._mensajes.push(mensaje));
  }

  iniciarPartida(config, jugadores) {
    try {
      const resultado = super.iniciarPartida(config, jugadores);
      const { idPartida, mapa, jugadores: conectados } = resultado;
      this._notificar(`Partida ${idPartida} iniciada en ${mapa} con ${conectados.length} jugador(es).`);
      return resultado;
    } catch (error) {
      this._notificar(`No se pudo iniciar la partida: ${error.message}`);
      throw error;
    }
  }

  finalizarPartida(idPartida) {
    const resultado = super.finalizarPartida(idPartida);
    this._notificar(`Partida ${idPartida} finalizada.`);
    return resultado;
  }

  mensajes() {
    return [...this._mensajes];
  }
}

module.exports = { LoggingDecorator, MetricasDecorator, NotificacionesDecorator };
