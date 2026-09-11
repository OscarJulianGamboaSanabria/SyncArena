/**
 * Producto abstracto: Reward (Recompensa económica)
 */
class Reward {
  constructor({ id, name, baseCoins = 0, baseGems = 0 } = {}) {
    if (new.target === Reward) {
      throw new TypeError(
        'Reward es una clase abstracta y no puede instanciarse directamente. Usa una subclase concreta (ej. ShooterReward).'
      );
    }
    if (!id || !name) {
      throw new Error('Un Reward requiere al menos "id" y "name".');
    }

    this.id = id;
    this.name = name;
    this.baseCoins = baseCoins;
    this.baseGems = baseGems;
    this.genre = 'generic'; // sobreescrito por cada subclase concreta
  }

  /**
   * Multiplicador de economía específico del género del juego.
   */
  getMultiplier() {
    throw new Error(`getMultiplier() no implementado en ${this.constructor.name}`);
  }

  /**
   * Aplica esta recompensa a una billetera de jugador (muta y retorna el wallet).
   * @param {{coins:number, gems:number}} wallet
   */
  applyToWallet(wallet) {
    const multiplier = this.getMultiplier();
    wallet.coins = (wallet.coins || 0) + Math.round(this.baseCoins * multiplier);
    wallet.gems = (wallet.gems || 0) + Math.round(this.baseGems * multiplier);
    return wallet;
  }
}

module.exports = Reward;
