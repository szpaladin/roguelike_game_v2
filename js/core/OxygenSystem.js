/**
 * OxygenSystem - 氧气系统
 * 管理玩家的氧气消耗（每秒扣除生命值）
 */
export default class OxygenSystem {
    /**
     * @param {number} drainRate - 每秒消耗的氧气量（默认1点/秒）
     */
    constructor(drainRate = 1) {
        this.drainRate = drainRate;
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
        if (this.timer >= 1.0) {
            this.timer -= 1.0;
            playerStats.takeDamage(this.drainRate);
            drained = this.drainRate;
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
     * 设置消耗速率
     * @param {number} rate - 新的消耗速率
     */
    setDrainRate(rate) {
        this.drainRate = rate;
    }
}
