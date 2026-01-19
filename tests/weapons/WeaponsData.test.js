import { WEAPONS, WEAPON_ID_MAP, WEAPON_FUSION_TABLE, getWeaponInfo, getWeaponIdByOrder, getAvailableFusions, performFusion } from '../../js/weapons/WeaponsData.js';

describe('WeaponsData', () => {
    test('WEAPONS contains basic weapons', () => {
        expect(WEAPONS.BASIC).toBeDefined();
        expect(WEAPONS.FIRE).toBeDefined();
        expect(WEAPONS.FROST).toBeDefined();
        expect(WEAPONS.BASIC.name).toBe('普通弹珠');
    });

    test('WEAPONS contains evolution weapons', () => {
        expect(WEAPONS.BOMB).toBeDefined();
        expect(WEAPONS.STORM).toBeDefined();
    });

    test('getWeaponInfo returns correct info', () => {
        const info = getWeaponInfo('fire');
        expect(info.name).toBe('火焰');
        expect(info.id).toBe('fire');
    });

    test('getWeaponIdByOrder returns correct id', () => {
        // Basic weapon order 0 is 'basic'
        expect(getWeaponIdByOrder(0)).toBe('basic');
        // Fire is order 1
        expect(getWeaponIdByOrder(1)).toBe('fire');
    });

    test('getAvailableFusions returns valid recipes for player weapons', () => {
        const playerWeapons = [
            { def: WEAPONS.FIRE },
            { def: WEAPONS.SWIFT }
        ];
        const available = getAvailableFusions(playerWeapons);
        // Swift + Fire = Inferno
        expect(available.some(r => r.result === 'inferno')).toBe(true);
    });

    test('performFusion replaces materials with result weapon', () => {
        const playerWeapons = [
            { def: WEAPONS.FIRE, name: '火焰', color: '#ff6600', cooldown: 0 },
            { def: WEAPONS.SWIFT, name: '疾风', color: '#00ff00', cooldown: 0 }
        ];
        const recipe = WEAPON_FUSION_TABLE.find(r => r.result === 'inferno');

        const result = performFusion(playerWeapons, recipe);
        expect(result.success).toBe(true);
        expect(playerWeapons.length).toBe(1);
        expect(playerWeapons[0].def.id).toBe('inferno');
    });
});
