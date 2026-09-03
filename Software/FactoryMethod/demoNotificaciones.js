/**
 * demoNotificaciones.js
 * -----------------------
 * Demo ejecutable (no es una prueba formal) que muestra cómo el
 * código cliente dispara distintos tipos de notificación sin conocer
 * las clases concretas de cada una — solo conoce `obtenerCreador(tipo)`
 * y el método `notificar()`.
 */

const { obtenerCreador } = require("./notificacionCreator");

const eventosDelMotor = [
  { tipo: "logro", datos: { destinatario: "Oscar", nombreLogro: "Primera victoria" } },
  {
    tipo: "invitacion_partida",
    datos: { destinatario: "Jesus", idPartida: "arena_01", jugadorQueInvita: "Oscar" },
  },
  {
    tipo: "mensaje_chat",
    datos: { destinatario: "Oscar", remitente: "Jesus", textoPreview: "¿Vamos de nuevo?" },
  },
  { tipo: "compra", datos: { destinatario: "Jesus", item: "Skin Dragón", monto: 9.99 } },
];

for (const evento of eventosDelMotor) {
  const creador = obtenerCreador(evento.tipo);
  const paquete = creador.notificar(evento.datos);
  console.log(`[${paquete.canal}] -> ${paquete.destinatario}: ${paquete.mensaje}`);
}
