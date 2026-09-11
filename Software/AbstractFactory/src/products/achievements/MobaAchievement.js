const Achievement = require('./Achievement');

/**
 * Producto concreto: logro para juegos de tipo MOBA.
 * Se desbloquea en base a estadísticas de equipo (assists, objetivos, etc.)
 */
class MobaAchievement extends Achievement {
  constructor(config = {}) {
    super(config);
    this.genre = 'moba';
    this.statKey = config.statKey || 'assists';
    this.threshold = config.threshold ?? 25;
  }

  checkUnlock(playerStats = {}) {
    const value = playerStats[this.statKey] ?? 0;
    return value >= this.threshold;
  }
}

module.exports = MobaAchievement;
