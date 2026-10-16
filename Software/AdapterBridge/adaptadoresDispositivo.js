/**
 * adaptadoresDispositivo.js
 * -----------------------------
 * Patrón Adapter: un adapter por dispositivo, cada uno traduciendo su
 * API nativa hacia la interfaz común `DispositivoEntrada`.
 */

const { DispositivoEntrada } = require("./dispositivoEntrada");

class TecladoAdapter extends DispositivoEntrada {
  constructor(tecladoNativo) {
    super();
    this._teclado = tecladoNativo;
  }

  leerEstado() {
    // WASD -> ejes discretos en [-1, 1] (sin estados intermedios, a
    // diferencia de un stick analógico)
    const ejeX =
      (this._teclado.estaPresionada("d") ? 1 : 0) - (this._teclado.estaPresionada("a") ? 1 : 0);
    const ejeY =
      (this._teclado.estaPresionada("w") ? 1 : 0) - (this._teclado.estaPresionada("s") ? 1 : 0);

    return {
      ejeX,
      ejeY,
      accionPrimaria: this._teclado.estaPresionada("espacio"),
      accionSecundaria: this._teclado.estaPresionada("shift"),
    };
  }

  nombre() {
    return "teclado";
  }
}

class MandoAdapter extends DispositivoEntrada {
  constructor(mandoNativo) {
    super();
    this._mando = mandoNativo;
  }

  leerEstado() {
    // El stick del mando ya viene normalizado: adaptación casi 1:1,
    // solo se traduce el nombre de los campos y de los botones.
    const { x, y } = this._mando.obtenerEjeIzquierdo();
    return {
      ejeX: x,
      ejeY: y,
      accionPrimaria: this._mando.botonA(),
      accionSecundaria: this._mando.botonB(),
    };
  }

  nombre() {
    return "mando";
  }
}

class PantallaTactilAdapter extends DispositivoEntrada {
  constructor(pantallaNativa) {
    super();
    this._pantalla = pantallaNativa;
  }

  leerEstado() {
    // Adaptación real: de píxeles sin normalizar a [-1, 1], con clamp
    // por si el dedo se arrastra más allá del radio máximo del
    // joystick virtual.
    const { dx, dy } = this._pantalla.obtenerJoystickVirtual();
    const radio = this._pantalla.radioMaximoPx();

    const normalizar = (valorPx) => Math.max(-1, Math.min(1, valorPx / radio));

    return {
      ejeX: normalizar(dx),
      ejeY: normalizar(dy),
      accionPrimaria: this._pantalla.obtenerBotonVirtual("primario"),
      accionSecundaria: this._pantalla.obtenerBotonVirtual("secundario"),
    };
  }

  nombre() {
    return "pantalla_tactil";
  }
}

module.exports = { TecladoAdapter, MandoAdapter, PantallaTactilAdapter };
