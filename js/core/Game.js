import { GAME_CONFIG, TILE, ENTITY } from '../config.js';
import { log } from '../utils.js';
import MapManager from './MapManager.js';
import Player from './Player.js';
import OxygenSystem from './OxygenSystem.js';
import LightingSystem from './LightingSystem.js';
import RiskSystem from './RiskSystem.js';
import EvacuationManager from './EvacuationManager.js';
import MetaProgress from './MetaProgress.js';
import EnemySpawner from '../enemies/EnemySpawner.js';
import Enemy from '../enemies/Enemy.js';
import { getRandomEnemyType } from '../enemies/EnemiesData.js';
import BulletPool from '../combat/BulletPool.js';
import CollisionManager from '../combat/CollisionManager.js';
import EffectsManager from '../effects/EffectsManager.js';
import StatusVFXManager from '../effects/StatusVFXManager.js';
import ChestManager from '../chest/ChestManager.js';
import HUD from '../ui/HUD.js';
import DebugOverlay from '../ui/DebugOverlay.js';
import UpgradeUI from '../ui/UpgradeUI.js';
import ChestUI from '../ui/ChestUI.js';
import GameOverUI from '../ui/GameOverUI.js';
import EvacuationResultUI from '../ui/EvacuationResultUI.js';

/**
 * Game - 娓告垙涓绘帶绫?
 * 鏁村悎鎵€鏈夊瓙绯荤粺骞堕┍鍔ㄦ父鎴忚繍琛?
 */
export default class Game {
    /**
     * @param {CanvasRenderingContext2D} ctx - 缁樺浘涓婁笅鏂?
     * @param {number} width - 鐢诲竷瀹藉害
     * @param {number} height - 鐢诲竷楂樺害
     */
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;

        // 鐘舵€?
        this.paused = false;
        this.gameOver = false;
        this.gameTime = 0;
        this.distance = 0;
        this.scrollY = 0;
        this.keys = {};

        // 姘ф皵绯荤粺锛堟瘡4绉掓墸1鐐笻P锛?
        this.oxygenSystem = new OxygenSystem(4, 1);

        // 鍏夌収绯荤粺
        this.lightingSystem = new LightingSystem();

        // 椋庨櫓绯荤粺
        this.riskSystem = new RiskSystem();

        // 鎾ょ绯荤粺
        this.evacuationManager = new EvacuationManager();
        this.metaProgress = new MetaProgress();
        this.evacuationResultUI = new EvacuationResultUI();

        // 鍒濆鍖栧瓙绯荤粺
        this.mapManager = new MapManager();
        this.player = new Player(this.width / 2, this.height * 0.3);
        this.enemySpawner = new EnemySpawner();
        this.bulletPool = new BulletPool();
        this.collisionManager = new CollisionManager();
        this.effectsManager = new EffectsManager();
        this.statusVFXManager = new StatusVFXManager();

        // UI 绯荤粺
        this.hud = new HUD();
        this.upgradeUI = new UpgradeUI();
        this.chestUI = new ChestUI();
        this.gameOverUI = new GameOverUI();
        this.debugOverlay = new DebugOverlay();

        this.enemies = [];

        // 瀹濈绯荤粺
        this.chestManager = new ChestManager(this.chestUI);

        // 鍒濆璁剧疆
        this.init();
    }

    init() {
        this.mapManager.initMap();
        this.upgradeUI.init(this.player);

        // 娉ㄥ唽鍗囩骇鑿滃崟鍏抽棴鍥炶皟
        this.upgradeUI.onClose(() => {
            this.paused = false;
        });

        // 娉ㄥ唽鎾ょ鍙敜鍥炶皟
        this.upgradeUI.setEvacuationCallback(() => {
            this.evacuationManager.requestEvacuation(
                this.scrollY,
                this.height
            );
        });

        // 璁剧疆纰版挒绠＄悊鍣ㄧ殑渚濊禆椤癸紙鐢ㄤ簬鏀诲嚮鑼冨洿鏁堟灉锛?
        this.collisionManager.setDependencies(this.effectsManager, this.bulletPool, this.player);

        // 璁剧疆鎾ょ瀹屾垚鍥炶皟
        this.evacuationManager.setEvacuationCallback(() => this.handleEvacuation());

        // 璁剧疆鍥存敾瑙﹀彂鍥炶皟
        this.evacuationManager.setSiegeCallback(() => this.spawnSiegeEnemies());

        // 璁剧疆缁撶畻鐣岄潰鍥炶皟
        this.evacuationResultUI.onContinue(() => location.reload());
    }

    /**
     * 鏇存柊閫昏緫
     * @param {number} dt - 甯ч棿闅?(绉?
     */
    update(dt) {
        this.debugOverlay.update(dt);
        if (this.paused || this.gameOver) return;

        this.gameTime++;
        // distance 灏辨槸鍍忕礌鍗曚綅鐨勬粴鍔ㄨ窛绂?
        this.distance += GAME_CONFIG.AUTO_SCROLL_SPEED * (dt * 60);
        this.scrollY = this.distance;

        // 1. 鍦板浘鏇存柊
        this.mapManager.update(this.scrollY, this.height);

        // 1.5 椋庨櫓绯荤粺鏇存柊锛堝奖鍝嶆晫浜虹敓鎴愰鐜囷級
        const distanceInMeters = Math.floor(this.distance / 10);
        const spawnMultiplier = this.riskSystem.getSpawnIntervalMultiplier(distanceInMeters);
        this.enemySpawner.setSpawnIntervalMultiplier(spawnMultiplier);

        // 1.6 妫€娴嬫繁搴﹀尯鍩熷彉鍖?
        const newZone = this.riskSystem.checkZoneChange(distanceInMeters);
        if (newZone) {
            log('深度增加，光线变暗，危险更多，氧气消耗也加快了。', 'important');
        }

        // 2. 鐢熸垚鏁屼汉锛堜紶鍏ョ帺瀹朵笘鐣屽潗鏍囷級
        const playerWorldPos = { x: this.player.x, y: this.player.y + this.scrollY };
        const newEnemy = this.enemySpawner.spawn(this.distance, playerWorldPos);
        if (newEnemy) {
            this.enemies.push(newEnemy);
        }

        // 3. 鐜╁鏇存柊
        this.player.update(this.keys, dt, this.scrollY);

        // 3.5 姘ф皵娑堣€楋紙浠?RiskSystem 鑾峰彇闂撮殧锛?
        const oxygenInterval = this.riskSystem.getOxygenInterval(distanceInMeters);
        this.oxygenSystem.setInterval(oxygenInterval);
        this.oxygenSystem.update(dt, this.player.stats);

        // 3.6 鍏夌収鏇存柊锛堜粠 RiskSystem 鑾峰彇閫忔槑搴︼級
        const lightingAlpha = this.riskSystem.getLightingAlpha(distanceInMeters);
        this.lightingSystem.setTargetAlpha(lightingAlpha);
        this.lightingSystem.update(dt);

        // 4. 鑷姩鏀诲嚮 (瀛愬脊鐢熸垚)
        this.player.weaponSystem.autoShoot(
            { x: this.player.x, y: this.player.y },
            this.player.stats.strength,
            this.enemies,
            this.bulletPool,
            this.scrollY
        );

        // 5. 鏁屼汉鍜屽瓙寮圭墿鐞嗘洿鏂?
        this.bulletPool.update();
        this.effectsManager.update();

        // 6. 鏇存柊寰呮帀钀藉疂绠辨暟閲?
        this.chestManager.updatePendingChests(this.distance);

        // 6.5 鎾ょ绯荤粺鏇存柊
        this.evacuationManager.updateSpawning(this.distance);
        // 鏇存柊鍥存敾閰嶇疆锛堟牴鎹綋鍓嶆繁搴︼級
        const siegeConfig = this.riskSystem.getSiegeConfig(distanceInMeters);
        this.evacuationManager.setSiegeConfig(siegeConfig);
        this.evacuationManager.update(this.player, this.scrollY, dt);

        // 7. 鏇存柊鏁屼汉浣嶇疆鍜岀姸鎬?
        const playerPos = { x: this.player.x, y: this.player.y };
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update(playerPos, this.scrollY, this.height);
            if (enemy.hp <= 0 && !enemy.isDead) {
                // 澶勭悊鏁屼汉姝讳骸 (缁忛獙銆侀噾甯佺瓑)
                this.player.stats.gainExp(enemy.exp || 1);
                this.player.stats.addGold(enemy.gold || 1);
                enemy.isDead = true;

                // 灏濊瘯鎺夎惤瀹濈
                this.chestManager.tryDropChest(enemy.x, enemy.y);
            }
            // 绉婚櫎瑙嗛噹澶栫殑鏁屼汉
            if (enemy.y + enemy.radius < this.scrollY - 100) {
                this.enemies.splice(i, 1);
            }
        }

        // 8. 纰版挒妫€娴?
        const playerCollisions = this.collisionManager.checkPlayerEnemyCollisions(this.player, this.enemies, this.scrollY);

        // 澶勭悊鐜╁涓庢晫浜虹鎾烇紙鐜╁鍙椾激锛?
        for (const enemy of playerCollisions) {
            if (!enemy.blinded) {
                const damage = this.player.takeDamage(enemy.attack);
                if (damage > 0) {
                    log(`${enemy.name} 瀵逛綘閫犳垚浜?${damage} 鐐逛激瀹筹紒`, 'damage');
                }
            }
        }

        this.collisionManager.checkBulletEnemyCollisions(this.bulletPool.getActiveBullets(), this.enemies, this.player.stats.strength);

        this.statusVFXManager.update(this.enemies);

        // 9. 妫€鏌ユ父鎴忕粨鏉?
        if (!this.player.stats.isAlive()) {
            this.handleGameOver();
        }

        // 10. 鏇存柊瀹濈
        this.chestManager.update(this.player, this.scrollY, (chest) => {
            this.paused = true;
            this.chestManager.openChest(chest, this.player, () => {
                this.paused = false;
            });
        });

        // 11. 鏇存柊 HUD
        this.hud.update(this.player, this.distance);
    }

    /**
     * 缁樺埗
     */
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // 缁樺埗鍦板浘
        this.mapManager.draw(this.ctx, this.scrollY, this.width, this.height);

        // 缁樺埗鏁屼汉
        this.enemies.forEach(enemy => {
            enemy.draw(this.ctx, this.scrollY);
        });

        this.statusVFXManager.draw(this.ctx, this.scrollY);

        // 缁樺埗瀹濈
        this.chestManager.draw(this.ctx, this.scrollY);

        // 缁樺埗瀛愬脊
        this.bulletPool.draw(this.ctx, this.scrollY);

        // 缁樺埗瑙嗚鐗规晥
        this.effectsManager.draw(this.ctx, this.scrollY);

        // 缁樺埗鎾ょ鐐?
        this.evacuationManager.draw(this.ctx, this.scrollY);

        // 缁樺埗鐜╁
        this.player.draw(this.ctx);

        // 缁樺埗鍏夌収閬僵锛堟渶鍚庣粯鍒讹級
        this.lightingSystem.draw(this.ctx, this.width, this.height);

        this.debugOverlay.draw(this.ctx, this);
    }

    togglePause() {
        this.paused = !this.paused;
    }

    handleGameOver() {
        this.gameOver = true;
        // 姝讳骸缁撶畻锛堟儵缃氭瘮渚嬫牴鎹繁搴﹀姩鎬佸彉鍖栵級
        const distanceInMeters = Math.floor(this.distance / 10);
        const deathPenalty = this.riskSystem.getDeathPenalty(distanceInMeters);
        const goldRetentionPercent = Math.round(this.riskSystem.getGoldRetention(distanceInMeters) * 100);
        const result = this.metaProgress.processDeath({
            gold: this.player.stats.gold,
            distance: distanceInMeters,
            weapons: this.player.weaponSystem.getEvolutionWeaponIds()
        }, deathPenalty);
        this.evacuationResultUI.showDeath(result, goldRetentionPercent);
    }

    handleEvacuation() {
        this.gameOver = true;
        // 鎾ょ鎴愬姛缁撶畻锛?00%鏀剁泭锛?
        const result = this.metaProgress.processEvacuation({
            gold: this.player.stats.gold,
            distance: Math.floor(this.distance / 10),
            weapons: this.player.weaponSystem.getEvolutionWeaponIds()
        });
        this.evacuationResultUI.showSuccess(result);
        log('撤离成功！', 'important');
    }

    handleInput(e, isDown) {
        const key = e.key.toLowerCase();
        this.keys[key] = isDown;

        if (isDown) {
            if (key === '`' || key === '~') {
                const enabled = this.debugOverlay.toggle();
                log(`调试模式已${enabled ? '开启' : '关闭'}`);
            }
            if (key === 'e') {
                // 鎵撳紑/鍏抽棴鍗囩骇鑿滃崟
                if (this.upgradeUI.isOpen()) {
                    this.upgradeUI.close();
                    this.paused = false;
                } else if (this.player.stats.skillPoints > 0) {
                    this.upgradeUI.open();
                    this.paused = true;
                }
            }
            if (key === 'escape') {
                this.upgradeUI.close();
                this.chestUI.close();
                this.paused = false;
            }
        }
    }

    /**
     * 鐢熸垚鍥存敾鏁屼汉锛堣繘鍏ユ挙绂诲尯鏃惰Е鍙戯級
     * 浣嶇疆璁＄畻鐢?EvacuationManager 澶勭悊
     */
    spawnSiegeEnemies() {
        const positions = this.evacuationManager.generateSiegeEnemyPositions();

        for (const pos of positions) {
            const type = getRandomEnemyType(this.distance);
            const enemy = new Enemy(pos.x, pos.y, type);
            this.enemies.push(enemy);
        }
    }
}

