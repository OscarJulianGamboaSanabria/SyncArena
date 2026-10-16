/**
 * dispositivosNativos.js
 * -------------------------
 * Simula tres dispositivos de entrada reales, cada uno con su propia
 * API nativa, incompatible con las otras dos:
 *
 * - TecladoNativo: teclas booleanas (WASD + espacio/shift).
 * - MandoNativo: un stick analógico ya normalizado en [-1, 1] y
 *   botones con nombres de letra (A, B).
 * - PantallaTactilNativa: un joystick virtual en PÍXELES (no
 *   normalizado) y botones identificados por nombre de zona táctil.
 *
 * SyncArena no controla estas APIs — son justamente lo que los
 * adapters de adaptadoresDispositivo.js tienen que traducir.
 */

class TecladoNativo {
  constructor() {
    this._teclasPresionadas = new Set();
  }

  // El "driver" del teclado reporta así las teclas activas
  presionar(tecla) {
    this._teclasPresionadas.add(tecla);
  }

  soltar(tecla) {
    this._teclasPresionadas.delete(tecla);
  }

  estaPresionada(tecla) {
    return this._teclasPresionadas.has(tecla);
  }
}

class MandoNativo {
  constructor() {
    this._stickIzquierdo = { x: 0, y: 0 }; // ya viene normalizado en [-1, 1]
    this._botones = { A: false, B: false };
  }

  moverStickIzquierdo(x, y) {
    this._stickIzquierdo = { x, y };
  }

  presionarBoton(boton) {
    this._botones[boton] = true;
  }

  soltarBoton(boton) {
    this._botones[boton] = false;
  }

  obtenerEjeIzquierdo() {
    return { ...this._stickIzquierdo };
  }

  botonA() {
    return this._botones.A;
  }

  botonB() {
    return this._botones.B;
  }
}

class PantallaTactilNativa {
  constructor(radioMaximoPx = 50) {
    this._radioMaximoPx = radioMaximoPx;
    this._joystickVirtual = { dx: 0, dy: 0 }; // en PÍXELES, no normalizado
    this._botonesVirtuales = { primario: false, secundario: false };
  }

  arrastrarJoystickVirtual(dxPx, dyPx) {
    this._joystickVirtual = { dx: dxPx, dy: dyPx };
  }

  tocarBotonVirtual(nombre) {
    this._botonesVirtuales[nombre] = true;
  }

  soltarBotonVirtual(nombre) {
    this._botonesVirtuales[nombre] = false;
  }

  obtenerJoystickVirtual() {
    return { ...this._joystickVirtual };
  }

  obtenerBotonVirtual(nombre) {
    return this._botonesVirtuales[nombre];
  }

  radioMaximoPx() {
    return this._radioMaximoPx;
  }
}

module.exports = { TecladoNativo, MandoNativo, PantallaTactilNativa };
