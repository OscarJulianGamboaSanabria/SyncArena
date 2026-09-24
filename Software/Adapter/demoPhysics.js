/**
 * demoPhysics.js
 * ----------------
 * Demo ejecutable (no es una prueba formal) que corre EXACTAMENTE la
 * misma lógica de "un frame de juego" contra los dos adapters, para
 * mostrar que el código cliente no necesita saber cuál librería de
 * físicas está corriendo detrás.
 */

const { LitePhysicsAdapter, ArcadePhysicsAdapter } = require("./physicsAdapters");

function simularPartida(motorFisico, nombreMotor) {
  motorFisico.registrarCuerpo("jugador_oscar", { x: 0, y: 0 });
  motorFisico.registrarCuerpo("jugador_jesus", { x: 50, y: 0 });

  motorFisico.aplicarFuerza("jugador_oscar", { x: 8, y: 0 }); // corre hacia la derecha
  motorFisico.aplicarFuerza("jugador_jesus", { x: -6, y: 0 }); // corre hacia la izquierda

  // Simulamos 3 frames de 0.5 segundos cada uno (1.5s en total)
  for (let frame = 0; frame < 3; frame++) {
    motorFisico.actualizar(0.5);
  }

  const posOscar = motorFisico.obtenerPosicion("jugador_oscar");
  const posJesus = motorFisico.obtenerPosicion("jugador_jesus");

  const cajaOscar = { x: posOscar.x - 2, y: posOscar.y - 2, ancho: 4, alto: 4 };
  const cajaJesus = { x: posJesus.x - 2, y: posJesus.y - 2, ancho: 4, alto: 4 };
  const chocaron = motorFisico.hayColision(cajaOscar, cajaJesus);

  console.log(`[${nombreMotor}] Oscar en (${posOscar.x}, ${posOscar.y})`);
  console.log(`[${nombreMotor}] Jesus en (${posJesus.x}, ${posJesus.y})`);
  console.log(`[${nombreMotor}] ¿Colisionaron?`, chocaron);
}

console.log("--- Backend: LitePhysicsEngine ---");
simularPartida(new LitePhysicsAdapter(), "Lite");

console.log("\n--- Backend: ArcadePhysicsLib (misma lógica de partida, sin cambiar una línea) ---");
simularPartida(new ArcadePhysicsAdapter(), "Arcade");
