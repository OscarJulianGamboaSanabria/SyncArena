const Mission = require('./Mission');

class ShooterMission extends Mission {
  constructor(config = {}) {
    super(config);
    this.genre = 'shooter';
  }

  getCoinReward() {
    return this.goal * 5;
  }
}

module.exports = ShooterMission;
