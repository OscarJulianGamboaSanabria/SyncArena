/**
 * Producto abstracto: Mission (Misión diaria/semanal)
 */
class Mission {
  constructor({ id, name, goal } = {}) {
    if (new.target === Mission) {
      throw new TypeError(
        'Mission es una clase abstracta y no puede instanciarse directamente. Usa una subclase concreta (ej. ShooterMission).'
      );
    }
    if (!id || !name || !goal) {
      throw new Error('Una Mission requiere "id", "name" y "goal".');
    }

    this.id = id;
    this.name = name;
    this.goal = goal;
    this.genre = 'generic'; // sobreescrito por cada subclase concreta
    this.progress = 0;
  }

  addProgress(amount = 1) {
    this.progress = Math.min(this.goal, this.progress + amount);
    return this.progress;
  }

  isCompleted() {
    return this.progress >= this.goal;
  }

  /**
   * Monedas otorgadas al completar la misión.
   * Cada género pondera distinto el "grind" requerido.
   */
  getCoinReward() {
    throw new Error(`getCoinReward() no implementado en ${this.constructor.name}`);
  }
}

module.exports = Mission;
