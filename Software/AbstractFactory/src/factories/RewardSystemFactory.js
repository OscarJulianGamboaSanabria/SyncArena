/**
 * Abstract Factory: RewardSystemFactory
 *
 * Declara la interfaz para crear una FAMILIA de productos relacionados
 * (Achievement + Mission + Reward) que deben ser coherentes entre sí
 * según el género del juego (shooter, moba, casual, ...).
 *
 * Este es el punto central del patrón: el código cliente trabaja
 * únicamente contra esta interfaz, sin conocer las clases concretas.
 */
class RewardSystemFactory {
  /**
   * @param {object} config
   * @returns {import('../products/achievements/Achievement')}
   */
  createAchievement(config) {
    throw new Error(`createAchievement() no implementado en ${this.constructor.name}`);
  }

  /**
   * @param {object} config
   * @returns {import('../products/missions/Mission')}
   */
  createMission(config) {
    throw new Error(`createMission() no implementado en ${this.constructor.name}`);
  }

  /**
   * @param {object} config
   * @returns {import('../products/rewards/Reward')}
   */
  createReward(config) {
    throw new Error(`createReward() no implementado en ${this.constructor.name}`);
  }

  /**
   * @returns {string} identificador del género que representa esta fábrica
   */
  getGameGenre() {
    throw new Error(`getGameGenre() no implementado en ${this.constructor.name}`);
  }
}

module.exports = RewardSystemFactory;
