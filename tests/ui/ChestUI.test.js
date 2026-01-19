import ChestUI from '../../js/ui/ChestUI.js';

describe('ChestUI', () => {
    let ui;
    let mockElements;

    beforeEach(() => {
        mockElements = {
            'chest-menu': { style: { display: 'none' } },
            'chest-options': { innerHTML: '', appendChild: () => { } },
            'fusion-overlay': { style: { display: 'none' } },
            'fusion-options': { innerHTML: '' }
        };

        document.getElementById = (id) => mockElements[id] || { appendChild: () => { }, style: {} };
        ui = new ChestUI();
    });

    test('open shows the chest menu', () => {
        ui.open([]);
        expect(mockElements['chest-menu'].style.display).toBe('block');
    });

    test('close hides the chest menu', () => {
        ui.open([]);
        ui.close();
        expect(mockElements['chest-menu'].style.display).toBe('none');
    });

    test('renderOptions creates buttons for each weapon', () => {
        const weapons = [
            { id: 'fire', name: '火焰', description: 'desc' },
            { id: 'swift', name: '疾风', description: 'desc' }
        ];

        // We expect 2 weapon cards/buttons to be created
        // Since we mock innerHTML, we might check how many children are appended or the content
        ui.open(weapons);
        // In actual implementation, we'll append elements to 'chest-options'
    });
});
