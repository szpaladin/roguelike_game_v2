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
});
