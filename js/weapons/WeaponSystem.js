import Weapon from './Weapon.js';

/**
 * WeaponSystem - 武器系统管理
 * 负责玩家所有武器的更新、目标搜索和自动射击
 */
export default class WeaponSystem {
    constructor() {
        this.weapons = [];
    }

    /**
     * 添加武器
     * @param {Object} definition - 武器定义数据
     */
    addWeapon(definition) {
        // 检查是否已拥有该武器 (可选 logic)
        const weapon = new Weapon(definition);
        this.weapons.push(weapon);
        return weapon;
    }

    /**
     * 更新所有武器冷却
     */
    update() {
        for (const weapon of this.weapons) {
            weapon.update();
        }
    }

    /**
     * 自动搜寻目标并射击
     * @param {Object} playerPos - 玩家当前显示的位置 {x, y}
     * @param {number} playerAttack - 玩家攻击力
     * @param {Array<Enemy>} enemies - 敌人列表
     * @param {BulletPool} bulletPool - 子弹对象池
     * @param {number} scrollY - 当前滚动位置 (如果坐标是世界坐标，则需要)
     */
    autoShoot(playerPos, playerAttack, enemies, bulletPool, scrollY = 0) {
        const playerWorldY = scrollY + playerPos.y;
        const weaponCount = this.weapons.length;

        for (let i = 0; i < weaponCount; i++) {
            const weapon = this.weapons[i];
            if (!weapon.canFire()) continue;

            const target = this.findNearestEnemy(playerPos.x, playerWorldY, enemies);
            if (target) {
                // 计算扩散角度：每个武器基于索引有微小角度偏移
                // spread = (索引 - (武器数-1)/2) * 0.05 弧度（约3度）
                const spread = (i - (weaponCount - 1) / 2) * 0.05;

                const bulletData = weapon.fireWithSpread(
                    playerPos.x,
                    playerWorldY,
                    { x: target.x, y: target.y },
                    playerAttack,
                    spread
                );
                if (bulletData) {
                    bulletPool.spawnBullet(bulletData);
                }
            }
        }
    }

    /**
     * 搜寻最近的活着的敌人
     */
    findNearestEnemy(px, py, enemies) {
        let nearest = null;
        let minDist = Infinity;

        for (const enemy of enemies) {
            if (enemy.hp <= 0) continue;

            const dx = enemy.x - px;
            const dy = enemy.y - py;
            const distSq = dx * dx + dy * dy;

            if (distSq < minDist) {
                minDist = distSq;
                nearest = enemy;
            }
        }

        return nearest;
    }

    /**
     * 移除特定武器
     */
    removeWeapon(weaponId) {
        const index = this.weapons.findIndex(w => w.def.id === weaponId);
        if (index !== -1) {
            this.weapons.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * 获取所有武器实例
     */
    getWeapons() {
        return this.weapons;
    }

    /**
     * 设置武器列表（用于武器融合）
     * @param {Array} weapons - 新的武器数组
     */
    setWeapons(weapons) {
        this.weapons = weapons;
    }

    /**
     * 获取所有进化武器的ID
     * @returns {Array<string>} - 进化武器ID列表
     */
    getEvolutionWeaponIds() {
        return this.weapons
            .filter(w => w.def && w.def.tier === 'evolution')
            .map(w => w.def.id);
    }
}
