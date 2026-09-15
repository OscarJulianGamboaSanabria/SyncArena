/**
 * entidadesConcretas.js
 * -----------------------
 * Prototipos concretos: enemigos y power-ups de SyncArena.
 *
 * Cada constructor simula un setup "costoso" (tabla de drops,
 * referencia a comportamiento de IA, efectos visuales) mediante un
 * contador estático `vecesInicializado`. Ese contador es lo que las
 * pruebas usan para demostrar que clonar() NO repite ese trabajo.
 */

const { EntidadPrototype } = require("./entidadPrototype");

class EnemigoZombie extends EntidadPrototype {
  static vecesInicializado = 0;

  constructor() {
    super("enemigo_zombie", { vida: 50, dano: 8, velocidad: 1.2 });
    EnemigoZombie.vecesInicializado += 1; // setup costoso, solo una vez
    this.tablaDrops = ["moneda", "pocion_menor"];
    this.comportamientoIA = "perseguir_lento";
  }
}

class EnemigoRobotArtillero extends EntidadPrototype {
  static vecesInicializado = 0;

  constructor() {
    super("enemigo_robot_artillero", { vida: 120, dano: 20, velocidad: 0.8 });
    EnemigoRobotArtillero.vecesInicializado += 1;
    this.tablaDrops = ["chatarra", "nucleo_energia", "moneda"];
    this.comportamientoIA = "mantener_distancia_disparar";
  }
}

class PowerUpVida extends EntidadPrototype {
  static vecesInicializado = 0;

  constructor() {
    super("powerup_vida", { curacion: 25 });
    PowerUpVida.vecesInicializado += 1;
    this.duracionEnMapaSegundos = 20;
  }
}

class PowerUpEscudoTemporal extends EntidadPrototype {
  static vecesInicializado = 0;

  constructor() {
    super("powerup_escudo", { multiplicadorDefensa: 1.5 });
    PowerUpEscudoTemporal.vecesInicializado += 1;
    this.duracionEfectoSegundos = 10;
    this.duracionEnMapaSegundos = 15;
  }
}

module.exports = { EnemigoZombie, EnemigoRobotArtillero, PowerUpVida, PowerUpEscudoTemporal };
