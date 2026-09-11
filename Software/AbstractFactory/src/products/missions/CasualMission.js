const Mission = require('./Mission');

class CasualMission extends Mission {
  constructor(config = {}) {
    super(config);
    this.genre = 'casual';
  }

  getCoinReward() {
    return this.goal * 2;
  }
}

module.exports = CasualMission;
