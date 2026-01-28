export default class DebugOverlay {
    constructor() {
        this.enabled = false;
        this.fps = 0;
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    update(dt) {
        if (!this.enabled) return;
        const currentFps = dt > 0 ? 1 / dt : 0;
        this.fps = this.fps === 0 ? currentFps : this.fps * 0.9 + currentFps * 0.1;
    }

    draw(ctx, game) {
        if (!this.enabled || !ctx || !game) return;

        const enemies = Array.isArray(game.enemies) ? game.enemies : [];
        const aliveEnemies = enemies.filter(enemy => enemy && enemy.hp > 0 && !enemy.isDead);
        const bulletCount = game.bulletPool ? game.bulletPool.getActiveBullets().length : 0;

        const effectsManager = game.effectsManager;
        const explosionCount = effectsManager ? effectsManager.explosionEffects.length : 0;
        const lightningCount = effectsManager ? effectsManager.lightningEffects.length : 0;
        const rayCount = effectsManager ? effectsManager.rayEffects.length : 0;

        const statusSummary = this.buildStatusSummary(aliveEnemies);
        const statusText = statusSummary.length > 0 ? statusSummary.join('、') : '无';
        const dotSummary = this.buildDotSummary(aliveEnemies);
        const dotText = dotSummary.length > 0 ? dotSummary.join('、') : '无';

        const lines = [
            '调试: 开 (~)',
            `FPS: ${Math.round(this.fps)}`,
            `敌人: ${aliveEnemies.length}`,
            `子弹: ${bulletCount}`,
            `特效: 爆炸${explosionCount} 闪电${lightningCount} 射线${rayCount}`,
            `状态: ${statusText}`,
            `DOT: ${dotText}`
        ];

        ctx.save();
        ctx.font = '12px monospace';
        ctx.textBaseline = 'top';

        const padding = 6;
        const lineHeight = 14;
        let maxWidth = 0;
        for (const line of lines) {
            maxWidth = Math.max(maxWidth, ctx.measureText(line).width);
        }

        const boxWidth = Math.ceil(maxWidth) + padding * 2;
        const boxHeight = lineHeight * lines.length + padding * 2;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(8, 8, boxWidth, boxHeight);

        ctx.fillStyle = '#b9f7ff';
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], 8 + padding, 8 + padding + lineHeight * i);
        }

        ctx.restore();
    }

    buildStatusSummary(enemies) {
        const counts = new Map();

        for (const enemy of enemies) {
            if (!enemy || !enemy.statusEffects || typeof enemy.statusEffects.getAllEffects !== 'function') {
                continue;
            }
            const effects = enemy.statusEffects.getAllEffects();
            for (const effect of effects) {
                const label = effect.name || effect.id || 'unknown';
                const stackCount = typeof effect.getStackCount === 'function' ? effect.getStackCount() : (effect.stacks || 1);
                counts.set(label, (counts.get(label) || 0) + stackCount);
            }
        }

        return Array.from(counts.entries())
            .sort((a, b) => a[0].localeCompare(b[0], 'zh-Hans'))
            .map(([label, count]) => `${label}x${count}`);
    }

    buildDotSummary(enemies) {
        const summary = new Map();

        for (const enemy of enemies) {
            if (!enemy || !enemy.statusEffects || typeof enemy.statusEffects.getAllEffects !== 'function') {
                continue;
            }
            const effects = enemy.statusEffects.getAllEffects();
            for (const effect of effects) {
                if (!effect || effect.type !== 'dot') continue;

                const label = effect.name || effect.id || 'unknown';
                const stackCount = typeof effect.getStackCount === 'function' ? effect.getStackCount() : (effect.stacks || 1);
                const duration = Math.max(0, effect.duration || 0);
                const entry = summary.get(label) || { stacks: 0, maxDuration: 0 };
                entry.stacks += stackCount;
                entry.maxDuration = Math.max(entry.maxDuration, duration);
                summary.set(label, entry);
            }
        }

        return Array.from(summary.entries())
            .sort((a, b) => a[0].localeCompare(b[0], 'zh-Hans'))
            .map(([label, entry]) => {
                const seconds = entry.maxDuration / 60;
                return `${label}x${entry.stacks}(${seconds.toFixed(1)}s)`;
            });
    }
}
