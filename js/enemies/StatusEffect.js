/**
 * StatusEffect - 单个状态效果实例
 * 代表敌人身上的一个激活的状态效果
 */
export default class StatusEffect {
    /**
     * @param {Object} definition - 效果定义 (来自 STATUS_EFFECTS)
     * @param {number} duration - 持续时间（帧）
     * @param {Object} params - 额外参数 (如伤害值、减速百分比等)
     */
    constructor(definition, duration, params = {}) {
        this.id = definition.id;
        this.name = definition.name;
        this.type = definition.type;
        this.color = params.color || definition.color;
        this.duration = duration;
        this.maxDuration = duration;
        this.stacks = params.stacks || 1;
        this.maxStacks = definition.maxStacks || 1;

        // 效果参数
        this.params = {
            damagePerFrame: params.damagePerFrame || 0,
            damagePerStack: params.damagePerStack || 0,
            slowAmount: params.slowAmount || 0,
            vulnerabilityAmount: params.vulnerabilityAmount || 0,
            ...params
        };
    }

    /**
     * 更新效果（每帧调用）
     * @param {Enemy} enemy - 受影响的敌人
     * @returns {number} - 本帧造成的伤害
     */
    update(enemy) {
        if (this.duration > 0) {
            this.duration--;
        }

        // 根据效果类型应用效果
        let damage = 0;
        switch (this.type) {
            case 'dot': // 持续伤害 (Damage Over Time)
                damage = this.calculateDotDamage(enemy);
                break;
            case 'debuff': // 减益效果 (不造成伤害)
                // 减益效果在其他地方应用（如移动速度、易伤）
                break;
            case 'cc': // 控制效果 (Crowd Control)
                // 控制效果影响敌人行为（如冰冻）
                break;
        }

        return damage;
    }

    /**
     * 计算持续伤害
     */
    calculateDotDamage(enemy) {
        let damage = 0;

        // 基础伤害
        if (this.params.damagePerFrame > 0) {
            damage += this.params.damagePerFrame;
        }

        // 叠加伤害
        if (this.params.damagePerStack > 0) {
            damage += this.params.damagePerStack * this.stacks;
        }

        // 易伤加成 (通过 statusEffects 管理器访问)
        // 注：冰冻效果本身不增加伤害，冰霜武器会同时施加冰冻+易伤两个独立效果
        if (enemy.statusEffects && enemy.statusEffects.hasEffect('vulnerable')) {
            const vulnEffect = enemy.statusEffects.getEffect('vulnerable');
            damage *= (1 + vulnEffect.params.vulnerabilityAmount);
        }

        return damage;
    }

    /**
     * 叠加效果
     * @param {number} additionalStacks - 增加的层数
     * @param {number} newDuration - 新的持续时间
     */
    stack(additionalStacks = 1, newDuration = null) {
        this.stacks = Math.min(this.stacks + additionalStacks, this.maxStacks);

        // 刷新持续时间
        if (newDuration !== null) {
            this.duration = Math.max(this.duration, newDuration);
            this.maxDuration = Math.max(this.maxDuration, newDuration);
        }
    }

    /**
     * 效果是否已过期
     */
    isExpired() {
        return this.duration <= 0;
    }

    /**
     * 获取进度百分比
     */
    getProgress() {
        return this.duration / this.maxDuration;
    }
}
