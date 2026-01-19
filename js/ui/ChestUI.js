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
        if (!this.fusionOverlay || !this.fusionContainer) return;
        this.onSelectFusion = callback;

        this.fusionContainer.innerHTML = '';
        recipes.forEach(recipe => {
            const card = this.createFusionCard(recipe);
            card.onclick = () => {
                if (this.onSelectFusion) this.onSelectFusion(recipe);
                this.closeFusions();
            };
            this.fusionContainer.appendChild(card);
        });

        this.fusionOverlay.style.display = 'flex';
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
        // 这里简化实现，实际逻辑会包含材料图标等
        div.innerHTML = `
      <div class="fusion-result-name">${recipe.message || '进化'}</div>
      <div class="fusion-description">${recipe.description || ''}</div>
    `;
        return div;
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
