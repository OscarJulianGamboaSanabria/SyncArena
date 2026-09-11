const RewardSystemFactory = require('./factories/RewardSystemFactory');
const ShooterRewardFactory = require('./factories/ShooterRewardFactory');
const MobaRewardFactory = require('./factories/MobaRewardFactory');
const CasualRewardFactory = require('./factories/CasualRewardFactory');
const { getRewardFactory, registerRewardFactory, FACTORY_REGISTRY } = require('./factories/factoryProvider');

const Achievement = require('./products/achievements/Achievement');
const Mission = require('./products/missions/Mission');
const Reward = require('./products/rewards/Reward');

module.exports = {
  // Fábricas
  RewardSystemFactory,
  ShooterRewardFactory,
  MobaRewardFactory,
  CasualRewardFactory,
  getRewardFactory,
  registerRewardFactory,
  FACTORY_REGISTRY,

  // Productos abstractos (útiles para instanceof en el código cliente/tests)
  Achievement,
  Mission,
  Reward,
};
