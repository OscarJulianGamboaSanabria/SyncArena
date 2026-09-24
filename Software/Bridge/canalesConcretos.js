/**
 * canalesConcretos.js
 * ---------------------
 * Implementaciones concretas del canal de comunicación.
 *
 * - CanalWebSocket: simula un transporte confiable y ordenado (como
 *   WebSocket sobre TCP): todos los mensajes llegan, en orden.
 * - CanalUDP: simula un transporte más rápido pero no confiable: un
 *   patrón determinístico de pérdida de paquetes (para que las
 *   pruebas sean reproducibles, no aleatorias) representa paquetes
 *   que se pierden en el camino, como pasaría con UDP real.
 *
 * Ambos guardan un log interno de lo efectivamente entregado, que es
 * lo que las pruebas inspeccionan.
 */

const { CanalComunicacion } = require("./canalComunicacion");

class CanalWebSocket extends CanalComunicacion {
  constructor() {
    super();
    this._conectado = false;
    this._entregados = [];
    this._intentados = 0;
  }

  conectar() {
    this._conectado = true;
  }

  desconectar() {
    this._conectado = false;
  }

  enviar(mensaje, destinatarios) {
    if (!this._conectado) {
      throw new Error("CanalWebSocket: no se puede enviar sin conectar primero.");
    }
    this._intentados += 1;
    // Confiable y ordenado: siempre se entrega
    this._entregados.push({ mensaje, destinatarios });
    return true;
  }

  estadisticas() {
    return {
      protocolo: "websocket",
      intentados: this._intentados,
      entregados: this._entregados.length,
      confiable: true,
    };
  }
}

class CanalUDP extends CanalComunicacion {
  constructor() {
    super();
    this._conectado = false;
    this._entregados = [];
    this._intentados = 0;
  }

  conectar() {
    this._conectado = true;
  }

  desconectar() {
    this._conectado = false;
  }

  enviar(mensaje, destinatarios) {
    if (!this._conectado) {
      throw new Error("CanalUDP: no se puede enviar sin conectar primero.");
    }
    this._intentados += 1;
    // Patrón determinístico de pérdida: se pierde 1 de cada 5 paquetes
    // (simula pérdida real de UDP sin depender de aleatoriedad, para
    // que las pruebas sean reproducibles).
    const sePierde = this._intentados % 5 === 0;
    if (!sePierde) {
      this._entregados.push({ mensaje, destinatarios });
    }
    return !sePierde;
  }

  estadisticas() {
    return {
      protocolo: "udp",
      intentados: this._intentados,
      entregados: this._entregados.length,
      confiable: false,
    };
  }
}

module.exports = { CanalWebSocket, CanalUDP };
