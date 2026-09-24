/**
 * libsExternas.js
 * -----------------
 * Simula dos librerías de físicas de terceros con APIs incompatibles
 * entre sí (nombres de métodos distintos, unidades distintas, formas
 * de parámetros distintas). SyncArena no las controla ni puede
 * modificarlas — por eso hacen falta los adapters en
 * physicsAdapters.js.
 *
 * (Cada una implementa una simulación real, aunque mínima: posición +
 * velocidad + integración simple. No son solo stubs.)
 */

// ---------------------------------------------------------------
// Librería 1: LitePhysicsEngine
// API: addBody, addForce(fx, fy), step(dt en SEGUNDOS), getBody, checkOverlap
// Las cajas para colisión usan { x, y, ancho, alto }
// ---------------------------------------------------------------
class LitePhysicsEngine {
  constructor() {
    this._cuerpos = new Map();
  }

  addBody(id, x, y) {
    this._cuerpos.set(id, { x, y, vx: 0, vy: 0 });
  }

  addForce(id, fx, fy) {
    const cuerpo = this._cuerpos.get(id);
    cuerpo.vx += fx;
    cuerpo.vy += fy;
  }

  step(dtSegundos) {
    for (const cuerpo of this._cuerpos.values()) {
      cuerpo.x += cuerpo.vx * dtSegundos;
      cuerpo.y += cuerpo.vy * dtSegundos;
    }
  }

  getBody(id) {
    const cuerpo = this._cuerpos.get(id);
    return { x: cuerpo.x, y: cuerpo.y };
  }

  checkOverlap(cajaA, cajaB) {
    return (
      cajaA.x < cajaB.x + cajaB.ancho &&
      cajaA.x + cajaA.ancho > cajaB.x &&
      cajaA.y < cajaB.y + cajaB.alto &&
      cajaA.y + cajaA.alto > cajaB.y
    );
  }
}

// ---------------------------------------------------------------
// Librería 2: ArcadePhysicsLib
// API: registrarEntidad, applyImpulse({x,y}), tick(ms en MILISEGUNDOS),
// bodyPosition, overlaps — y las cajas se representan como
// { izq, der, arriba, abajo } en vez de { x, y, ancho, alto }
// ---------------------------------------------------------------
class ArcadePhysicsLib {
  constructor() {
    this._entidades = {};
  }

  registrarEntidad(id, posicionInicial) {
    this._entidades[id] = { pos: { ...posicionInicial }, vel: { x: 0, y: 0 } };
  }

  applyImpulse(id, impulso) {
    const entidad = this._entidades[id];
    entidad.vel.x += impulso.x;
    entidad.vel.y += impulso.y;
  }

  tick(ms) {
    const segundos = ms / 1000;
    for (const entidad of Object.values(this._entidades)) {
      entidad.pos.x += entidad.vel.x * segundos;
      entidad.pos.y += entidad.vel.y * segundos;
    }
  }

  bodyPosition(id) {
    return { ...this._entidades[id].pos };
  }

  overlaps(rectA, rectB) {
    return rectA.izq < rectB.der && rectA.der > rectB.izq &&
           rectA.arriba < rectB.abajo && rectA.abajo > rectB.arriba;
  }
}

module.exports = { LitePhysicsEngine, ArcadePhysicsLib };
