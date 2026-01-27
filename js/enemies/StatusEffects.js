/**
 * StatusEffects - 状态效果定义和注册表
 * 集中管理所有游戏中的状态效果
 */

/**
 * 状态效果类型枚举
 */
export const STATUS_TYPE = {
    DOT: 'dot',       // 持续伤害 (Damage Over Time)
    DEBUFF: 'debuff', // 减益效果
    CC: 'cc'          // 控制效果 (Crowd Control)
};

/**
 * 所有状态效果的定义
 */
export const STATUS_EFFECTS = {
    // 燃烧 - 持续火焰伤害
    BURNING: {
        id: 'burning',
        name: '燃烧',
        type: STATUS_TYPE.DOT,
        color: '#ff4500',
        icon: '🔥',
        maxStacks: 1,
        description: '每帧造成持续火焰伤害',
        // 默认参数（可被武器覆盖）
        defaultDuration: 180,
        defaultDamagePerFrame: 5 / 60
    },

    // 冰冻 - 减速/定身
    FROZEN: {
        id: 'frozen',
        name: '冰冻',
        type: STATUS_TYPE.CC,
        color: '#00ffff',
        icon: '❄️',
        maxStacks: 1,
        description: '无法移动，受到额外10%伤害',
        defaultDuration: 60,
        defaultSlowAmount: 1.0 // 1.0 = 完全冻结
    },

    // 中毒 - 可叠加的持续伤害
    POISONED: {
        id: 'poisoned',
        name: '中毒',
        type: STATUS_TYPE.DOT,
        color: '#00ff00',
        icon: '☠️',
        maxStacks: 100,
        description: '持续毒性伤害，可叠加',
        defaultDuration: 300,
        defaultDamagePerStack: 5 / 60
    },

    // 易伤 - 增加受到的伤害
    VULNERABLE: {
        id: 'vulnerable',
        name: '易伤',
        type: STATUS_TYPE.DEBUFF,
        color: '#ff00ff',
        icon: '💔',
        maxStacks: 1,
        description: '受到的伤害增加',
        defaultDuration: 180,
        defaultVulnerabilityAmount: 0.5 // 50% 额外伤害
    },

    // 致盲 - 无法攻击玩家
    BLINDED: {
        id: 'blinded',
        name: '致盲',
        type: STATUS_TYPE.CC,
        color: '#000000',
        icon: '👁️',
        maxStacks: 1,
        description: '无法对玩家造成伤害',
        defaultDuration: 180
    },

    // 减速 - 移动速度降低
    SLOWED: {
        id: 'slowed',
        name: '减速',
        type: STATUS_TYPE.DEBUFF,
        color: '#4169e1',
        icon: '🐌',
        maxStacks: 1,
        description: '移动速度降低',
        defaultDuration: 120,
        defaultSlowAmount: 0.5 // 50% 减速
    }
};

/**
 * 根据ID获取状态效果定义
 * @param {string} effectId - 效果ID
 * @returns {Object|null} - 效果定义
 */
export function getStatusEffect(effectId) {
    const key = effectId.toUpperCase();
    return STATUS_EFFECTS[key] || null;
}

/**
 * 获取所有状态效果列表
 * @returns {Array<Object>} - 所有效果定义
 */
export function getAllStatusEffects() {
    return Object.values(STATUS_EFFECTS);
}

/**
 * 根据武器效果属性创建状态效果参数
 * @param {Object} bulletData - 子弹数据（包含武器属性）
 * @returns {Array<Object>} - 状态效果参数列表 [{effectId, duration, params}]
 */
export function extractStatusEffectsFromBullet(bulletData) {
    const effects = [];
    const hasBurn = bulletData.burnDuration > 0;
    const hasFreeze = bulletData.freezeChance > 0;

    // 燃烧效果
    if (hasBurn) {
        effects.push({
            effectId: 'burning',
            duration: bulletData.burnDuration,
            params: {
                damagePerFrame: bulletData.burnDamagePerFrame || STATUS_EFFECTS.BURNING.defaultDamagePerFrame,
                color: bulletData.burnColor
            }
        });

        // 燃烧同时施加易伤
        if (bulletData.vulnerability > 0) {
            effects.push({
                effectId: 'vulnerable',
                duration: bulletData.burnDuration,
                params: {
                    vulnerabilityAmount: bulletData.vulnerability
                }
            });
        }
    }

    // 冰冻效果
    if (hasFreeze && Math.random() < bulletData.freezeChance) {
        effects.push({
            effectId: 'frozen',
            duration: bulletData.freezeDuration || STATUS_EFFECTS.FROZEN.defaultDuration,
            params: {
                slowAmount: 1.0 // 完全冻结
            }
        });
    }

    if (bulletData.vulnerability > 0 && !hasBurn && !hasFreeze) {
        effects.push({
            effectId: 'vulnerable',
            duration: bulletData.vulnerabilityDuration || STATUS_EFFECTS.VULNERABLE.defaultDuration,
            params: {
                vulnerabilityAmount: bulletData.vulnerability
            }
        });
    }

    // 中毒效果
    if (bulletData.poisonDuration > 0) {
        effects.push({
            effectId: 'poisoned',
            duration: bulletData.poisonDuration,
            params: {
                damagePerStack: bulletData.poisonDamagePerStack || STATUS_EFFECTS.POISONED.defaultDamagePerStack,
                stacks: 1 // 每次命中+1层
            }
        });
    }

    // 致盲效果
    if (bulletData.blindChance > 0 && Math.random() < bulletData.blindChance) {
        effects.push({
            effectId: 'blinded',
            duration: bulletData.blindDuration || STATUS_EFFECTS.BLINDED.defaultDuration,
            params: {}
        });
    }

    return effects;
}

/**
 * 应用子弹的状态效果到敌人
 * 从 CollisionManager 移动至此，集中管理状态效果应用逻辑
 * 
 * @param {Object} bullet - 子弹对象（包含武器属性）
 * @param {Enemy} enemy - 敌人对象
 * @param {PlayerStats|null} playerStats - 玩家属性（用于获取智力倍率）
 */
export function applyBulletStatusEffects(bullet, enemy, playerStats = null) {
    // 获取智力倍率（用于 DOT 伤害）
    const intMultiplier = playerStats ? playerStats.intelligence / 50 : 1;
    const hasBurn = bullet.burnDuration > 0;
    const hasFreeze = bullet.freezeChance > 0;

    // 冰冻效果（触发时同时施加易伤）
    if (hasFreeze && Math.random() < bullet.freezeChance) {
        const freezeDuration = bullet.freezeDuration || STATUS_EFFECTS.FROZEN.defaultDuration;
        enemy.applyFreeze(freezeDuration);

        if (bullet.vulnerability > 0) {
            enemy.applyVulnerable(bullet.vulnerability, freezeDuration);
        }
    }

    // 燃烧效果（DOT 伤害 = 基础伤害 × 智力倍率）
    if (hasBurn) {
        const burnDamage = (bullet.burnDamagePerFrame || STATUS_EFFECTS.BURNING.defaultDamagePerFrame) * intMultiplier;
        enemy.applyBurn(bullet.burnDuration, burnDamage, bullet.burnColor);

        if (bullet.vulnerability > 0) {
            enemy.applyVulnerable(bullet.vulnerability, bullet.burnDuration);
        }
    }

    if (bullet.vulnerability > 0 && !hasBurn && !hasFreeze) {
        const vulnDuration = bullet.vulnerabilityDuration || STATUS_EFFECTS.VULNERABLE.defaultDuration;
        enemy.applyVulnerable(bullet.vulnerability, vulnDuration);
    }

    // 致盲效果
    if (bullet.blindChance > 0 && Math.random() < bullet.blindChance) {
        enemy.applyBlind(bullet.blindDuration || STATUS_EFFECTS.BLINDED.defaultDuration);
    }

    // 中毒效果（DOT 伤害 = 基础伤害 × 智力倍率）
    if (bullet.poisonDuration > 0) {
        const poisonDamage = (bullet.poisonDamagePerStack || STATUS_EFFECTS.POISONED.defaultDamagePerStack) * intMultiplier;
        enemy.applyPoison(bullet.poisonDuration, poisonDamage);
    }

    // 吸血效果
    if (bullet.lifeStealChance > 0 && Math.random() < bullet.lifeStealChance) {
        if (playerStats) {
            playerStats.heal(bullet.lifeStealAmount || 1);
        }
    }
}
