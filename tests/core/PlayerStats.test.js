import PlayerStats from '../../js/core/PlayerStats.js';

describe('PlayerStats', () => {
    let stats;

    beforeEach(() => {
        stats = new PlayerStats();
    });

    describe('Initialization', () => {
        test('initializes with correct default values', () => {
            expect(stats.hp).toBe(100);
            expect(stats.maxHp).toBe(100);
            expect(stats.level).toBe(1);
            expect(stats.exp).toBe(0);
            expect(stats.expToNext).toBe(10);
            expect(stats.strength).toBe(50);
            expect(stats.intelligence).toBe(50);
            expect(stats.defense).toBe(2);
            expect(stats.skillPoints).toBe(0);
            expect(stats.gold).toBe(0);
        });
    });

    describe('Experience and Leveling', () => {
        test('gainExp increases experience', () => {
            stats.gainExp(5);
            expect(stats.exp).toBe(5);
        });

        test('gainExp triggers level up when threshold reached', () => {
            stats.gainExp(10);
            expect(stats.level).toBe(2);
            expect(stats.exp).toBe(0);
            expect(stats.skillPoints).toBe(1);
            expect(stats.expToNext).toBe(12); // 10 * 1.2
        });

        test('gainExp handles multiple level ups', () => {
            stats.gainExp(50); // Should level up multiple times
            expect(stats.level).toBeGreaterThan(1);
            expect(stats.skillPoints).toBeGreaterThan(0);
        });

        test('levelUp increases maxHp and heals to full', () => {
            stats.hp = 50;
            stats.gainExp(10); // Trigger level up
            expect(stats.maxHp).toBe(110);
            expect(stats.hp).toBe(110);
        });
    });

    describe('Health Management', () => {
        test('takeDamage reduces HP correctly', () => {
            const actualDamage = stats.takeDamage(30); // use internal defense (2)
            expect(stats.hp).toBe(72); // 100 - max(1, 30-2) = 100 - 28
            expect(actualDamage).toBe(28);
        });

        test('takeDamage always deals at least 1 damage', () => {
            stats.defense = 10;
            const actualDamage = stats.takeDamage(1); // defense > damage
            expect(stats.hp).toBe(99);
            expect(actualDamage).toBe(1);
        });

        test('takeDamage never reduces HP below 0', () => {
            stats.defense = 0;
            stats.takeDamage(200);
            expect(stats.hp).toBe(0);
        });

        test('heal increases HP but not beyond maxHp', () => {
            stats.hp = 50;
            stats.heal(30);
            expect(stats.hp).toBe(80);

            stats.heal(50);
            expect(stats.hp).toBe(100); // capped at maxHp
        });

        test('isAlive returns correct state', () => {
            expect(stats.isAlive()).toBe(true);
            stats.hp = 0;
            expect(stats.isAlive()).toBe(false);
        });
    });

    describe('Resource Management', () => {
        test('addGold increases gold', () => {
            stats.addGold(50);
            expect(stats.gold).toBe(50);
            stats.addGold(25);
            expect(stats.gold).toBe(75);
        });

        test('useSkillPoint decrements skill points', () => {
            stats.skillPoints = 3;
            const result = stats.useSkillPoint();
            expect(result).toBe(true);
            expect(stats.skillPoints).toBe(2);
        });

        test('useSkillPoint returns false when no points available', () => {
            stats.skillPoints = 0;
            const result = stats.useSkillPoint();
            expect(result).toBe(false);
            expect(stats.skillPoints).toBe(0);
        });

        test('attribute upgrade methods work correctly', () => {
            stats.skillPoints = 4;

            expect(stats.upgradeMaxHp()).toBe(true);
            expect(stats.maxHp).toBe(120);

            expect(stats.upgradeStrength()).toBe(true);
            expect(stats.strength).toBe(55);

            expect(stats.upgradeDefense()).toBe(true);
            expect(stats.defense).toBe(3);

            expect(stats.upgradeSpeed()).toBe(true);
            expect(stats.speed).toBeCloseTo(3.2);

            expect(stats.skillPoints).toBe(0);
        });
    });

    describe('Serialization', () => {
        test('toJSON returns all stats', () => {
            const json = stats.toJSON();
            expect(json).toHaveProperty('hp');
            expect(json).toHaveProperty('maxHp');
            expect(json).toHaveProperty('level');
            expect(json).toHaveProperty('exp');
            expect(json).toHaveProperty('expToNext');
            expect(json).toHaveProperty('strength');
            expect(json).toHaveProperty('intelligence');
            expect(json).toHaveProperty('defense');
            expect(json).toHaveProperty('skillPoints');
            expect(json).toHaveProperty('gold');
        });
    });
});
