/**
 * notificacionCreator.js
 * -----------------------
 * Patrón Factory Method aplicado al sistema de notificaciones de
 * SyncArena.
 *
 * Por qué Factory Method aquí:
 * El motor necesita enviar notificaciones de tipos muy distintos
 * (logros, invitaciones a partida, mensajes de chat, confirmaciones
 * de compra) y es muy probable que en el futuro se agreguen más tipos
 * (misiones diarias, eventos de clan, etc). Si el código cliente
 * decidiera con un `if/switch` gigante qué clase instanciar cada vez,
 * cada nuevo tipo de notificación obligaría a tocar ese código en
 * muchos lugares.
 *
 * Con Factory Method, cada tipo de notificación tiene su propio
 * "Creador" que sabe cómo construir su producto. El código cliente
 * solo conoce la clase abstracta `NotificacionCreator` y su método
 * `notificar()`; no necesita saber qué clase concreta de notificación
 * se está creando por dentro.
 */

const {
  NotificacionLogro,
  NotificacionInvitacionPartida,
  NotificacionMensajeChat,
  NotificacionCompra,
} = require("./notificacion");

/**
 * Creador abstracto. Define el "método plantilla" notificar(), que
 * usa el factory method crearNotificacion() sin saber qué subclase
 * de Notificacion se va a construir.
 */
class NotificacionCreator {
  // --- Factory Method: cada subclase concreta lo sobrescribe ---
  crearNotificacion(datos) {
    throw new Error("crearNotificacion() debe implementarse en la subclase.");
  }

  // --- Lógica común a TODOS los tipos de notificación ---
  notificar(datos) {
    const notificacion = this.crearNotificacion(datos);
    const paquete = notificacion.enviar();
    return paquete;
  }
}

class CreadorNotificacionLogro extends NotificacionCreator {
  crearNotificacion({ destinatario, nombreLogro }) {
    return new NotificacionLogro(destinatario, nombreLogro);
  }
}

class CreadorNotificacionInvitacionPartida extends NotificacionCreator {
  crearNotificacion({ destinatario, idPartida, jugadorQueInvita }) {
    return new NotificacionInvitacionPartida(destinatario, idPartida, jugadorQueInvita);
  }
}

class CreadorNotificacionMensajeChat extends NotificacionCreator {
  crearNotificacion({ destinatario, remitente, textoPreview }) {
    return new NotificacionMensajeChat(destinatario, remitente, textoPreview);
  }
}

class CreadorNotificacionCompra extends NotificacionCreator {
  crearNotificacion({ destinatario, item, monto }) {
    return new NotificacionCompra(destinatario, item, monto);
  }
}

/**
 * Registro de creadores disponibles por tipo. Esto es solo un punto
 * de entrada cómodo para el resto del motor; el patrón Factory Method
 * en sí vive en las clases de arriba.
 */
const creadoresPorTipo = {
  logro: new CreadorNotificacionLogro(),
  invitacion_partida: new CreadorNotificacionInvitacionPartida(),
  mensaje_chat: new CreadorNotificacionMensajeChat(),
  compra: new CreadorNotificacionCompra(),
};

function obtenerCreador(tipo) {
  const creador = creadoresPorTipo[tipo];
  if (!creador) {
    throw new Error(`No existe un creador de notificaciones para el tipo '${tipo}'.`);
  }
  return creador;
}

module.exports = {
  NotificacionCreator,
  CreadorNotificacionLogro,
  CreadorNotificacionInvitacionPartida,
  CreadorNotificacionMensajeChat,
  CreadorNotificacionCompra,
  obtenerCreador,
};
