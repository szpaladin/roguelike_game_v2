import UpgradeUI from '../../js/ui/UpgradeUI.js';

describe('UpgradeUI', () => {
    let ui;
    let mockElements;

    beforeEach(() => {
        mockElements = {
            'upgrade-menu': { style: { display: 'none' } },
            'btn-upgrade-hp': { onclick: null },
            'btn-upgrade-atk': { onclick: null },
            'btn-upgrade-def': { onclick: null },
            'btn-upgrade-spd': { onclick: null }
        };

        document.getElementById = (id) => mockElements[id] || { appendChild: () => { } };
        ui = new UpgradeUI();
    });

    test('open shows the upgrade menu', () => {
        ui.open();
        expect(mockElements['upgrade-menu'].style.display).toBe('block');
    });

    test('close hides the upgrade menu', () => {
        ui.open();
        ui.close();
        expect(mockElements['upgrade-menu'].style.display).toBe('none');
    });

    test('upgrade calls the correct stat increase method', () => {
        const player = {
            stats: {
                useSkillPoint: () => true,
                upgradeMaxHp: function () { this.maxHp += 20; return true; },
                maxHp: 100,
                hp: 100,
                attack: 5,
                defense: 2,
                speed: 3
            }
        };

        // Simulate clicking HP upgrade
        ui.init(player);
        mockElements['btn-upgrade-hp'].onclick();

        expect(player.stats.maxHp).toBeGreaterThan(100);
    });
});
