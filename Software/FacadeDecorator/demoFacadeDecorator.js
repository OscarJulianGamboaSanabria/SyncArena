/**
 * demoFacadeDecorator.js
 * -------------------------
 * Demo ejecutable (no es una prueba formal). El código cliente solo
 * conoce `servicio.iniciarPartida(...)`; no sabe que detrás hay tres
 * subsistemas ni tres decoradores.
 *
 * NOTA: el reloj de MetricasDecorator es SIMULADO (avanza 40 ms por
 * llamada) para que la salida sea siempre la misma. Con el reloj real
 * por defecto, los tiempos dependerían de la máquina.
 */

const { ServicioRecursos, ServicioConexion, ServicioPartidas } = require("./subsistemas");
const { PartidaFacade } = require("./partidaFacade");
const {
  LoggingDecorator,
  MetricasDecorator,
  NotificacionesDecorator,
} = require("./decoradoresConcretos");

const conexion = new ServicioConexion();
const fachada = new PartidaFacade({
  recursos: new ServicioRecursos(),
  conexion,
  partidas: new ServicioPartidas(),
});

let tiempoSimulado = 0;
const relojSimulado = () => (tiempoSimulado += 20); // cada lectura avanza 20 ms

// Se apilan de adentro hacia afuera: Logging -> Métricas -> Notificaciones
const conLog = new LoggingDecorator(fachada);
const conMetricas = new MetricasDecorator(conLog, relojSimulado);
const servicio = new NotificacionesDecorator(conMetricas);

console.log("=== 1) Partida normal: una sola llamada del cliente ===");
const { idPartida } = servicio.iniciarPartida({ mapa: "arena_industrial" }, ["Oscar", "Jesus"]);
console.log("Jugadores conectados:", conexion.totalConectados());

console.log("\n=== 2) Partida que falla (mapa inexistente) ===");
try {
  servicio.iniciarPartida({ mapa: "mapa_inventado" }, ["Ana"]);
} catch (error) {
  console.log("El cliente recibe el error:", error.message);
}

console.log("\n=== 3) Partida que falla a mitad de camino (jugador duplicado) ===");
try {
  servicio.iniciarPartida({ mapa: "isla_norte" }, ["Luis", "Sara", "Luis"]);
} catch (error) {
  console.log("El cliente recibe el error:", error.message);
}
console.log("Jugadores conectados tras el rollback (siguen solo Oscar y Jesus):", conexion.totalConectados());

console.log("\n=== 4) Finalizar la primera partida ===");
servicio.finalizarPartida(idPartida);
console.log("Jugadores conectados:", conexion.totalConectados());

console.log("\n--- Notificaciones (NotificacionesDecorator) ---");
servicio.mensajes().forEach((mensaje) => console.log(" *", mensaje));

console.log("\n--- Registro de eventos (LoggingDecorator) ---");
conLog.entradas().forEach((entrada) => console.log(" ", JSON.stringify(entrada)));

console.log("\n--- Métricas (MetricasDecorator, reloj simulado) ---");
console.log(conMetricas.metricas());
