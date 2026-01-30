import { WEAPON_ICON_MAP, WEAPONS } from '../weapons/WeaponsData.js';
/**
 * ChestUI - 宝箱界面
 * 负责宝箱奖励（新武器）和武器进化的显示与逻辑
 */
export default class ChestUI {
    constructor() {
        this.menu = document.getElementById('chest-menu');
        this.optionsContainer = document.getElementById('chest-options');
        this.fusionOverlay = document.getElementById('fusion-overlay');
        this.fusionContainer = document.getElementById('fusion-options');

        this.onSelectWeapon = null;
        this.onSelectFusion = null;
        this.onSelectReward = null;
        this.defaultReward = null;
    }

    /**
     * 打开宝箱奖励界面
     * @param {Array} weapons - 候选武器列表
     * @param {Function} callback - 选择后的回调
     */
    open(weapons, callback) {
        if (!this.menu || !this.optionsContainer) return;
        this.onSelectWeapon = callback;

        this.optionsContainer.innerHTML = '';
        weapons.forEach(weapon => {
            const card = this.createWeaponCard(weapon);
            card.onclick = () => {
                if (this.onSelectWeapon) this.onSelectWeapon(weapon);
                this.close();
            };
            this.optionsContainer.appendChild(card);
        });

        this.menu.style.display = 'block';
    }

    /**
     * 显示进化选项
     * @param {Array} recipes - 可用的进化配方
     * @param {Function} callback - 选择后的回调
     */
    showFusions(recipes, callback) {
        this.showChestChoices(recipes, [], 0, (selection) => {
            if (!callback) return;
            if (selection && selection.type === 'evolution') {
                callback(selection.recipe);
            } else {
                callback(null);
            }
        });
    }

    showChestChoices(evolutions = [], fusions = [], goldAmount, callback) {
        if (!this.fusionOverlay || !this.fusionContainer) return;
        this.onSelectReward = callback;
        this.defaultReward = { type: 'gold', amount: goldAmount };

        this.fusionContainer.innerHTML = '';
        evolutions.forEach(recipe => {
            const card = this.createFusionCard(recipe);
            card.dataset.rewardType = 'evolution';
            card.onclick = () => this.commitSelection({ type: 'evolution', recipe });
            this.fusionContainer.appendChild(card);
        });

        fusions.forEach(recipe => {
            const card = this.createFusionOptionCard(recipe);
            card.dataset.rewardType = 'fusion';
            card.onclick = () => this.commitSelection({ type: 'fusion', recipe });
            this.fusionContainer.appendChild(card);
        });

        const goldCard = this.createGoldCard(goldAmount);
        goldCard.dataset.rewardType = 'gold';
        goldCard.onclick = () => this.commitSelection({ type: 'gold', amount: goldAmount });
        this.fusionContainer.appendChild(goldCard);

        this.fusionOverlay.style.display = 'flex';
    }

    commitSelection(selection) {
        if (this.onSelectReward) {
            this.onSelectReward(selection);
        }
        this.onSelectReward = null;
        this.defaultReward = null;
        this.closeFusions();
    }

    selectDefaultReward() {
        if (!this.onSelectReward || !this.defaultReward) return false;
        this.commitSelection(this.defaultReward);
        return true;
    }

    createWeaponCard(weapon) {
        const div = document.createElement('div');
        div.className = 'weapon-card';
        div.innerHTML = `
      <div class="weapon-name" style="color: ${weapon.color}">${weapon.name}</div>
      <div class="weapon-desc">${weapon.description || ''}</div>
    `;
        return div;
    }

    createFusionCard(recipe) {
        const div = document.createElement('div');
        div.className = 'fusion-card';

        // 获取材料图标
        const materialIcons = recipe.materials.map(id => this.getWeaponIcon(id)).join(' + ');

        div.innerHTML = `
            <div class="fusion-icon">${recipe.icon || '⚗️'}</div>
            <div class="fusion-result-name">${recipe.name}</div>
            <div class="fusion-materials">${materialIcons}</div>
            <div class="fusion-description">${recipe.description || ''}</div>
        `;
        return div;
    }

    createFusionOptionCard(recipe) {
        const div = document.createElement('div');
        div.className = 'fusion-card fusion-combo-card';
        const materials = Array.isArray(recipe.materials) ? recipe.materials : [];
        const materialIcons = materials.map(id => this.getWeaponIcon(id)).join(' + ');
        const materialNames = materials.map(id => this.getWeaponName(id)).join(' × ');

        div.innerHTML = `
            <div class="fusion-icon">🔗</div>
            <div class="fusion-materials">${materialIcons}</div>
            <div class="fusion-result-name">${materialNames || '融合形态'}</div>
        `;
        return div;
    }

    createGoldCard(amount) {
        const div = document.createElement('div');
        div.className = 'fusion-card fusion-gold-card';
        div.innerHTML = `
            <div class="fusion-icon">🪙</div>
            <div class="fusion-result-name">金币奖励</div>
            <div class="fusion-description">获得 +${amount} 金币</div>
        `;
        return div;
    }

    /**
     * 获取武器图标
     */
    getWeaponIcon(weaponId) {
        return WEAPON_ICON_MAP[weaponId] || '??';
    }

    getWeaponName(weaponId) {
        const key = Object.keys(WEAPONS).find(k => WEAPONS[k].id === weaponId);
        return key ? WEAPONS[key].name : weaponId;
    }

    close() {
        if (this.menu) this.menu.style.display = 'none';
    }

    closeFusions() {
        if (this.fusionOverlay) this.fusionOverlay.style.display = 'none';
    }

    isOpen() {
        return (this.menu && this.menu.style.display === 'block') ||
            (this.fusionOverlay && this.fusionOverlay.style.display === 'flex');
    }
}
