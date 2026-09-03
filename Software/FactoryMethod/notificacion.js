/**
 * notificacion.js
 * ----------------
 * "Productos" del patrón Factory Method aplicado al envío de
 * notificaciones dentro de SyncArena.
 *
 * Todas las notificaciones comparten la misma interfaz (enviar,
 * obtenerResumen), pero cada una arma su contenido y su canal de
 * envío de forma distinta. Esta es la parte "variable" que el
 * Factory Method se encarga de ocultar del código cliente.
 */

class Notificacion {
  constructor(destinatario) {
    if (new.target === Notificacion) {
      throw new Error("Notificacion es abstracta, no se puede instanciar directamente.");
    }
    this.destinatario = destinatario;
    this.fecha = new Date();
  }

  // Cada subclase debe implementar cómo arma su mensaje
  obtenerMensaje() {
    throw new Error("obtenerMensaje() debe implementarse en la subclase.");
  }

  // Cada subclase debe decir por qué canal se envía
  obtenerCanal() {
    throw new Error("obtenerCanal() debe implementarse en la subclase.");
  }

  // Comportamiento común: "enviar" simplemente arma el paquete final.
  // (Aquí se simula el envío; en producción se conectaría con push,
  // websockets, correo, etc.)
  enviar() {
    const paquete = {
      canal: this.obtenerCanal(),
      destinatario: this.destinatario,
      mensaje: this.obtenerMensaje(),
      fecha: this.fecha.toISOString(),
    };
    return paquete;
  }
}

class NotificacionLogro extends Notificacion {
  constructor(destinatario, nombreLogro) {
    super(destinatario);
    this.nombreLogro = nombreLogro;
  }

  obtenerMensaje() {
    return `¡Desbloqueaste el logro "${this.nombreLogro}"!`;
  }

  obtenerCanal() {
    return "push";
  }
}

class NotificacionInvitacionPartida extends Notificacion {
  constructor(destinatario, idPartida, jugadorQueInvita) {
    super(destinatario);
    this.idPartida = idPartida;
    this.jugadorQueInvita = jugadorQueInvita;
  }

  obtenerMensaje() {
    return `${this.jugadorQueInvita} te invitó a la partida ${this.idPartida}.`;
  }

  obtenerCanal() {
    return "in_game";
  }
}

class NotificacionMensajeChat extends Notificacion {
  constructor(destinatario, remitente, textoPreview) {
    super(destinatario);
    this.remitente = remitente;
    this.textoPreview = textoPreview;
  }

  obtenerMensaje() {
    return `${this.remitente}: ${this.textoPreview}`;
  }

  obtenerCanal() {
    return "in_game";
  }
}

class NotificacionCompra extends Notificacion {
  constructor(destinatario, item, monto) {
    super(destinatario);
    this.item = item;
    this.monto = monto;
  }

  obtenerMensaje() {
    return `Compra confirmada: ${this.item} por $${this.monto}.`;
  }

  obtenerCanal() {
    return "email";
  }
}

module.exports = {
  Notificacion,
  NotificacionLogro,
  NotificacionInvitacionPartida,
  NotificacionMensajeChat,
  NotificacionCompra,
};
