const RewardSystemFactory = require('./RewardSystemFactory');
const ShooterAchievement = require('../products/achievements/ShooterAchievement');
const ShooterMission = require('../products/missions/ShooterMission');
const ShooterReward = require('../products/rewards/ShooterReward');

class ShooterRewardFactory extends RewardSystemFactory {
  createAchievement(config) {
    return new ShooterAchievement(config);
  }

  createMission(config) {
    return new ShooterMission(config);
  }

  createReward(config) {
    return new ShooterReward(config);
  }

  getGameGenre() {
    return 'shooter';
  }
}

module.exports = ShooterRewardFactory;
