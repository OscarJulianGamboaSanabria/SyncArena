/**
 * esquemasConcretos.js
 * -----------------------
 * Abstracciones refinadas del Bridge: tres formas distintas de
 * interpretar la misma entrada normalizada, completamente ajenas a
 * qué dispositivo la está generando.
 */

const { EsquemaControl } = require("./esquemaControl");

class EsquemaEstandar extends EsquemaControl {
  procesarEntrada() {
    const estado = this._dispositivo.leerEstado();
    return {
      mover: { x: estado.ejeX, y: estado.ejeY },
      saltar: estado.accionPrimaria,
      atacar: estado.accionSecundaria,
    };
  }
}

class EsquemaInvertido extends EsquemaControl {
  // Útil para vuelo/cámara: invierte el eje Y, deja todo lo demás igual.
  procesarEntrada() {
    const estado = this._dispositivo.leerEstado();
    return {
      mover: { x: estado.ejeX, y: -estado.ejeY },
      saltar: estado.accionPrimaria,
      atacar: estado.accionSecundaria,
    };
  }
}

class EsquemaAccesibilidad extends EsquemaControl {
  constructor(dispositivo, zonaMuerta = 0.3) {
    super(dispositivo);
    this._zonaMuerta = zonaMuerta;
  }

  // Simplifica la entrada analógica a 8 direcciones (o quieto), para
  // jugadores a quienes les cuesta sostener un ángulo preciso.
  procesarEntrada() {
    const estado = this._dispositivo.leerEstado();
    const magnitud = Math.hypot(estado.ejeX, estado.ejeY);

    if (magnitud < this._zonaMuerta) {
      return { mover: { x: 0, y: 0 }, saltar: estado.accionPrimaria, atacar: estado.accionSecundaria };
    }

    const anguloSnap = Math.round(Math.atan2(estado.ejeY, estado.ejeX) / (Math.PI / 4)) * (Math.PI / 4);

    return {
      mover: {
        x: Math.round(Math.cos(anguloSnap) * 100) / 100,
        y: Math.round(Math.sin(anguloSnap) * 100) / 100,
      },
      saltar: estado.accionPrimaria,
      atacar: estado.accionSecundaria,
    };
  }
}

module.exports = { EsquemaEstandar, EsquemaInvertido, EsquemaAccesibilidad };
