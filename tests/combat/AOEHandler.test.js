import AOEHandler from '../../js/combat/AOEHandler.js';

describe('AOEHandler', () => {
    let handler;

    beforeEach(() => {
        handler = new AOEHandler();
    });

    test('initializes with null dependencies', () => {
        expect(handler.effectsManager).toBeNull();
        expect(handler.bulletPool).toBeNull();
    });

    test('setDependencies sets managers correctly', () => {
        const mockEffects = { addExplosion: () => { } };
        const mockBulletPool = { spawnBullet: () => { } };
        handler.setDependencies(mockEffects, mockBulletPool);
        expect(handler.effectsManager).toBe(mockEffects);
        expect(handler.bulletPool).toBe(mockBulletPool);
    });

    test('handleRangeEffects does nothing without effects', () => {
        const bullet = { chainCount: 0, explosionRadius: 0, aoeRadius: 0, rayRange: 0, canSplit: false };
        const hitEnemy = { x: 0, y: 0, hp: 100 };
        // Should not throw
        expect(() => handler.handleRangeEffects(bullet, hitEnemy, [], 10)).not.toThrow();
    });

    test('fullScreenDamage hits all enemies once', () => {
        const enemies = [
            { hp: 10, takeDamage(amount) { this.hp -= amount; return amount; } },
            { hp: 10, takeDamage(amount) { this.hp -= amount; return amount; } },
            { hp: 10, takeDamage(amount) { this.hp -= amount; return amount; } }
        ];
        const hitEnemy = enemies[0];
        let statusCalls = 0;
        const applyStatus = () => { statusCalls += 1; };
        const bullet = { fullScreenDamage: true, damage: 2 };

        handler.handleRangeEffects(bullet, hitEnemy, enemies, 5, applyStatus);
        expect(enemies.map(enemy => enemy.hp)).toEqual([8, 8, 8]);
        expect(statusCalls).toBe(2);

        handler.handleRangeEffects(bullet, hitEnemy, enemies, 5, applyStatus);
        expect(enemies.map(enemy => enemy.hp)).toEqual([8, 8, 8]);
    });
});
