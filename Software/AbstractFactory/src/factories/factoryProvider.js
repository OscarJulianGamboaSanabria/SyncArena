const ShooterRewardFactory = require('./ShooterRewardFactory');
const MobaRewardFactory = require('./MobaRewardFactory');
const CasualRewardFactory = require('./CasualRewardFactory');

/**
 * Registro de fábricas concretas disponibles, indexado por tipo de juego.
 * Nuevos géneros pueden añadirse en tiempo de ejecución con registerRewardFactory,
 * sin modificar el código cliente (Open/Closed Principle).
 */
const FACTORY_REGISTRY = {
  shooter: ShooterRewardFactory,
  moba: MobaRewardFactory,
  casual: CasualRewardFactory,
};

/**
 * Obtiene una instancia de la fábrica adecuada para el tipo de juego dado.
 * @param {string} gameType
 * @returns {import('./RewardSystemFactory')}
 */
function getRewardFactory(gameType) {
  const key = String(gameType || '').toLowerCase().trim();
  const FactoryClass = FACTORY_REGISTRY[key];

  if (!FactoryClass) {
    const validTypes = Object.keys(FACTORY_REGISTRY).join(', ');
    throw new Error(
      `No existe una RewardSystemFactory registrada para el tipo de juego "${gameType}". Tipos válidos: ${validTypes}`
    );
  }

  return new FactoryClass();
}

/**
 * Registra una nueva fábrica concreta para un tipo de juego, permitiendo
 * extender el sistema sin tocar el código existente.
 * @param {string} gameType
 * @param {Function} FactoryClass clase que extiende RewardSystemFactory
 */
function registerRewardFactory(gameType, FactoryClass) {
  const key = String(gameType).toLowerCase().trim();
  FACTORY_REGISTRY[key] = FactoryClass;
}

module.exports = { getRewardFactory, registerRewardFactory, FACTORY_REGISTRY };
