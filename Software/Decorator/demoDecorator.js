/**
 * demoDecorator.js
 * -------------------
 * Demo ejecutable (no es una prueba formal) que simula un combate
 * corto: un jugador recoge un escudo (permanente), entra en furia y
 * pisa una trampa de veneno (ambos temporales), y se muestran sus
 * stats turno a turno mientras los efectos temporales expiran solos.
 */

const { JugadorBase } = require("./jugadorBase");
const {
  EscudoDecorator,
  BotasVelocidadDecorator,
  VenenoDecorator,
  FuriaDecorator,
} = require("./efectosConcretos");

function mostrarEstado(etiqueta, personaje) {
  console.log(
    `[${etiqueta}] ${personaje.describir()} — ` +
      `dano:${personaje.obtenerDano()} defensa:${personaje.obtenerDefensa()} velocidad:${personaje.obtenerVelocidad()}`
  );
}

const oscar = new JugadorBase("Oscar", { dano: 10, defensa: 10, velocidad: 10 });
mostrarEstado("base", oscar);

// Recoge un escudo (permanente) y unas botas (permanentes)
let personaje = new BotasVelocidadDecorator(new EscudoDecorator(oscar));
mostrarEstado("con equipo", personaje);

// Entra en furia (3 turnos) y pisa veneno (2 turnos)
personaje = new FuriaDecorator(new VenenoDecorator(personaje, 2), 3);
mostrarEstado("furia + veneno activos", personaje);

console.log("\n--- Pasan los turnos ---");
personaje.avanzarTurno();
mostrarEstado("turno 1", personaje);

personaje.avanzarTurno();
mostrarEstado("turno 2 (veneno ya debería expirar)", personaje);

personaje.avanzarTurno();
mostrarEstado("turno 3 (furia ya debería expirar)", personaje);
