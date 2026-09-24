/**
 * physicsAdapters.js
 * --------------------
 * Patrón Adapter aplicado a la capa de físicas de SyncArena.
 *
 * Por qué Adapter aquí:
 * El motor no debería atarse a una sola librería de físicas: distintas
 * versiones del juego (o distintos entornos: servidor headless vs.
 * cliente con render) pueden necesitar backends distintos, y ninguna
 * librería de terceros va a exponer exactamente la interfaz que
 * SyncArena necesita — cada una tiene su propio vocabulario, unidades
 * y formas de parámetros. Reescribir esas librerías no es una opción.
 *
 * Cada Adapter de este archivo envuelve una librería externa distinta
 * (ver libsExternas.js) y expone la MISMA interfaz `MotorFisico`, de
 * modo que el resto del motor (sistema de movimiento, resolución de
 * colisiones) puede usar cualquiera de las dos sin saber cuál está
 * detrás.
 */

const { MotorFisico } = require("./motorFisico");
const { LitePhysicsEngine, ArcadePhysicsLib } = require("./libsExternas");

class LitePhysicsAdapter extends MotorFisico {
  constructor() {
    super();
    this._motor = new LitePhysicsEngine();
  }

  registrarCuerpo(idEntidad, posicionInicial) {
    this._motor.addBody(idEntidad, posicionInicial.x, posicionInicial.y);
  }

  aplicarFuerza(idEntidad, vectorFuerza) {
    this._motor.addForce(idEntidad, vectorFuerza.x, vectorFuerza.y);
  }

  actualizar(deltaSegundos) {
    this._motor.step(deltaSegundos); // LitePhysicsEngine ya trabaja en segundos
  }

  obtenerPosicion(idEntidad) {
    return this._motor.getBody(idEntidad);
  }

  hayColision(cajaA, cajaB) {
    // LitePhysicsEngine ya usa el mismo formato { x, y, ancho, alto }
    return this._motor.checkOverlap(cajaA, cajaB);
  }
}

class ArcadePhysicsAdapter extends MotorFisico {
  constructor() {
    super();
    this._motor = new ArcadePhysicsLib();
  }

  registrarCuerpo(idEntidad, posicionInicial) {
    this._motor.registrarEntidad(idEntidad, posicionInicial);
  }

  aplicarFuerza(idEntidad, vectorFuerza) {
    this._motor.applyImpulse(idEntidad, vectorFuerza);
  }

  actualizar(deltaSegundos) {
    // Adaptación de unidades: el motor entrega segundos, ArcadePhysicsLib
    // espera milisegundos.
    this._motor.tick(deltaSegundos * 1000);
  }

  obtenerPosicion(idEntidad) {
    return this._motor.bodyPosition(idEntidad);
  }

  hayColision(cajaA, cajaB) {
    // Adaptación de forma: el motor entrega { x, y, ancho, alto },
    // ArcadePhysicsLib espera { izq, der, arriba, abajo }.
    const rectA = this._cajaARect(cajaA);
    const rectB = this._cajaARect(cajaB);
    return this._motor.overlaps(rectA, rectB);
  }

  _cajaARect(caja) {
    return {
      izq: caja.x,
      der: caja.x + caja.ancho,
      arriba: caja.y,
      abajo: caja.y + caja.alto,
    };
  }
}

module.exports = { LitePhysicsAdapter, ArcadePhysicsAdapter };
