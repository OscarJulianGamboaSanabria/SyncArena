const Reward = require('./Reward');

class MobaReward extends Reward {
  constructor(config = {}) {
    super(config);
    this.genre = 'moba';
  }

  getMultiplier() {
    return 1.0; // partidas largas, economía balanceada
  }
}

module.exports = MobaReward;
