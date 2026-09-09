/**
 * Producto abstracto: Achievement (Logro)
 *
 * Define el contrato que todo logro concreto debe cumplir,
 * sin importar el género del juego al que pertenezca.
 */
class Achievement {
  constructor({ id, name, description = '', points = 100 } = {}) {
    if (new.target === Achievement) {
      throw new TypeError(
        'Achievement es una clase abstracta y no puede instanciarse directamente. Usa una subclase concreta (ej. ShooterAchievement).'
      );
    }
    if (!id || !name) {
      throw new Error('Un Achievement requiere al menos "id" y "name".');
    }

    this.id = id;
    this.name = name;
    this.description = description;
    this.points = points;
    this.genre = 'generic'; // sobreescrito por cada subclase concreta
    this.unlocked = false;
    this.unlockedAt = null;
  }

  /**
   * Evalúa si, dadas las estadísticas del jugador, el logro debe desbloquearse.
   * Debe ser implementado por cada subclase concreta.
   * @param {object} playerStats
   * @returns {boolean}
   */
  checkUnlock(playerStats) {
    throw new Error(`checkUnlock() no implementado en ${this.constructor.name}`);
  }

  unlock() {
    if (!this.unlocked) {
      this.unlocked = true;
      this.unlockedAt = new Date().toISOString();
    }
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      points: this.points,
      genre: this.genre,
      unlocked: this.unlocked,
      unlockedAt: this.unlockedAt,
    };
  }
}

module.exports = Achievement;
