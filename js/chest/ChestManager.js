import { log } from '../utils.js';
import { WEAPONS, getAvailableFusions } from '../weapons/WeaponsData.js';
import { buildFusionDefinition, getAvailableWeaponFusions } from '../weapons/FusionSystem.js';

/**
 * ChestManager - 宝箱管理器
 * 处理宝箱的生成、掉落、更新和绘制
 */
export default class ChestManager {
    /**
     * @param {Object} chestUI - 宝箱UI实例
     */
    constructor(chestUI) {
        this.chestUI = chestUI;
        this.chests = [];

        // 宝箱掉落系统
        this.pendingChests = 0;      // 待掉落的宝箱数量
        this.lastChestDistance = 0;  // 上次计算宝箱的距离
        this.chestInterval = 100;    // 每100米可掉落一个宝箱
    }

    getGoldMultiplier(distanceMeters, riskSystem) {
        if (!riskSystem || typeof riskSystem.getCurrentZone !== 'function') return 1;
        const zone = riskSystem.getCurrentZone(distanceMeters);
        const name = zone && zone.name;
        const table = {
            '舒适区': 1.0,
            '危险区': 1.1,
            '高危区': 1.25,
            '极限区': 1.4
        };
        return table[name] ?? 1;
    }

    getGoldReward(distanceMeters, riskSystem) {
        const min = 75;
        const max = 100;
        const base = Math.floor(Math.random() * (max - min + 1)) + min;
        const multiplier = this.getGoldMultiplier(distanceMeters, riskSystem);
        return Math.round(base * multiplier);
    }

    /**
     * 更新待掉落宝箱数量（基于距离）
     * @param {number} distance - 当前距离（像素）
     */
    updatePendingChests(distance) {
        const distanceInMeters = distance / 10;  // 10像素 = 1米
        const expectedChests = Math.floor(distanceInMeters / this.chestInterval);
        const newPendingChests = expectedChests - Math.floor(this.lastChestDistance / this.chestInterval);

        if (newPendingChests > 0) {
            this.pendingChests += newPendingChests;
            this.lastChestDistance = distanceInMeters;
        }
    }

    /**
     * 尝试在敌人死亡位置掉落宝箱
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     * @returns {boolean} - 是否成功掉落
     */
    tryDropChest(x, y) {
        if (this.pendingChests > 0) {
            this.spawnChest(x, y);
            this.pendingChests--;
            return true;
        }
        return false;
    }

    /**
     * 在指定位置生成宝箱
     */
    spawnChest(x, y) {
        this.chests.push({
            x,
            y,
            radius: 15,
            color: '#ffd700',
            interactionCooldown: 0
        });
        log('敌人掉落了宝箱！', 'info');
    }

    /**
     * 更新所有宝箱状态
     * @param {Object} player - 玩家对象
     * @param {number} scrollY - 滚动偏移
     * @param {Function} onOpenChest - 打开宝箱时的回调
     */
    update(player, scrollY, onOpenChest) {
        for (let i = this.chests.length - 1; i >= 0; i--) {
            const chest = this.chests[i];

            // 更新交互冷却
            if (chest.interactionCooldown > 0) {
                chest.interactionCooldown--;
            }

            // 移除视野外的宝箱
            if (chest.y + chest.radius < scrollY - 100) {
                this.chests.splice(i, 1);
                continue;
            }

            // 检查玩家与宝箱碰撞
            const chestScreenY = chest.y - scrollY;
            const dx = player.x - chest.x;
            const dy = player.y - chestScreenY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < player.radius + chest.radius && chest.interactionCooldown <= 0) {
                if (onOpenChest) onOpenChest(chest);
            }
        }
    }

    /**
     * 打开宝箱 - 显示可用的武器融合选项
     * @param {Object} chest - 宝箱对象
     * @param {Object} player - 玩家对象
     * @param {Function} onComplete - 完成回调 (paused: boolean)
     */
    openChest(chest, player, options = {}) {
        const resolved = typeof options === 'function' ? { onComplete: options } : options;
        const distanceMeters = resolved && Number.isFinite(resolved.distanceMeters)
            ? resolved.distanceMeters
            : 0;
        const riskSystem = resolved ? resolved.riskSystem : null;
        const onComplete = resolved ? resolved.onComplete : null;

        // 获取可用的融合配方
        const playerWeapons = player.weaponSystem.getWeapons();
        const availableEvolutions = getAvailableFusions(playerWeapons);
        const availableFusions = getAvailableWeaponFusions(playerWeapons);
        const goldReward = this.getGoldReward(distanceMeters, riskSystem);

        // 显示融合选项 + 金币奖励
        this.chestUI.showChestChoices(availableEvolutions, availableFusions, goldReward, (selection) => {
            if (selection && selection.type === 'evolution' && selection.recipe) {
                // 执行进化
                this.executeEvolution(player.weaponSystem, selection.recipe);
            } else if (selection && selection.type === 'fusion' && selection.recipe) {
                // 执行融合
                this.executeFusion(player.weaponSystem, selection.recipe);
            } else {
                const amount = selection && typeof selection.amount === 'number'
                    ? selection.amount
                    : goldReward;
                if (player && player.stats && typeof player.stats.addGold === 'function') {
                    player.stats.addGold(amount);
                    log(`获得金币 +${amount}`, 'important');
                }
            }
            this.removeChest(chest);
            if (onComplete) onComplete(false);
        });
    }

    /**
     * 执行武器融合
     * @param {WeaponSystem} weaponSystem - 武器系统
     * @param {Object} recipe - 融合配方
     */
    executeEvolution(weaponSystem, recipe) {
        // 移除材料武器
        for (const materialId of recipe.materials) {
            weaponSystem.removeWeapon(materialId);
        }

        // 获取结果武器定义
        const resultWeaponKey = Object.keys(WEAPONS).find(
            key => WEAPONS[key].id === recipe.result
        );

        if (resultWeaponKey) {
            // 使用 addWeapon 正确创建 Weapon 实例
            weaponSystem.addWeapon(WEAPONS[resultWeaponKey]);
            log(`武器进化成功！获得了 ${WEAPONS[resultWeaponKey].name}！`, 'important');
        }
    }

    executeFusion(weaponSystem, recipe) {
        if (!recipe || !Array.isArray(recipe.materials) || recipe.materials.length < 2) return false;
        const [materialA, materialB] = recipe.materials;
        if (!materialA || !materialB || materialA === materialB) return false;

        const weapons = weaponSystem.getWeapons();
        const weaponA = weapons.find(w => w.def && w.def.id === materialA);
        const weaponB = weapons.find(w => w.def && w.def.id === materialB);
        if (!weaponA || !weaponB) return false;
        if (weaponA.def.isFusion || weaponB.def.isFusion) return false;

        const fusedDef = buildFusionDefinition(weaponA.def, weaponB.def, recipe);
        if (!fusedDef) return false;

        weaponSystem.removeWeapon(materialA);
        weaponSystem.removeWeapon(materialB);
        weaponSystem.addWeapon(fusedDef);
        log(`融合成功！获得了 ${fusedDef.name}！`, 'important');
        return true;
    }

    /**
     * 移除宝箱
     */
    removeChest(chest) {
        const idx = this.chests.indexOf(chest);
        if (idx >= 0) this.chests.splice(idx, 1);
    }

    /**
     * 绘制所有宝箱
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {number} scrollY - 滚动偏移
     */
    draw(ctx, scrollY) {
        for (const chest of this.chests) {
            const screenY = chest.y - scrollY;

            // 绘制宝箱（金色方块）
            ctx.fillStyle = chest.color;
            ctx.fillRect(chest.x - 12, screenY - 10, 24, 20);

            // 绘制锁扣
            ctx.fillStyle = '#8b4513';
            ctx.fillRect(chest.x - 4, screenY - 5, 8, 10);
        }
    }

    /**
     * 重置
     */
    reset() {
        this.chests = [];
        this.pendingChests = 0;
        this.lastChestDistance = 0;
    }
}
