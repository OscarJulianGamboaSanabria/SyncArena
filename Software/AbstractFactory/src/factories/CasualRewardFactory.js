const RewardSystemFactory = require('./RewardSystemFactory');
const CasualAchievement = require('../products/achievements/CasualAchievement');
const CasualMission = require('../products/missions/CasualMission');
const CasualReward = require('../products/rewards/CasualReward');

class CasualRewardFactory extends RewardSystemFactory {
  createAchievement(config) {
    return new CasualAchievement(config);
  }

  createMission(config) {
    return new CasualMission(config);
  }

  createReward(config) {
    return new CasualReward(config);
  }

  getGameGenre() {
    return 'casual';
  }
}

module.exports = CasualRewardFactory;
