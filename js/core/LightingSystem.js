/**
 * LightingSystem - 光线系统
 * 使用全屏黑色遮罩模拟深度光线衰减
 * 适用于移动端性能优化
 */

// 深度区间光照配置
const LIGHT_ZONES = [
    { minDepth: 0, maxDepth: 1000, alpha: 0.00, name: '明亮' },
    { minDepth: 1000, maxDepth: 2500, alpha: 0.20, name: '昏暗' },
    { minDepth: 2500, maxDepth: 5000, alpha: 0.45, name: '黑暗' },
    { minDepth: 5000, maxDepth: Infinity, alpha: 0.70, name: '极暗' }
];

export default class LightingSystem {
    constructor() {
        this.currentAlpha = 0;
        this.targetAlpha = 0;
        this.transitionSpeed = 0.5; // 每秒过渡0.5的alpha
    }

    /**
     * 获取指定深度的黑暗透明度
     * @param {number} distance - 当前距离（米）
     * @returns {number} - 透明度 0-1
     */
    getDarknessAlpha(distance) {
        for (const zone of LIGHT_ZONES) {
            if (distance >= zone.minDepth && distance < zone.maxDepth) {
                return zone.alpha;
            }
        }
        return LIGHT_ZONES[LIGHT_ZONES.length - 1].alpha;
    }

    /**
     * 获取当前区域信息
     * @param {number} distance - 当前距离（米）
     * @returns {Object} - 区域信息
     */
    getCurrentZoneInfo(distance) {
        for (const zone of LIGHT_ZONES) {
            if (distance >= zone.minDepth && distance < zone.maxDepth) {
                return zone;
            }
        }
        return LIGHT_ZONES[LIGHT_ZONES.length - 1];
    }

    /**
     * 更新光照（平滑过渡）
     * @param {number} distance - 当前距离（米）
     * @param {number} dt - 帧间隔（秒）
     */
    update(distance, dt) {
        this.targetAlpha = this.getDarknessAlpha(distance);

        // 平滑过渡
        if (this.currentAlpha < this.targetAlpha) {
            this.currentAlpha = Math.min(this.currentAlpha + this.transitionSpeed * dt, this.targetAlpha);
        } else if (this.currentAlpha > this.targetAlpha) {
            this.currentAlpha = Math.max(this.currentAlpha - this.transitionSpeed * dt, this.targetAlpha);
        }
    }

    /**
     * 绘制黑暗遮罩
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {number} width - 画布宽度
     * @param {number} height - 画布高度
     */
    draw(ctx, width, height) {
        if (this.currentAlpha <= 0) return;

        ctx.save();
        ctx.fillStyle = `rgba(0, 0, 0, ${this.currentAlpha})`;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
    }

    /**
     * 重置光照
     */
    reset() {
        this.currentAlpha = 0;
        this.targetAlpha = 0;
    }
}
