import ChestManager from '../../js/chest/ChestManager.js';
import { WEAPONS } from '../../js/weapons/WeaponsData.js';
import { jest } from '@jest/globals';

// Mock ChestUI
const mockChestUI = {
    open: jest.fn(),
    showChestChoices: jest.fn(),
    close: jest.fn()
};

describe('ChestManager - Weapon Fusion', () => {
    let chestManager;

    beforeEach(() => {
        chestManager = new ChestManager(mockChestUI);
        jest.clearAllMocks();
    });

    describe('openChest with fusion options', () => {
        test('shows fusion options and gold reward', () => {
            // Player has Fire + Frost = can make Frostfire
            const mockPlayer = {
                weaponSystem: {
                    weapons: [
                        { def: WEAPONS.FIRE },
                        { def: WEAPONS.FROST }
                    ],
                    getWeapons: function () { return this.weapons; }
                },
                stats: {
                    addGold: jest.fn()
                }
            };
            const mockChest = { x: 100, y: 200, interactionCooldown: 0 };
            const mockRisk = { getCurrentZone: () => ({ name: '危险区' }) };
            const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0);

            chestManager.openChest(mockChest, mockPlayer, {
                distanceMeters: 350,
                riskSystem: mockRisk,
                onComplete: () => { }
            });

            // Should call showFusions with available recipes
            expect(mockChestUI.showChestChoices).toHaveBeenCalled();
            const recipes = mockChestUI.showChestChoices.mock.calls[0][0];
            const goldReward = mockChestUI.showChestChoices.mock.calls[0][1];
            expect(recipes.some(r => r.result === 'frostfire')).toBe(true);
            expect(goldReward).toBe(83);
            randomSpy.mockRestore();
        });

        test('shows gold option when no fusion options available', () => {
            // Player has only one weapon, cannot fuse
            const mockPlayer = {
                weaponSystem: {
                    weapons: [
                        { def: WEAPONS.FIRE }
                    ],
                    getWeapons: function () { return this.weapons; }
                },
                stats: {
                    gold: 0,
                    addGold: jest.fn(function (amount) { this.gold += amount; })
                }
            };
            const mockChest = { x: 100, y: 200, interactionCooldown: 0 };
            const mockOnComplete = jest.fn();
            const mockRisk = { getCurrentZone: () => ({ name: '舒适区' }) };
            const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0);

            chestManager.chests.push(mockChest);
            mockChestUI.showChestChoices.mockImplementation((recipes, goldReward, callback) => {
                callback({ type: 'gold', amount: goldReward });
            });

            chestManager.openChest(mockChest, mockPlayer, {
                distanceMeters: 0,
                riskSystem: mockRisk,
                onComplete: mockOnComplete
            });

            // Should show choices and award gold
            expect(mockChestUI.showChestChoices).toHaveBeenCalled();
            expect(mockPlayer.stats.addGold).toHaveBeenCalledWith(75);
            expect(mockChestManagerHasChest(chestManager, mockChest)).toBe(false);
            expect(mockOnComplete).toHaveBeenCalled();
            randomSpy.mockRestore();
        });

        test('performs fusion when player selects a recipe', () => {
            const mockPlayer = {
                weaponSystem: {
                    weapons: [
                        { def: WEAPONS.FIRE, name: '火焰', color: '#ff6600', cooldown: 0 },
                        { def: WEAPONS.FROST, name: '冰霜', color: '#00ccff', cooldown: 0 }
                    ],
                    getWeapons: function () { return this.weapons; },
                    setWeapons: function (w) { this.weapons = w; },
                    removeWeapon: function (id) {
                        this.weapons = this.weapons.filter(w => w.def.id !== id);
                    },
                    addWeapon: function (def) {
                        this.weapons.push({ def, name: def.name, color: def.color, cooldown: 0 });
                    }
                },
                stats: {
                    addGold: jest.fn()
                }
            };
            const mockChest = { x: 100, y: 200, interactionCooldown: 0 };
            const mockRisk = { getCurrentZone: () => ({ name: '舒适区' }) };

            // Mock showFusions to immediately call callback with frostfire recipe
            mockChestUI.showChestChoices.mockImplementation((recipes, goldReward, callback) => {
                const frostfireRecipe = recipes.find(r => r.result === 'frostfire');
                callback({ type: 'fusion', recipe: frostfireRecipe });
            });

            chestManager.openChest(mockChest, mockPlayer, {
                distanceMeters: 0,
                riskSystem: mockRisk,
                onComplete: () => { }
            });

            // After fusion: Fire + Frost removed, Frostfire added
            expect(mockPlayer.weaponSystem.weapons.length).toBe(1);
            expect(mockPlayer.weaponSystem.weapons[0].def.id).toBe('frostfire');
        });
    });
});

function mockChestManagerHasChest(chestManager, chest) {
    return chestManager.chests.includes(chest);
}
