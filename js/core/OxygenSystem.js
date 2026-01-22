/**
 * OxygenSystem - 氧气系统
 * 管理玩家的氧气消耗（每隔一段时间扣除生命值）
 * 消耗速度随深度加速
 */

// 深度区间配置
const DEPTH_ZONES = [
    { minDepth: 0, maxDepth: 1000, interval: 4.0, name: '舒适区' },
    { minDepth: 1000, maxDepth: 2500, interval: 2.5, name: '中压区' },
    { minDepth: 2500, maxDepth: 5000, interval: 1.5, name: '高压区' },
    { minDepth: 5000, maxDepth: Infinity, interval: 0.8, name: '极限区' }
];

export default class OxygenSystem {
    /**
     * @param {number} interval - 扣血间隔（秒），默认4秒
     * @param {number} damage - 每次扣除的血量，默认1点
     */
    constructor(interval = 4, damage = 1) {
        this.interval = interval;
        this.baseInterval = interval;
        this.damage = damage;
        this.timer = 0;
    }

    /**
     * 更新氧气消耗
     * @param {number} dt - 帧间隔（秒）
     * @param {PlayerStats} playerStats - 玩家属性对象
     * @returns {number} - 本次扣除的氧气量（用于UI反馈）
     */
    update(dt, playerStats) {
        this.timer += dt;

        let drained = 0;
        if (this.timer >= this.interval) {
            this.timer -= this.interval;
            playerStats.takeDamage(this.damage);
            drained = this.damage;
        }

        return drained;
    }

    /**
     * 根据深度更新消耗间隔
     * @param {number} distance - 当前距离（米）
     */
    updateIntervalByDepth(distance) {
        const zone = this.getCurrentZoneInfo(distance);
        this.interval = zone.interval;
    }

    /**
     * 获取当前深度区域信息
     * @param {number} distance - 当前距离（米）
     * @returns {Object} - 区域信息 { name, interval, minDepth, maxDepth }
     */
    getCurrentZoneInfo(distance) {
        for (const zone of DEPTH_ZONES) {
            if (distance >= zone.minDepth && distance < zone.maxDepth) {
                return zone;
            }
        }
        // 默认返回最后一个区域
        return DEPTH_ZONES[DEPTH_ZONES.length - 1];
    }

    /**
     * 重置计时器（用于游戏重新开始）
     */
    reset() {
        this.timer = 0;
        this.interval = this.baseInterval;
    }

    /**
     * 设置消耗间隔
     * @param {number} interval - 新的扣血间隔（秒）
     */
    setInterval(interval) {
        this.interval = interval;
    }
}
