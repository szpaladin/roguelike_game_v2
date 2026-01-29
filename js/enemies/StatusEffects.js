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
        stackBehavior: 'independent',
        description: '持续毒性伤害，可叠加',
        defaultDuration: 300,
        defaultDamagePerStack: 5 / 60
    },

    // 瘟疫 - 可扩散的持续伤害
    PLAGUED: {
        id: 'plagued',
        name: '瘟疫',
        type: STATUS_TYPE.DOT,
        color: '#6f7a66',
        icon: '🦠',
        maxStacks: 40,
        stackBehavior: 'independent',
        description: '持续瘟疫伤害，可扩散',
        defaultDuration: 600,
        defaultDamagePerStack: 2 / 60,
        cloudRadius: 140,
        spreadInterval: 30,
        spreadRadius: 140,
        spreadStacks: 1,
        deathCloudDuration: 120,
        deathCloudInterval: 30,
        deathCloudRadius: 140,
        deathCloudStacks: 1
    },

    // 蔓延 - 叠层爆发
    OVERGROWTH: {
        id: 'overgrowth',
        name: '蔓延',
        type: STATUS_TYPE.DEBUFF,
        color: '#6ccf6d',
        icon: '🌱',
        maxStacks: 3,
        description: '叠层至3层后爆发',
        defaultDuration: 300,
        defaultTriggerStacks: 3,
        defaultExplosionRadius: 60,
        defaultExplosionMultiplier: 2.5
    },

    // 诅咒 - 受伤触发额外伤害
    CURSED: {
        id: 'cursed',
        name: '诅咒',
        type: STATUS_TYPE.DEBUFF,
        color: '#7b3f8c',
        icon: '🧿',
        maxStacks: 100,
        stackBehavior: 'independent',
        description: '受到非诅咒伤害时消耗层数并触发额外伤害',
        defaultDuration: 1800,
        defaultConsumeStacks: 1,
        defaultDamageMultiplier: 1.5
    },

    // 岩脊带控场 - 地形减速
    RIDGE_CONTROL: {
        id: 'ridge_control',
        name: '岩脊带控场',
        type: STATUS_TYPE.DEBUFF,
        color: '#6b5a4a',
        icon: '⛰️',
        maxStacks: 1,
        description: '生成岩脊带，范围内敌人持续减速',
        defaultDuration: 120,
        defaultLength: 90,
        defaultWidth: 18,
        defaultSlowAmount: 0.3,
        defaultSlowDuration: 120
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

    // 辐射易伤 - 可叠加的易伤
    RADIATION_VULNERABLE: {
        id: 'radiation_vulnerable',
        name: '辐射易伤',
        type: STATUS_TYPE.DEBUFF,
        color: '#7CFC00',
        icon: '☢️',
        maxStacks: 5,
        stackBehavior: 'independent',
        description: '由辐射造成易伤，可叠加',
        defaultDuration: 600,
        defaultVulnerabilityAmount: 0.1 // 每层 +10% 易伤
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

    if (bulletData.radiationVulnerability > 0) {
        effects.push({
            effectId: 'radiation_vulnerable',
            duration: bulletData.radiationVulnerabilityDuration || STATUS_EFFECTS.RADIATION_VULNERABLE.defaultDuration,
            params: {
                vulnerabilityAmount: bulletData.radiationVulnerability,
                stacks: 1
            }
        });
    }

    // 瘟疫效果
    if (bulletData.plagueDuration > 0) {
        const cloudRadius = bulletData.plagueCloudRadius
            || STATUS_EFFECTS.PLAGUED.cloudRadius
            || STATUS_EFFECTS.PLAGUED.deathCloudRadius
            || STATUS_EFFECTS.PLAGUED.spreadRadius;
        effects.push({
            effectId: 'plagued',
            duration: bulletData.plagueDuration,
            params: {
                damagePerStack: bulletData.plagueDamagePerStack || STATUS_EFFECTS.PLAGUED.defaultDamagePerStack,
                stacks: 1,
                baseDuration: bulletData.plagueDuration,
                color: bulletData.plagueColor,
                cloudRadius
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

    // 蔓延效果
    if (bulletData.overgrowthDuration > 0) {
        effects.push({
            effectId: 'overgrowth',
            duration: bulletData.overgrowthDuration || STATUS_EFFECTS.OVERGROWTH.defaultDuration,
            params: {
                stacks: 1,
                triggerStacks: bulletData.overgrowthTriggerStacks || STATUS_EFFECTS.OVERGROWTH.defaultTriggerStacks,
                explosionRadius: bulletData.overgrowthExplosionRadius || STATUS_EFFECTS.OVERGROWTH.defaultExplosionRadius,
                explosionMultiplier: bulletData.overgrowthExplosionMultiplier || STATUS_EFFECTS.OVERGROWTH.defaultExplosionMultiplier
            }
        });
    }

    // 诅咒效果
    if (bulletData.curseDuration > 0) {
        effects.push({
            effectId: 'cursed',
            duration: bulletData.curseDuration || STATUS_EFFECTS.CURSED.defaultDuration,
            params: {
                stacks: 1,
                consumeStacks: bulletData.curseConsumeStacks || STATUS_EFFECTS.CURSED.defaultConsumeStacks,
                damageMultiplier: bulletData.curseDamageMultiplier || STATUS_EFFECTS.CURSED.defaultDamageMultiplier
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
export function applyBulletStatusEffects(bullet, enemy, playerStats = null, options = {}) {
    const result = {};

    // 获取智力倍率（用于 DOT 伤害）
    const intMultiplier = playerStats ? playerStats.intelligence / 50 : 1;
    const hasBurn = bullet.burnDuration > 0;
    const hasFreeze = bullet.freezeChance > 0;
    const suppressFreeze = options && options.suppressFreeze === true;

    // 冰冻效果（触发时同时施加易伤）
    if (hasFreeze && !suppressFreeze && Math.random() < bullet.freezeChance) {
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

    if (bullet.radiationVulnerability > 0) {
        const radiationDuration = bullet.radiationVulnerabilityDuration || STATUS_EFFECTS.RADIATION_VULNERABLE.defaultDuration;
        enemy.applyStatusEffect('radiation_vulnerable', radiationDuration, {
            vulnerabilityAmount: bullet.radiationVulnerability,
            stacks: 1
        });
    }

    // 瘟疫效果（DOT 伤害 = 基础伤害 × 智力倍率）
    if (bullet.plagueDuration > 0) {
        const plagueDuration = bullet.plagueDuration || STATUS_EFFECTS.PLAGUED.defaultDuration;
        const plagueDamage = (bullet.plagueDamagePerStack || STATUS_EFFECTS.PLAGUED.defaultDamagePerStack) * intMultiplier;
        const cloudRadius = bullet.plagueCloudRadius
            || STATUS_EFFECTS.PLAGUED.cloudRadius
            || STATUS_EFFECTS.PLAGUED.deathCloudRadius
            || STATUS_EFFECTS.PLAGUED.spreadRadius;
        enemy.applyStatusEffect('plagued', plagueDuration, {
            damagePerStack: plagueDamage,
            stacks: 1,
            baseDuration: plagueDuration,
            color: bullet.plagueColor,
            cloudRadius
        });
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

    // 蔓延效果（叠层达到阈值后爆发）
    if (bullet.overgrowthDuration > 0) {
        const duration = bullet.overgrowthDuration || STATUS_EFFECTS.OVERGROWTH.defaultDuration;
        const triggerStacks = bullet.overgrowthTriggerStacks || STATUS_EFFECTS.OVERGROWTH.defaultTriggerStacks;
        const explosionRadius = bullet.overgrowthExplosionRadius || STATUS_EFFECTS.OVERGROWTH.defaultExplosionRadius;
        const explosionMultiplier = bullet.overgrowthExplosionMultiplier || STATUS_EFFECTS.OVERGROWTH.defaultExplosionMultiplier;
        enemy.applyStatusEffect('overgrowth', duration, {
            stacks: 1,
            triggerStacks,
            explosionRadius,
            explosionMultiplier
        });

        const overgrowthEffect = enemy.statusEffects ? enemy.statusEffects.getEffect('overgrowth') : null;
        const stackCount = overgrowthEffect && typeof overgrowthEffect.getStackCount === 'function'
            ? overgrowthEffect.getStackCount()
            : (overgrowthEffect ? overgrowthEffect.stacks : 0);

        if (stackCount >= triggerStacks && enemy.statusEffects) {
            enemy.statusEffects.removeEffect('overgrowth');
            result.overgrowth = {
                radius: explosionRadius,
                multiplier: explosionMultiplier,
                color: bullet.overgrowthExplosionColor || STATUS_EFFECTS.OVERGROWTH.color
            };
        }
    }

    // 诅咒效果（叠层，受伤时触发）
    if (bullet.curseDuration > 0) {
        const duration = bullet.curseDuration || STATUS_EFFECTS.CURSED.defaultDuration;
        const consumeStacks = bullet.curseConsumeStacks || STATUS_EFFECTS.CURSED.defaultConsumeStacks;
        const damageMultiplier = bullet.curseDamageMultiplier || STATUS_EFFECTS.CURSED.defaultDamageMultiplier;
        enemy.applyStatusEffect('cursed', duration, {
            stacks: 1,
            consumeStacks,
            damageMultiplier,
            intMultiplier
        });
    }

    // 吸血效果
    if (bullet.lifeStealChance > 0 && Math.random() < bullet.lifeStealChance) {
        if (playerStats) {
            playerStats.heal(bullet.lifeStealAmount || 1);
        }
    }

    return Object.keys(result).length ? result : null;
}

