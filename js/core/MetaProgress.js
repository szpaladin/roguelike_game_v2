/**
 * MetaProgress - 永久进度管理器
 * 管理跨局数据，如累计金币、最远距离、已解锁武器等
 * 使用 localStorage 持久化存储
 */
export default class MetaProgress {
    constructor() {
        this.storageKey = 'roguelike_meta_progress';
        this.data = this.load();
    }

    /**
     * 从 localStorage 加载数据
     * @returns {Object} - 永久进度数据
     */
    load() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Failed to load meta progress:', e);
        }
        return this.getDefaultData();
    }

    /**
     * 获取默认数据结构
     * @returns {Object}
     */
    getDefaultData() {
        return {
            totalGold: 0,
            highestDistance: 0,
            totalRuns: 0,
            successfulEvacuations: 0,
            unlockedWeapons: []
        };
    }

    /**
     * 保存数据到 localStorage
     */
    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        } catch (e) {
            console.warn('Failed to save meta progress:', e);
        }
    }

    /**
     * 处理撤离成功
     * @param {Object} runData - 本局数据 { gold, distance, weapons }
     */
    processEvacuation(runData) {
        // 100% 金币保留
        this.data.totalGold += runData.gold || 0;
        
        // 更新最远距离记录
        if (runData.distance > this.data.highestDistance) {
            this.data.highestDistance = runData.distance;
        }

        // 解锁进化武器
        if (runData.weapons && runData.weapons.length > 0) {
            for (const weapon of runData.weapons) {
                if (!this.data.unlockedWeapons.includes(weapon)) {
                    this.data.unlockedWeapons.push(weapon);
                }
            }
        }

        this.data.totalRuns++;
        this.data.successfulEvacuations++;
        this.save();

        return {
            goldEarned: runData.gold || 0,
            distanceBonus: Math.floor((runData.distance || 0) / 100),
            newWeapons: runData.weapons || [],
            penaltyApplied: false
        };
    }

    /**
     * 处理死亡（撤离失败）
     * @param {Object} runData - 本局数据 { gold, distance, weapons }
     * @param {number} penalty - 惩罚比例 (0-1)
     */
    processDeath(runData, penalty = 0.5) {
        // 损失部分金币
        const goldEarned = Math.floor((runData.gold || 0) * (1 - penalty));
        this.data.totalGold += goldEarned;

        // 距离记录仍然更新
        if (runData.distance > this.data.highestDistance) {
            this.data.highestDistance = runData.distance;
        }

        // 死亡时不解锁武器
        this.data.totalRuns++;
        this.save();

        return {
            goldEarned,
            goldLost: (runData.gold || 0) - goldEarned,
            distanceBonus: Math.floor((runData.distance || 0) / 200), // 距离奖励也减半
            newWeapons: [],
            penaltyApplied: true
        };
    }

    /**
     * 获取当前进度快照
     * @returns {Object}
     */
    getProgress() {
        return { ...this.data };
    }

    /**
     * 重置所有进度（调试用）
     */
    reset() {
        this.data = this.getDefaultData();
        this.save();
    }
}
