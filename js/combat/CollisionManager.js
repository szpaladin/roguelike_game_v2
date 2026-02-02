import { circleCollision } from '../utils.js';
import AOEHandler from './AOEHandler.js';
import { applyBulletStatusEffects } from '../enemies/StatusEffects.js';

/**
 * CollisionManager - 碰撞管理器
 * 处理游戏内实体的碰撞检测
 * AOE效果处理已移至 AOEHandler.js
 * 状态效果应用已移至 StatusEffects.js
 */
export default class CollisionManager {
    constructor() {
        // AOE 效果处理器
        this.aoeHandler = new AOEHandler();
        this.effectsManager = null;
        // 玩家引用（用于吸血等效果）
        this.player = null;
        this.terrainEffects = null;
    }

    /**
     * 设置依赖
     * @param {EffectsManager} effectsManager - 特效管理器
     * @param {BulletPool} bulletPool - 子弹池
     * @param {Player} player - 玩家对象
     */
    setDependencies(effectsManager, bulletPool, player, terrainEffects = null) {
        this.aoeHandler.setDependencies(effectsManager, bulletPool);
        this.effectsManager = effectsManager;
        this.player = player;
        this.terrainEffects = terrainEffects;
    }

    /**
     * 检查玩家与所有敌人的碰撞
     * @param {Player} player - 玩家对象
     * @param {Array<Enemy>} enemies - 敌人列表
     * @param {number} scrollY - 滚动偏移
     * @returns {Array<Enemy>} - 与玩家碰撞的敌人列表
     */
    checkPlayerEnemyCollisions(player, enemies, scrollY = 0) {
        const collisions = [];

        for (const enemy of enemies) {
            if (enemy.hp <= 0) continue;

            const enemyScreenY = enemy.y - scrollY;
            if (circleCollision(player.x, player.y, player.radius, enemy.x, enemyScreenY, enemy.radius)) {
                collisions.push(enemy);
            }
        }

        return collisions;
    }

    /**
     * 检查所有子弹与所有敌人的碰撞
     * @param {Array<Bullet>} bullets - 子弹列表
     * @param {Array<Enemy>} enemies - 敌人列表
     * @param {number} playerAttack - 玩家攻击力（力量值）
     * @returns {Array<Object>} - 命中记录 [{bullet, enemy, damage}]
     */
    checkBulletEnemyCollisions(bullets, enemies, playerAttack = 5) {
        const hits = [];
        const playerStats = this.player ? this.player.stats : null;
        const artifactSystem = this.player ? this.player.artifactSystem : null;
        const statusModifiers = artifactSystem && typeof artifactSystem.getStatusModifiers === 'function'
            ? artifactSystem.getStatusModifiers()
            : null;
        const intMultiplier = playerStats ? (playerStats.intelligence + 45) / 50 : 1;
        const baseAttack = Number.isFinite(playerAttack) ? playerAttack : 0;
        const baseEffectiveAttack = baseAttack + 45;
        const globalDamageMultiplier = artifactSystem && typeof artifactSystem.getDamageMultiplier === 'function'
            ? artifactSystem.getDamageMultiplier()
            : 1;

        const resolveChainChance = (baseChance, chainChance) => {
            if (Number.isFinite(chainChance)) return chainChance;
            if (Number.isFinite(baseChance)) return baseChance * 0.1;
            return 0;
        };

        const tryExecute = (target, bulletData, options = {}) => {
            if (!target || target.hp <= 0) return false;
            if (target.isBoss === true) return false;

            const isSecondary = options.isSecondary === true;
            const shatterTriggered = options.shatterTriggered === true;
            const hasShatterExecute = Number.isFinite(bulletData.executeOnShatterChance)
                || Number.isFinite(bulletData.executeOnShatterChainChance);

            if (hasShatterExecute && !shatterTriggered) return false;

            let chance = 0;
            if (hasShatterExecute) {
                chance = isSecondary
                    ? resolveChainChance(bulletData.executeOnShatterChance, bulletData.executeOnShatterChainChance)
                    : bulletData.executeOnShatterChance;
            } else {
                chance = isSecondary
                    ? resolveChainChance(bulletData.executeChance, bulletData.executeChainChance)
                    : bulletData.executeChance;
            }

            if (!Number.isFinite(chance) || chance <= 0) return false;
            if (Math.random() >= chance) return false;

            target.hp = 0;
            if (this.effectsManager) {
                const offsetY = Number.isFinite(target.radius) ? target.radius + 6 : 6;
                this.effectsManager.addFloatingText(target.x, target.y - offsetY, '\u79d2\u6740', {
                    font: '10px Arial',
                    color: '#fff2f2',
                    life: 40,
                    vy: -0.6
                });
            }
            return true;
        };

        const triggerOvergrowthExplosion = (target, statusResult, attackValue) => {
            if (!statusResult || !statusResult.overgrowth) return;
            const { radius, multiplier, color } = statusResult.overgrowth;
            const damage = attackValue * multiplier * intMultiplier;
            this.aoeHandler.handleStatusExplosion(target, enemies, damage, radius, color);
            if (artifactSystem && typeof artifactSystem.onOvergrowthExplosion === 'function') {
                artifactSystem.onOvergrowthExplosion();
            }
        };

        for (const bullet of bullets) {
            if (!bullet.active) continue;

            for (const enemy of enemies) {
                if (enemy.hp <= 0) continue;

                // 检查是否已经击中过该敌人 (防止穿透子弹重复计伤)
                if (bullet.hitEntities && bullet.hitEntities.has(enemy)) continue;

                if (circleCollision(bullet.x, bullet.y, bullet.radius, enemy.x, enemy.y, enemy.radius)) {
                    // 计算伤害
                    const isFullScreenDamage = bullet.fullScreenDamage === true;
                    const isFrozenBeforeHit = !isFullScreenDamage && enemy.statusEffects && enemy.statusEffects.isFrozen();
                    const shatterMultiplier = Number.isFinite(bullet.shatterMultiplier) ? bullet.shatterMultiplier : 1;
                    const shatterTriggered = !isFullScreenDamage && shatterMultiplier > 1 && isFrozenBeforeHit;
                    let actualDamage = 0;

                    if (!isFullScreenDamage) {
                        const hitMultiplier = artifactSystem && typeof artifactSystem.getHitDamageMultiplier === 'function'
                            ? artifactSystem.getHitDamageMultiplier(enemy)
                            : 1;
                        const rawDamage = (bullet.damage || 0) * (shatterTriggered ? shatterMultiplier : 1) * hitMultiplier;
                        actualDamage = enemy.takeDamage(rawDamage);
                        if (shatterTriggered && bullet.shatterConsumesFrozen !== false && enemy.statusEffects) {
                            enemy.statusEffects.removeEffect('frozen');
                        }
                    }

                    // 应用状态效果（传入玩家属性用于智力倍率计算）
                    const suppressFreeze = shatterTriggered && bullet.shatterPreventRefreeze !== false;
                    const attackMultiplier = bullet.damageMultiplier ?? globalDamageMultiplier;
                    const attackValue = baseEffectiveAttack * attackMultiplier;
                    const statusResult = applyBulletStatusEffects(bullet, enemy, playerStats, {
                        suppressFreeze,
                        modifiers: statusModifiers
                    });
                    triggerOvergrowthExplosion(enemy, statusResult, attackValue);
                    tryExecute(enemy, bullet, { shatterTriggered });

                    // 应用攻击范围效果
                    const applyStatuses = (target) => {
                        const targetFrozenBefore = target.statusEffects && target.statusEffects.isFrozen();
                        const result = applyBulletStatusEffects(bullet, target, playerStats, { modifiers: statusModifiers });
                        triggerOvergrowthExplosion(target, result, attackValue);
                        const secondaryShatter = shatterMultiplier > 1 && targetFrozenBefore;
                        tryExecute(target, bullet, { isSecondary: true, shatterTriggered: secondaryShatter });
                    };
                    this.aoeHandler.handleRangeEffects(bullet, enemy, enemies, attackValue, applyStatuses);

                    if (!isFullScreenDamage && artifactSystem && typeof artifactSystem.applyOnHitEffects === 'function') {
                        artifactSystem.applyOnHitEffects(bullet, enemy, enemies, attackValue, this.aoeHandler);
                    }

                    hits.push({ bullet, enemy, damage: actualDamage });

                    if (bullet.terrainOnHit && bullet.terrainOnHit.type === 'ridge' && this.terrainEffects) {
                        this.terrainEffects.addRidge(enemy.x, enemy.y, bullet.terrainOnHit);
                    }

                    // 穿透处理
                    if (bullet.piercing) {
                        if (!bullet.hitEntities) bullet.hitEntities = new Set();
                        bullet.hitEntities.add(enemy);
                    } else {
                        bullet.active = false;
                        break;
                    }
                }
            }
        }

        return hits;
    }
}
