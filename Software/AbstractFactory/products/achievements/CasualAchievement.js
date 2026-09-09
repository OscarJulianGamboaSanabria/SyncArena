const Achievement = require('./Achievement');

/**
 * Producto concreto: logro para juegos casuales.
 * Se desbloquea en base a progreso acumulado (niveles completados, rachas, etc.)
 */
class CasualAchievement extends Achievement {
  constructor(config = {}) {
    super(config);
    this.genre = 'casual';
    this.statKey = config.statKey || 'levelsCompleted';
    this.threshold = config.threshold ?? 5;
  }

  checkUnlock(playerStats = {}) {
    const value = playerStats[this.statKey] ?? 0;
    return value >= this.threshold;
  }
}

module.exports = CasualAchievement;
