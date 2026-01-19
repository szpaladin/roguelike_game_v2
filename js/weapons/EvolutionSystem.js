import { getAvailableFusions, performFusion, WEAPON_FUSION_TABLE } from './WeaponsData.js';

/**
 * EvolutionSystem - 武器进化系统
 * 负责管理武器的进化逻辑
 */
export default class EvolutionSystem {
    /**
     * 获取当前可用的进化配方
     * @param {Array} playerWeapons - 玩家当前的武器列表
     * @returns {Array} - 可用的配方列表
     */
    getAvailableEvolutions(playerWeapons) {
        return getAvailableFusions(playerWeapons);
    }

    /**
     * 执行进化
     * @param {Array} playerWeapons - 玩家当前的武器列表
     * @param {string} resultId - 目标武器 ID
     * @returns {Object} - 合成结果 {success, message, newWeapon}
     */
    evolveWeapon(playerWeapons, resultId) {
        const recipe = WEAPON_FUSION_TABLE.find(r => r.result === resultId);
        if (!recipe) {
            return { success: false, message: '配方不存在' };
        }

        return performFusion(playerWeapons, recipe);
    }
}
