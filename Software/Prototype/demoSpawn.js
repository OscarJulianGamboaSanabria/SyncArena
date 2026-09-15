/**
 * demoSpawn.js
 * -------------
 * Demo ejecutable (no es una prueba formal) que muestra el registro
 * de prototipos spawneando varias entidades y demuestra que:
 * 1) el setup costoso de cada tipo se ejecuta una sola vez, aunque se
 *    spawneen muchas entidades del mismo tipo.
 * 2) las instancias resultantes son independientes entre sí.
 */

const { EnemigoZombie, EnemigoRobotArtillero } = require("./entidadesConcretas");
const { crearInstancia } = require("./spawnRegistry");

console.log(`Setup costoso de EnemigoZombie ejecutado: ${EnemigoZombie.vecesInicializado} vez(es)`);
console.log(`Setup costoso de EnemigoRobotArtillero ejecutado: ${EnemigoRobotArtillero.vecesInicializado} vez(es)`);
console.log("(estos contadores ya reflejan el prototipo cargado por spawnRegistry al iniciar el módulo)\n");

const oleada = [
  crearInstancia("enemigo_zombie", { x: 2, y: 3 }),
  crearInstancia("enemigo_zombie", { x: 8, y: 1 }),
  crearInstancia("enemigo_zombie", { x: 4, y: 9 }),
  crearInstancia("enemigo_robot_artillero", { x: 20, y: 20 }),
  crearInstancia("powerup_vida", { x: 10, y: 10 }),
  crearInstancia("powerup_escudo", { x: 12, y: 6 }),
];

for (const entidad of oleada) {
  console.log(
    `[spawn] ${entidad.tipo} en (${entidad.posicion.x}, ${entidad.posicion.y}) — stats:`,
    entidad.statsBase
  );
}

console.log(`\nSetup costoso de EnemigoZombie DESPUÉS de spawnear 3: ${EnemigoZombie.vecesInicializado} vez(es) (sigue en 1)`);

// Prueba de independencia: dañar al primer zombie no afecta a los demás
oleada[0].statsBase.vida = 1;
console.log(`\nVida del zombie #1 tras recibir daño: ${oleada[0].statsBase.vida}`);
console.log(`Vida del zombie #2 (sin tocar): ${oleada[1].statsBase.vida}`);
