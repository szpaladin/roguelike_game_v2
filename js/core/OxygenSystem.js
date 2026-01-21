/**
 * OxygenSystem - 氧气系统
 * 管理玩家的氧气消耗（每隔一段时间扣除生命值）
 */
export default class OxygenSystem {
    /**
     * @param {number} interval - 扣血间隔（秒），默认1秒
     * @param {number} damage - 每次扣除的血量，默认1点
     */
    constructor(interval = 1, damage = 1) {
        this.interval = interval;
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
     * 重置计时器（用于游戏重新开始）
     */
    reset() {
        this.timer = 0;
    }

    /**
     * 设置消耗间隔
     * @param {number} interval - 新的扣血间隔（秒）
     */
    setInterval(interval) {
        this.interval = interval;
    }
}
