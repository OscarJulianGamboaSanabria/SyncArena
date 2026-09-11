const Reward = require('./Reward');

class ShooterReward extends Reward {
  constructor(config = {}) {
    super(config);
    this.genre = 'shooter';
  }

  getMultiplier() {
    return 1.2; // partidas más cortas y repetitivas -> mayor incentivo económico
  }
}

module.exports = ShooterReward;
