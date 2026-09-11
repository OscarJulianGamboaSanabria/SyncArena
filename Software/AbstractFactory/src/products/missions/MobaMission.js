const Mission = require('./Mission');

class MobaMission extends Mission {
  constructor(config = {}) {
    super(config);
    this.genre = 'moba';
  }

  getCoinReward() {
    return this.goal * 4;
  }
}

module.exports = MobaMission;
