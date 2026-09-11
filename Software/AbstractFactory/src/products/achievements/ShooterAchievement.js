const Achievement = require('./Achievement');

/**
 * Producto concreto: logro para juegos de tipo Shooter.
 * Se desbloquea en base a estadísticas de combate (kills, headshots, etc.)
 */
class ShooterAchievement extends Achievement {
  constructor(config = {}) {
    super(config);
    this.genre = 'shooter';
    this.statKey = config.statKey || 'kills';
    this.threshold = config.threshold ?? 10;
  }

  checkUnlock(playerStats = {}) {
    const value = playerStats[this.statKey] ?? 0;
    return value >= this.threshold;
  }
}

module.exports = ShooterAchievement;
