/**
 * esquemaControl.js
 * --------------------
 * "Abstracción" del patrón Bridge: un esquema de controles decide
 * CÓMO se interpreta la entrada normalizada (estándar, invertida,
 * con asistencia de accesibilidad...), pero nunca sabe de qué
 * dispositivo física viene esa entrada — solo conoce la interfaz
 * `DispositivoEntrada`.
 *
 * El "puente" es justamente que `_dispositivo` puede ser CUALQUIER
 * cosa que cumpla esa interfaz: un dispositivo nativo que ya la
 * implementa directamente, o uno de los adapters de
 * adaptadoresDispositivo.js envolviendo un dispositivo incompatible.
 * El esquema de controles no distingue un caso del otro.
 */

class EsquemaControl {
  constructor(dispositivo) {
    if (new.target === EsquemaControl) {
      throw new Error("EsquemaControl es abstracto, no se puede instanciar directamente.");
    }
    this._dispositivo = dispositivo; // el "puente" hacia el dispositivo real
  }

  // Cambiar de dispositivo en caliente (el jugador conecta un mando a
  // mitad de partida) sin perder el esquema de controles que eligió.
  cambiarDispositivo(nuevoDispositivo) {
    this._dispositivo = nuevoDispositivo;
  }

  dispositivoActual() {
    return this._dispositivo.nombre();
  }

  // Cada esquema concreto decide cómo convertir el estado crudo del
  // dispositivo en una acción de juego.
  procesarEntrada() {
    throw new Error("procesarEntrada() debe implementarse en el esquema concreto.");
  }
}

module.exports = { EsquemaControl };
