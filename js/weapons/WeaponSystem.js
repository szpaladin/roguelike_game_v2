import Weapon from './Weapon.js';
import { WEAPON_TIER } from './WeaponsData.js';

/**
 * WeaponSystem - 姝﹀櫒绯荤粺绠＄悊
 * 璐熻矗鐜╁鎵€鏈夋鍣ㄧ殑鏇存柊銆佺洰鏍囨悳绱㈠拰鑷姩灏勫嚮
 */
export default class WeaponSystem {
    constructor() {
        this.weapons = [];
    }

    /**
     * 娣诲姞姝﹀櫒
     * @param {Object} definition - 姝﹀櫒瀹氫箟鏁版嵁
     */
    addWeapon(definition) {
        if (!definition) return null;

        if (definition.id !== 'basic' && this.weapons.some(w => w.def && w.def.id === 'basic')) {
            this.weapons = this.weapons.filter(w => w.def && w.def.id !== 'basic');
        }

        // 妫€鏌ユ槸鍚﹀凡鎷ユ湁璇ユ鍣?(鍙€?logic)
        const weapon = new Weapon(definition);
        this.weapons.push(weapon);
        return weapon;
    }

    /**
     * 鏇存柊鎵€鏈夋鍣ㄥ喎鍗?
     */
    update() {
        for (const weapon of this.weapons) {
            weapon.update();
        }
    }


    createSkyDropBullet(weapon, target, playerAttack, scrollY) {
        if (!weapon || !weapon.def || !weapon.canFire()) return null;

        const def = weapon.def;
        const offsetX = Number.isFinite(def.dropOffsetX) ? def.dropOffsetX : 0;
        const offsetY = Number.isFinite(def.dropOffsetY) ? def.dropOffsetY : 60;
        const dropSpeed = Number.isFinite(def.dropSpeed) ? def.dropSpeed : def.speed;
        const dropLifetime = Number.isFinite(def.dropLifetime) ? def.dropLifetime : def.lifetime;
        const dropRadius = Number.isFinite(def.dropRadius) ? def.dropRadius : def.radius;
        const randOffset = offsetX !== 0 ? (Math.random() * 2 - 1) * offsetX : 0;

        // 重置冷却
        weapon.cooldown = def.interval;

        // 计算最终伤害
        const finalDamage = def.damage * (playerAttack / 10);

        return {
            x: target.x + randOffset,
            y: scrollY - offsetY,
            vx: 0,
            vy: dropSpeed,
            ...def,
            speed: dropSpeed,
            radius: dropRadius,
            lifetime: dropLifetime,
            damage: finalDamage,
            active: true
        };
    }    /**
     * 鑷姩鎼滃鐩爣骞跺皠鍑?
     * @param {Object} playerPos - 鐜╁褰撳墠鏄剧ず鐨勪綅缃?{x, y}
     * @param {number} playerAttack - 鐜╁鏀诲嚮鍔?
     * @param {Array<Enemy>} enemies - 鏁屼汉鍒楄〃
     * @param {BulletPool} bulletPool - 瀛愬脊瀵硅薄姹?
     * @param {number} scrollY - 褰撳墠婊氬姩浣嶇疆 (濡傛灉鍧愭爣鏄笘鐣屽潗鏍囷紝鍒欓渶瑕?
     */
    autoShoot(playerPos, playerAttack, enemies, bulletPool, scrollY = 0) {
        const playerWorldY = scrollY + playerPos.y;
        const weaponCount = this.weapons.length;

        for (let i = 0; i < weaponCount; i++) {
            const weapon = this.weapons[i];
            if (!weapon.canFire()) continue;

            const target = this.findNearestEnemy(playerPos.x, playerWorldY, enemies);
            if (target) {
                // 璁＄畻鎵╂暎瑙掑害锛氭瘡涓鍣ㄥ熀浜庣储寮曟湁寰皬瑙掑害鍋忕Щ
                // spread = (绱㈠紩 - (姝﹀櫒鏁?1)/2) * 0.05 寮у害锛堢害3搴︼級
                const spread = (i - (weaponCount - 1) / 2) * 0.05;

                let bulletData = null;
                if (weapon.def && weapon.def.spawnMode === 'sky_drop') {
                    bulletData = this.createSkyDropBullet(weapon, target, playerAttack, scrollY);
                } else {
                    bulletData = weapon.fireWithSpread(
                        playerPos.x,
                        playerWorldY,
                        { x: target.x, y: target.y },
                        playerAttack,
                        spread
                    );
                }
                if (bulletData) {
                    bulletPool.spawnBullet(bulletData);
                }
            }
        }
    }

    /**
     * 鎼滃鏈€杩戠殑娲荤潃鐨勬晫浜?
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
     * 绉婚櫎鐗瑰畾姝﹀櫒
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
     * 鑾峰彇鎵€鏈夋鍣ㄥ疄渚?
     */
    getWeapons() {
        return this.weapons;
    }

    /**
     * 璁剧疆姝﹀櫒鍒楄〃锛堢敤浜庢鍣ㄨ瀺鍚堬級
     * @param {Array} weapons - 鏂扮殑姝﹀櫒鏁扮粍
     */
    setWeapons(weapons) {
        this.weapons = weapons;
    }

    /**
     * 鑾峰彇鎵€鏈夎繘鍖栨鍣ㄧ殑ID
     * @returns {Array<string>} - 杩涘寲姝﹀櫒ID鍒楄〃
     */
    getEvolutionWeaponIds() {
        return this.weapons
            .filter(w => w.def && w.def.tier === WEAPON_TIER.EVOLUTION)
            .map(w => w.def.id);
    }
}


