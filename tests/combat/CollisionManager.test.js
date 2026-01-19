import CollisionManager from '../../js/combat/CollisionManager.js';
import Enemy from '../../js/enemies/Enemy.js';
import Bullet from '../../js/combat/Bullet.js';

describe('CollisionManager', () => {
    let manager;
    let player;
    let enemies;
    let bullets;

    beforeEach(() => {
        manager = new CollisionManager();
        player = { x: 0, y: 0, radius: 10, stats: { takeDamage: () => { } } };

        // Overlapping: distance 15 < radius 10 + 10
        enemies = [
            new Enemy(15, 0, {
                name: 'E1', hp: 100, maxHp: 100, attack: 10, defense: 2, speed: 1, radius: 10, color: 'red', exp: 10, gold: 10
            })
        ];
        // Overlapping: distance 5 < radius 2 + 10
        bullets = [
            new Bullet({ x: 10, y: 0, vx: 1, vy: 0, damage: 10, radius: 2, lifetime: 60, active: true })
        ];
    });

    test('detects collision between player and enemies', () => {
        const collisions = manager.checkPlayerEnemyCollisions(player, enemies);
        expect(collisions.length).toBe(1);
        expect(collisions[0]).toBe(enemies[0]);
    });

    test('detects no collision when far apart', () => {
        enemies[0].x = 100;
        const collisions = manager.checkPlayerEnemyCollisions(player, enemies);
        expect(collisions.length).toBe(0);
    });

    test('detects collision between bullets and enemies', () => {
        const hits = manager.checkBulletEnemyCollisions(bullets, enemies);
        expect(hits.length).toBe(1);
        expect(hits[0].bullet).toBe(bullets[0]);
        expect(hits[0].enemy).toBe(enemies[0]);
    });

    test('bullets already hitting enemies are ignored', () => {
        bullets[0].hitEntities.add(enemies[0]);
        const hits = manager.checkBulletEnemyCollisions(bullets, enemies);
        expect(hits.length).toBe(0);
    });
});
