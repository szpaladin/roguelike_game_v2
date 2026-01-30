import ChestUI from '../../js/ui/ChestUI.js';

describe('ChestUI', () => {
    let ui;

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="chest-menu" style="display:none;"></div>
            <div id="chest-options"></div>
            <div id="fusion-overlay" style="display:none;"></div>
            <div id="fusion-options"></div>
        `;
        ui = new ChestUI();
    });

    test('showChestChoices shows overlay and appends gold last', () => {
        const evolutions = [
            { name: '燃霜', result: 'frostfire', materials: ['fire', 'frost'] }
        ];
        const fusions = [
            { id: 'fusion_fire_frost', materials: ['fire', 'frost'] }
        ];

        ui.showChestChoices(evolutions, fusions, 90, () => { });

        const overlay = document.getElementById('fusion-overlay');
        expect(overlay.style.display).toBe('flex');

        const cards = document.querySelectorAll('#fusion-options .fusion-card');
        expect(cards.length).toBe(3);
        expect(cards[0].dataset.rewardType).toBe('evolution');
        expect(cards[1].dataset.rewardType).toBe('fusion');
        const last = cards[cards.length - 1];
        expect(last.dataset.rewardType).toBe('gold');
    });

    test('selectDefaultReward chooses gold and closes overlay', () => {
        let selected = null;
        ui.showChestChoices([], [], 88, (selection) => {
            selected = selection;
        });

        const handled = ui.selectDefaultReward();
        expect(handled).toBe(true);
        expect(selected).toEqual({ type: 'gold', amount: 88 });

        const overlay = document.getElementById('fusion-overlay');
        expect(overlay.style.display).toBe('none');
    });
});
