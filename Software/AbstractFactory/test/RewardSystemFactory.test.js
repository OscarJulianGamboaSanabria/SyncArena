const { describe, test } = require('node:test');
const assert = require('node:assert/strict');

const {
  getRewardFactory,
  registerRewardFactory,
  RewardSystemFactory,
} = require('../src/index');

const Achievement = require('../src/products/achievements/Achievement');
const Mission = require('../src/products/missions/Mission');
const Reward = require('../src/products/rewards/Reward');

describe('factoryProvider: obtención de fábricas por tipo de juego', () => {
  test('retorna la fábrica correcta para cada género soportado', () => {
    assert.equal(getRewardFactory('shooter').getGameGenre(), 'shooter');
    assert.equal(getRewardFactory('MOBA').getGameGenre(), 'moba'); // case-insensitive
    assert.equal(getRewardFactory('casual').getGameGenre(), 'casual');
  });

  test('lanza un error descriptivo si el tipo de juego no está registrado', () => {
    assert.throws(() => getRewardFactory('rts'), /No existe una RewardSystemFactory/);
  });

  test('permite registrar nuevas fábricas en tiempo de ejecución (extensibilidad / Open-Closed)', () => {
    class RtsAchievement extends Achievement {
      constructor(config) {
        super(config);
        this.genre = 'rts';
      }
      checkUnlock() {
        return true;
      }
    }
    class RtsMission extends Mission {
      getCoinReward() {
        return this.goal * 3;
      }
    }
    class RtsReward extends Reward {
      getMultiplier() {
        return 1.1;
      }
    }
    class RtsRewardFactory extends RewardSystemFactory {
      createAchievement(config) {
        return new RtsAchievement(config);
      }
      createMission(config) {
        return new RtsMission(config);
      }
      createReward(config) {
        return new RtsReward(config);
      }
      getGameGenre() {
        return 'rts';
      }
    }

    registerRewardFactory('rts', RtsRewardFactory);

    const factory = getRewardFactory('rts');
    assert.equal(factory.getGameGenre(), 'rts');
    assert.ok(factory.createAchievement({ id: 'a1', name: 'Estratega' }) instanceof RtsAchievement);
  });
});

describe('Consistencia de familia por fábrica concreta', () => {
  const genres = ['shooter', 'moba', 'casual'];

  for (const genre of genres) {
    test(`la fábrica "${genre}" produce una familia de productos coherente entre sí`, () => {
      const factory = getRewardFactory(genre);

      const achievement = factory.createAchievement({ id: 'ach1', name: 'Logro', threshold: 10 });
      const mission = factory.createMission({ id: 'mis1', name: 'Misión', goal: 5 });
      const reward = factory.createReward({ id: 'rew1', name: 'Recompensa', baseCoins: 100, baseGems: 10 });

      // Todos deben respetar el contrato de sus productos abstractos.
      assert.ok(achievement instanceof Achievement);
      assert.ok(mission instanceof Mission);
      assert.ok(reward instanceof Reward);

      // Y todos deben pertenecer al mismo género (la garantía central de Abstract Factory).
      assert.equal(achievement.genre, genre);
      assert.equal(mission.genre, genre);
      assert.equal(reward.genre, genre);
    });
  }
});

describe('Las clases abstractas no pueden instanciarse directamente', () => {
  test('Achievement lanza TypeError', () => {
    assert.throws(() => new Achievement({ id: 'x', name: 'x' }), TypeError);
  });

  test('Mission lanza TypeError', () => {
    assert.throws(() => new Mission({ id: 'x', name: 'x', goal: 1 }), TypeError);
  });

  test('Reward lanza TypeError', () => {
    assert.throws(() => new Reward({ id: 'x', name: 'x' }), TypeError);
  });

  test('RewardSystemFactory base lanza error si se llama sin overrides', () => {
    const factory = new RewardSystemFactory();
    assert.throws(() => factory.createAchievement({}));
    assert.throws(() => factory.createMission({}));
    assert.throws(() => factory.createReward({}));
    assert.throws(() => factory.getGameGenre());
  });
});

describe('Comportamiento específico por género — Achievements', () => {
  test('ShooterAchievement se desbloquea según kills', () => {
    const ach = getRewardFactory('shooter').createAchievement({
      id: 'a', name: 'Francotirador', statKey: 'kills', threshold: 10,
    });
    assert.equal(ach.checkUnlock({ kills: 5 }), false);
    assert.equal(ach.checkUnlock({ kills: 12 }), true);
  });

  test('MobaAchievement se desbloquea según assists', () => {
    const ach = getRewardFactory('moba').createAchievement({
      id: 'a', name: 'Apoyo total', statKey: 'assists', threshold: 20,
    });
    assert.equal(ach.checkUnlock({ assists: 15 }), false);
    assert.equal(ach.checkUnlock({ assists: 25 }), true);
  });

  test('CasualAchievement se desbloquea según niveles completados', () => {
    const ach = getRewardFactory('casual').createAchievement({
      id: 'a', name: 'Maratonista', statKey: 'levelsCompleted', threshold: 5,
    });
    assert.equal(ach.checkUnlock({ levelsCompleted: 3 }), false);
    assert.equal(ach.checkUnlock({ levelsCompleted: 6 }), true);
  });

  test('unlock() marca el logro como desbloqueado con timestamp', () => {
    const ach = getRewardFactory('shooter').createAchievement({ id: 'a', name: 'a', threshold: 1 });
    assert.equal(ach.unlocked, false);
    ach.unlock();
    assert.equal(ach.unlocked, true);
    assert.notEqual(ach.unlockedAt, null);
  });
});

describe('Comportamiento específico por género — Missions', () => {
  test('las misiones acumulan progreso y se completan al llegar a la meta', () => {
    const mission = getRewardFactory('shooter').createMission({ id: 'm1', name: 'Elimina 10 enemigos', goal: 10 });
    assert.equal(mission.isCompleted(), false);
    mission.addProgress(7);
    assert.equal(mission.isCompleted(), false);
    mission.addProgress(5); // no debe pasarse de la meta
    assert.equal(mission.progress, 10);
    assert.equal(mission.isCompleted(), true);
  });

  test('la recompensa en monedas por misión varía según el género (shooter > moba > casual)', () => {
    const goal = 10;
    const shooterMission = getRewardFactory('shooter').createMission({ id: 'm', name: 'm', goal });
    const mobaMission = getRewardFactory('moba').createMission({ id: 'm', name: 'm', goal });
    const casualMission = getRewardFactory('casual').createMission({ id: 'm', name: 'm', goal });

    assert.ok(shooterMission.getCoinReward() > mobaMission.getCoinReward());
    assert.ok(mobaMission.getCoinReward() > casualMission.getCoinReward());
  });
});

describe('Comportamiento específico por género — Rewards', () => {
  test('applyToWallet aplica el multiplicador correcto al wallet del jugador', () => {
    const reward = getRewardFactory('shooter').createReward({ id: 'r', name: 'r', baseCoins: 100, baseGems: 10 });
    const wallet = { coins: 0, gems: 0 };

    reward.applyToWallet(wallet);

    assert.equal(wallet.coins, Math.round(100 * reward.getMultiplier()));
    assert.equal(wallet.gems, Math.round(10 * reward.getMultiplier()));
  });

  test('los multiplicadores económicos difieren entre géneros (shooter > moba > casual)', () => {
    const shooter = getRewardFactory('shooter').createReward({ id: 'r', name: 'r' });
    const moba = getRewardFactory('moba').createReward({ id: 'r', name: 'r' });
    const casual = getRewardFactory('casual').createReward({ id: 'r', name: 'r' });

    assert.ok(shooter.getMultiplier() > moba.getMultiplier());
    assert.ok(moba.getMultiplier() > casual.getMultiplier());
  });

  test('applyToWallet acumula sobre saldo existente en vez de sobrescribirlo', () => {
    const reward = getRewardFactory('casual').createReward({ id: 'r', name: 'r', baseCoins: 50, baseGems: 5 });
    const wallet = { coins: 100, gems: 10 };

    reward.applyToWallet(wallet);

    assert.equal(wallet.coins, 100 + Math.round(50 * reward.getMultiplier()));
    assert.equal(wallet.gems, 10 + Math.round(5 * reward.getMultiplier()));
  });
});
