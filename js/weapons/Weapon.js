/**
 * Weapon - 武器基类
 * 管理单个武器的冷却和发射逻辑
 */
export default class Weapon {
    /**
     * @param {Object} definition - 武器定义数据 (来自 WEAPONS)
     */
    constructor(definition) {
        this.def = definition;
        this.name = definition.name;
        this.color = definition.color;
        this.cooldown = 0;
    }

    /**
     * 更新冷却时间
     */
    update() {
        if (this.cooldown > 0) {
            this.cooldown--;
        }
    }

    /**
     * 检查是否可以发射
     */
    canFire() {
        return this.cooldown <= 0;
    }

    /**
     * 发射武器
     * @param {number} startX - 发射起始位置 X
     * @param {number} startY - 发射起始位置 Y (世界坐标)
     * @param {Object} targetPos - 目标位置 {x, y} (世界坐标)
     * @param {number} playerAttack - 玩家攻击力
     * @returns {Object} - 子弹初始化数据
     */
    fire(startX, startY, targetPos, playerAttack = 5) {
        if (!this.canFire()) return null;

        // 计算速度向量
        const dx = targetPos.x - startX;
        const dy = targetPos.y - startY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // 如果没有距离（目标就在原地），默认向上发射
        let vx = 0;
        let vy = -this.def.speed;

        if (dist > 0) {
            vx = (dx / dist) * this.def.speed;
            vy = (dy / dist) * this.def.speed;
        }

        // 重置冷却
        this.cooldown = this.def.interval;

        // 计算最终伤害 = 武器伤害倍率 * 力量 / 10
        const finalDamage = this.def.damage * (playerAttack / 10);

        // 返回子弹数据 (合并武器定义的所有属性)
        return {
            x: startX,
            y: startY,
            vx,
            vy,
            ...this.def,
            damage: finalDamage, // 覆盖伤害为最终计算值
            active: true
        };
    }
}
