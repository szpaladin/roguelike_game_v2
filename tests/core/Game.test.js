import Game from '../../js/core/Game.js';

describe('Game', () => {
    let game;

    beforeEach(() => {
        // Mock canvas context
        const mockCtx = {
            clearRect: () => { },
            save: () => { },
            restore: () => { },
            fillRect: () => { },
            beginPath: () => { },
            arc: () => { },
            fill: () => { }
        };

        game = new Game(mockCtx, 800, 600);
    });

    test('initializes all sub-systems', () => {
        expect(game.player).toBeDefined();
        expect(game.mapManager).toBeDefined();
        expect(game.enemySpawner).toBeDefined();
        expect(game.bulletPool).toBeDefined();
        expect(game.collisionManager).toBeDefined();
        expect(game.hud).toBeDefined();
    });

    test('update increments gameTime and distance', () => {
        const initialTime = game.gameTime;
        game.update(1 / 60);
        expect(game.gameTime).toBeGreaterThan(initialTime);
        expect(game.distance).toBeGreaterThan(0);
    });

    test('pause toggles game state', () => {
        game.togglePause();
        expect(game.paused).toBe(true);
        game.togglePause();
        expect(game.paused).toBe(false);
    });
});
