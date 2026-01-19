import { log } from '../utils.js';
import { WEAPONS } from '../weapons/WeaponsData.js';

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
        log('敌人掉落了宝箱！', 'important');
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
     * 打开宝箱
     * @param {Object} chest - 宝箱对象
     * @param {Object} player - 玩家对象
     * @param {Function} onComplete - 完成回调 (paused: boolean)
     */
    openChest(chest, player, onComplete) {
        // 生成候选武器列表（排除已拥有的武器）
        const ownedIds = player.weaponSystem.weapons.map(w => w.def.id);
        const availableWeapons = Object.values(WEAPONS)
            .filter(w => !ownedIds.includes(w.id))
            .slice(0, 3);

        if (availableWeapons.length === 0) {
            // 无可选武器，直接移除宝箱
            this.removeChest(chest);
            if (onComplete) onComplete(false);
            return;
        }

        this.chestUI.open(availableWeapons, (selectedWeapon) => {
            if (selectedWeapon) {
                player.weaponSystem.addWeapon(selectedWeapon);
                log(`从宝箱获得武器：${selectedWeapon.name}！`, 'important');
                this.removeChest(chest);
            } else {
                chest.interactionCooldown = 60;
            }
            if (onComplete) onComplete(false);
        });
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
