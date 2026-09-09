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
    expect(getRewardFactory('shooter').getGameGenre()).toBe('shooter');
    expect(getRewardFactory('MOBA').getGameGenre()).toBe('moba'); // case-insensitive
    expect(getRewardFactory('casual').getGameGenre()).toBe('casual');
  });

  test('lanza un error descriptivo si el tipo de juego no está registrado', () => {
    expect(() => getRewardFactory('rts')).toThrow(/No existe una RewardSystemFactory/);
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
    expect(factory.getGameGenre()).toBe('rts');
    expect(factory.createAchievement({ id: 'a1', name: 'Estratega' })).toBeInstanceOf(RtsAchievement);
  });
});

describe('Consistencia de familia por fábrica concreta', () => {
  const genres = ['shooter', 'moba', 'casual'];

  test.each(genres)('la fábrica "%s" produce una familia de productos coherente entre sí', (genre) => {
    const factory = getRewardFactory(genre);

    const achievement = factory.createAchievement({ id: 'ach1', name: 'Logro', threshold: 10 });
    const mission = factory.createMission({ id: 'mis1', name: 'Misión', goal: 5 });
    const reward = factory.createReward({ id: 'rew1', name: 'Recompensa', baseCoins: 100, baseGems: 10 });

    // Todos deben respetar el contrato de sus productos abstractos.
    expect(achievement).toBeInstanceOf(Achievement);
    expect(mission).toBeInstanceOf(Mission);
    expect(reward).toBeInstanceOf(Reward);

    // Y todos deben pertenecer al mismo género (la garantía central de Abstract Factory).
    expect(achievement.genre).toBe(genre);
    expect(mission.genre).toBe(genre);
    expect(reward.genre).toBe(genre);
  });
});

describe('Las clases abstractas no pueden instanciarse directamente', () => {
  test('Achievement lanza TypeError', () => {
    expect(() => new Achievement({ id: 'x', name: 'x' })).toThrow(TypeError);
  });

  test('Mission lanza TypeError', () => {
    expect(() => new Mission({ id: 'x', name: 'x', goal: 1 })).toThrow(TypeError);
  });

  test('Reward lanza TypeError', () => {
    expect(() => new Reward({ id: 'x', name: 'x' })).toThrow(TypeError);
  });

  test('RewardSystemFactory base lanza error si se llama sin overrides', () => {
    const factory = new RewardSystemFactory();
    expect(() => factory.createAchievement({})).toThrow();
    expect(() => factory.createMission({})).toThrow();
    expect(() => factory.createReward({})).toThrow();
    expect(() => factory.getGameGenre()).toThrow();
  });
});

describe('Comportamiento específico por género — Achievements', () => {
  test('ShooterAchievement se desbloquea según kills', () => {
    const ach = getRewardFactory('shooter').createAchievement({
      id: 'a', name: 'Francotirador', statKey: 'kills', threshold: 10,
    });
    expect(ach.checkUnlock({ kills: 5 })).toBe(false);
    expect(ach.checkUnlock({ kills: 12 })).toBe(true);
  });

  test('MobaAchievement se desbloquea según assists', () => {
    const ach = getRewardFactory('moba').createAchievement({
      id: 'a', name: 'Apoyo total', statKey: 'assists', threshold: 20,
    });
    expect(ach.checkUnlock({ assists: 15 })).toBe(false);
    expect(ach.checkUnlock({ assists: 25 })).toBe(true);
  });

  test('CasualAchievement se desbloquea según niveles completados', () => {
    const ach = getRewardFactory('casual').createAchievement({
      id: 'a', name: 'Maratonista', statKey: 'levelsCompleted', threshold: 5,
    });
    expect(ach.checkUnlock({ levelsCompleted: 3 })).toBe(false);
    expect(ach.checkUnlock({ levelsCompleted: 6 })).toBe(true);
  });

  test('unlock() marca el logro como desbloqueado con timestamp', () => {
    const ach = getRewardFactory('shooter').createAchievement({ id: 'a', name: 'a', threshold: 1 });
    expect(ach.unlocked).toBe(false);
    ach.unlock();
    expect(ach.unlocked).toBe(true);
    expect(ach.unlockedAt).not.toBeNull();
  });
});

describe('Comportamiento específico por género — Missions', () => {
  test('las misiones acumulan progreso y se completan al llegar a la meta', () => {
    const mission = getRewardFactory('shooter').createMission({ id: 'm1', name: 'Elimina 10 enemigos', goal: 10 });
    expect(mission.isCompleted()).toBe(false);
    mission.addProgress(7);
    expect(mission.isCompleted()).toBe(false);
    mission.addProgress(5); // no debe pasarse de la meta
    expect(mission.progress).toBe(10);
    expect(mission.isCompleted()).toBe(true);
  });

  test('la recompensa en monedas por misión varía según el género (shooter > moba > casual)', () => {
    const goal = 10;
    const shooterMission = getRewardFactory('shooter').createMission({ id: 'm', name: 'm', goal });
    const mobaMission = getRewardFactory('moba').createMission({ id: 'm', name: 'm', goal });
    const casualMission = getRewardFactory('casual').createMission({ id: 'm', name: 'm', goal });

    expect(shooterMission.getCoinReward()).toBeGreaterThan(mobaMission.getCoinReward());
    expect(mobaMission.getCoinReward()).toBeGreaterThan(casualMission.getCoinReward());
  });
});

describe('Comportamiento específico por género — Rewards', () => {
  test('applyToWallet aplica el multiplicador correcto al wallet del jugador', () => {
    const reward = getRewardFactory('shooter').createReward({ id: 'r', name: 'r', baseCoins: 100, baseGems: 10 });
    const wallet = { coins: 0, gems: 0 };

    reward.applyToWallet(wallet);

    expect(wallet.coins).toBe(Math.round(100 * reward.getMultiplier()));
    expect(wallet.gems).toBe(Math.round(10 * reward.getMultiplier()));
  });

  test('los multiplicadores económicos difieren entre géneros (shooter > moba > casual)', () => {
    const shooter = getRewardFactory('shooter').createReward({ id: 'r', name: 'r' });
    const moba = getRewardFactory('moba').createReward({ id: 'r', name: 'r' });
    const casual = getRewardFactory('casual').createReward({ id: 'r', name: 'r' });

    expect(shooter.getMultiplier()).toBeGreaterThan(moba.getMultiplier());
    expect(moba.getMultiplier()).toBeGreaterThan(casual.getMultiplier());
  });

  test('applyToWallet acumula sobre saldo existente en vez de sobrescribirlo', () => {
    const reward = getRewardFactory('casual').createReward({ id: 'r', name: 'r', baseCoins: 50, baseGems: 5 });
    const wallet = { coins: 100, gems: 10 };

    reward.applyToWallet(wallet);

    expect(wallet.coins).toBe(100 + Math.round(50 * reward.getMultiplier()));
    expect(wallet.gems).toBe(10 + Math.round(5 * reward.getMultiplier()));
  });
});
