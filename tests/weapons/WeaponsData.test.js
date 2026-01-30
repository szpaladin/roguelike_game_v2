import { WEAPONS, WEAPON_ID_MAP, getWeaponInfo, getWeaponIdByOrder } from '../../js/weapons/WeaponsData.js';

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
        expect(getWeaponIdByOrder(0)).toBe('basic');
        expect(getWeaponIdByOrder(1)).toBe('fire');
    });
});