import WeaponSystem from '../../js/weapons/WeaponSystem.js';
import { WEAPONS } from '../../js/weapons/WeaponsData.js';
import Weapon from '../../js/weapons/Weapon.js';

describe('WeaponSystem', () => {
    let system;

    beforeEach(() => {
        system = new WeaponSystem();
    });

    test('initializes with empty weapons list', () => {
        expect(system.weapons.length).toBe(0);
    });

    test('addWeapon adds a new weapon', () => {
        system.addWeapon(WEAPONS.FIRE);
        expect(system.weapons.length).toBe(1);
        expect(system.weapons[0]).toBeInstanceOf(Weapon);
        expect(system.weapons[0].def.id).toBe('fire');
    });

    test('update calls update on all weapons', () => {
        system.addWeapon(WEAPONS.FIRE);
        system.weapons[0].cooldown = 10;
        system.update();
        expect(system.weapons[0].cooldown).toBe(9);
    });

    test('autoShoot fires ready weapons when enemies are in range', () => {
        system.addWeapon(WEAPONS.FIRE);
        const enemies = [{ x: 100, y: 0, radius: 10, hp: 100 }];
        const playerPos = { x: 0, y: 0 };

        let spawnedData = null;
        const bulletPool = {
            spawnBullet: (data) => {
                spawnedData = data;
            }
        };

        system.autoShoot(playerPos, enemies, bulletPool);
        expect(spawnedData).not.toBeNull();
        expect(spawnedData.damage).toBe(WEAPONS.FIRE.damage);
        expect(system.weapons[0].cooldown).toBe(WEAPONS.FIRE.interval);
    });

    test('findNearestEnemy returns the correct enemy', () => {
        const enemies = [
            { x: 100, y: 100, hp: 100 },
            { x: 50, y: 50, hp: 100 }, // Nearest
            { x: 200, y: 200, hp: 100 }
        ];
        const nearest = system.findNearestEnemy(0, 0, enemies);
        expect(nearest.x).toBe(50);
    });
});
