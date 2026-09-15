/**
 * spawnRegistry.js
 * ------------------
 * Punto de entrada del motor para pedir entidades nuevas. Guarda UN
 * prototipo ya inicializado por tipo, y cada spawn se resuelve
 * clonando ese prototipo en la posición indicada. Los módulos de
 * matchmaking o de lógica de partida nunca instancian
 * EnemigoZombie/PowerUpVida/etc. directamente.
 */

const {
  EnemigoZombie,
  EnemigoRobotArtillero,
  PowerUpVida,
  PowerUpEscudoTemporal,
} = require("./entidadesConcretas");

const prototipos = new Map();

function registrarPrototipo(tipo, prototipo) {
  prototipos.set(tipo, prototipo);
}

function crearInstancia(tipo, posicion = { x: 0, y: 0 }) {
  const prototipo = prototipos.get(tipo);
  if (!prototipo) {
    throw new Error(`No hay un prototipo registrado para el tipo '${tipo}'.`);
  }
  const instancia = prototipo.clonar();
  instancia.posicion = { ...posicion };
  return instancia;
}

function tiposDisponibles() {
  return [...prototipos.keys()];
}

// Registro por defecto del motor: un prototipo por tipo, creado una
// sola vez al cargar este módulo.
registrarPrototipo("enemigo_zombie", new EnemigoZombie());
registrarPrototipo("enemigo_robot_artillero", new EnemigoRobotArtillero());
registrarPrototipo("powerup_vida", new PowerUpVida());
registrarPrototipo("powerup_escudo", new PowerUpEscudoTemporal());

module.exports = { registrarPrototipo, crearInstancia, tiposDisponibles };
