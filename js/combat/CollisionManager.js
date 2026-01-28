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
        // 玩家引用（用于吸血等效果）
        this.player = null;
    }

    /**
     * 设置依赖
     * @param {EffectsManager} effectsManager - 特效管理器
     * @param {BulletPool} bulletPool - 子弹池
     * @param {Player} player - 玩家对象
     */
    setDependencies(effectsManager, bulletPool, player) {
        this.aoeHandler.setDependencies(effectsManager, bulletPool);
        this.player = player;
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
        const intMultiplier = playerStats ? playerStats.intelligence / 50 : 1;

        const triggerOvergrowthExplosion = (target, statusResult) => {
            if (!statusResult || !statusResult.overgrowth) return;
            const { radius, multiplier, color } = statusResult.overgrowth;
            const damage = playerAttack * multiplier * intMultiplier;
            this.aoeHandler.handleStatusExplosion(target, enemies, damage, radius, color);
        };

        for (const bullet of bullets) {
            if (!bullet.active) continue;

            for (const enemy of enemies) {
                if (enemy.hp <= 0) continue;

                // 检查是否已经击中过该敌人 (防止穿透子弹重复计伤)
                if (bullet.hitEntities && bullet.hitEntities.has(enemy)) continue;

                if (circleCollision(bullet.x, bullet.y, bullet.radius, enemy.x, enemy.y, enemy.radius)) {
                    // 计算伤害
                    const isFrozenBeforeHit = enemy.statusEffects && enemy.statusEffects.isFrozen();
                    const shatterMultiplier = Number.isFinite(bullet.shatterMultiplier) ? bullet.shatterMultiplier : 1;
                    const shatterTriggered = shatterMultiplier > 1 && isFrozenBeforeHit;
                    const rawDamage = (bullet.damage || 0) * (shatterTriggered ? shatterMultiplier : 1);
                    const actualDamage = enemy.takeDamage(rawDamage);

                    if (shatterTriggered && bullet.shatterConsumesFrozen !== false && enemy.statusEffects) {
                        enemy.statusEffects.removeEffect('frozen');
                    }

                    // 应用状态效果（传入玩家属性用于智力倍率计算）
                    const suppressFreeze = shatterTriggered && bullet.shatterPreventRefreeze !== false;
                    const statusResult = applyBulletStatusEffects(bullet, enemy, playerStats, { suppressFreeze });
                    triggerOvergrowthExplosion(enemy, statusResult);

                    // 应用攻击范围效果
                    const applyStatuses = (target) => {
                        const result = applyBulletStatusEffects(bullet, target, playerStats);
                        triggerOvergrowthExplosion(target, result);
                    };
                    this.aoeHandler.handleRangeEffects(bullet, enemy, enemies, playerAttack, applyStatuses);

                    hits.push({ bullet, enemy, damage: actualDamage });

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
