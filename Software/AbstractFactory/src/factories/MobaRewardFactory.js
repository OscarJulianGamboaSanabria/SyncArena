const RewardSystemFactory = require('./RewardSystemFactory');
const MobaAchievement = require('../products/achievements/MobaAchievement');
const MobaMission = require('../products/missions/MobaMission');
const MobaReward = require('../products/rewards/MobaReward');

class MobaRewardFactory extends RewardSystemFactory {
  createAchievement(config) {
    return new MobaAchievement(config);
  }

  createMission(config) {
    return new MobaMission(config);
  }

  createReward(config) {
    return new MobaReward(config);
  }

  getGameGenre() {
    return 'moba';
  }
}

module.exports = MobaRewardFactory;
