import ChestManager from '../../js/chest/ChestManager.js';
import { WEAPONS, getAvailableFusions, performFusion } from '../../js/weapons/WeaponsData.js';

// Mock ChestUI
const mockChestUI = {
    open: jest.fn(),
    showFusions: jest.fn(),
    close: jest.fn()
};

describe('ChestManager - Weapon Fusion', () => {
    let chestManager;

    beforeEach(() => {
        chestManager = new ChestManager(mockChestUI);
        jest.clearAllMocks();
    });

    describe('openChest with fusion options', () => {
        test('shows fusion options when player has compatible weapons', () => {
            // Player has Fire + Frost = can make Frostfire
            const mockPlayer = {
                weaponSystem: {
                    weapons: [
                        { def: WEAPONS.FIRE },
                        { def: WEAPONS.FROST }
                    ],
                    getWeapons: function () { return this.weapons; }
                }
            };
            const mockChest = { x: 100, y: 200, interactionCooldown: 0 };

            chestManager.openChest(mockChest, mockPlayer, () => { });

            // Should call showFusions with available recipes
            expect(mockChestUI.showFusions).toHaveBeenCalled();
            const recipes = mockChestUI.showFusions.mock.calls[0][0];
            expect(recipes.some(r => r.result === 'frostfire')).toBe(true);
        });

        test('skips chest when no fusion options available', () => {
            // Player has only one weapon, cannot fuse
            const mockPlayer = {
                weaponSystem: {
                    weapons: [
                        { def: WEAPONS.FIRE }
                    ],
                    getWeapons: function () { return this.weapons; }
                }
            };
            const mockChest = { x: 100, y: 200, interactionCooldown: 0 };
            const mockOnComplete = jest.fn();

            chestManager.openChest(mockChest, mockPlayer, mockOnComplete);

            // Should not show fusion UI
            expect(mockChestUI.showFusions).not.toHaveBeenCalled();
            // Should remove chest and call onComplete
            expect(mockOnComplete).toHaveBeenCalled();
        });

        test('performs fusion when player selects a recipe', () => {
            const mockPlayer = {
                weaponSystem: {
                    weapons: [
                        { def: WEAPONS.FIRE, name: '火焰', color: '#ff6600', cooldown: 0 },
                        { def: WEAPONS.FROST, name: '冰霜', color: '#00ccff', cooldown: 0 }
                    ],
                    getWeapons: function () { return this.weapons; },
                    setWeapons: function (w) { this.weapons = w; }
                }
            };
            const mockChest = { x: 100, y: 200, interactionCooldown: 0 };

            // Mock showFusions to immediately call callback with frostfire recipe
            mockChestUI.showFusions.mockImplementation((recipes, callback) => {
                const frostfireRecipe = recipes.find(r => r.result === 'frostfire');
                callback(frostfireRecipe);
            });

            chestManager.openChest(mockChest, mockPlayer, () => { });

            // After fusion: Fire + Frost removed, Frostfire added
            expect(mockPlayer.weaponSystem.weapons.length).toBe(1);
            expect(mockPlayer.weaponSystem.weapons[0].def.id).toBe('frostfire');
        });
    });
});
