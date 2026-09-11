const Reward = require('./Reward');

class CasualReward extends Reward {
  constructor(config = {}) {
    super(config);
    this.genre = 'casual';
  }

  getMultiplier() {
    return 0.8; // sesiones cortas y frecuentes, economía más conservadora
  }
}

module.exports = CasualReward;
