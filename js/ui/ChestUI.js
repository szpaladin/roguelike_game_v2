import { WEAPON_ICON_MAP, WEAPONS, WEAPON_ID_MAP } from '../weapons/WeaponsData.js';

const ORDER_MAP = {};
Object.values(WEAPON_ID_MAP || {}).forEach((info) => {
    if (info && info.id) ORDER_MAP[info.id] = info.order ?? 9999;
});

function sortWeaponIds(ids) {
    return ids
        .filter(Boolean)
        .slice()
        .sort((a, b) => {
            const orderA = ORDER_MAP[a] ?? 9999;
            const orderB = ORDER_MAP[b] ?? 9999;
            if (orderA !== orderB) return orderA - orderB;
            return a.localeCompare(b);
        });
}

export default class ChestUI {
    constructor() {
        this.menu = document.getElementById('chest-menu');
        this.optionsContainer = document.getElementById('chest-options');
        this.overlay = document.getElementById('fusion-overlay');
        this.overlayTitle = document.getElementById('fusion-title');
        this.backBtn = document.getElementById('fusion-back-btn');
        this.overlayOptions = document.getElementById('fusion-options');
        this.confirmBtn = document.getElementById('fusion-confirm-btn');

        this.onSelectWeapon = null;
        this.onSelectReward = null;
        this.defaultReward = null;
        this.evolutionRecipes = [];
        this.fusionWeapons = [];
        this.selectedFusionIds = new Set();

        if (this.backBtn) {
            this.backBtn.onclick = () => this.showMenu();
        }
        if (this.confirmBtn) {
            this.confirmBtn.onclick = () => this.confirmFusion();
        }
    }

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
        this.menu.style.display = 'flex';
    }

    showChestMenu(evolutions = [], fusionWeapons = [], goldAmount = 0, callback) {
        if (!this.menu || !this.optionsContainer) return;
        this.onSelectReward = callback;
        this.defaultReward = { type: 'gold', amount: goldAmount };
        this.evolutionRecipes = Array.isArray(evolutions) ? evolutions : [];
        this.fusionWeapons = Array.isArray(fusionWeapons) ? fusionWeapons : [];

        this.optionsContainer.innerHTML = '';

        if (this.evolutionRecipes.length > 0) {
            const evolutionCard = this.createRewardCard({
                type: 'evolution',
                icon: '⬆️',
                title: '进化',
                desc: `可进化 ${this.evolutionRecipes.length} 种`
            });
            evolutionCard.onclick = () => this.showEvolutionDialog();
            this.optionsContainer.appendChild(evolutionCard);
        }

        if (this.fusionWeapons.length >= 2) {
            const fusionCard = this.createRewardCard({
                type: 'fusion',
                icon: '🌀',
                title: '融合',
                desc: '选择两把武器融合'
            });
            fusionCard.onclick = () => this.showFusionDialog();
            this.optionsContainer.appendChild(fusionCard);
        }

        const goldCard = this.createRewardCard({
            type: 'gold',
            icon: '💰',
            title: '金币',
            desc: `获得 +${goldAmount} 金币`
        });
        goldCard.onclick = () => this.commitSelection({ type: 'gold', amount: goldAmount });
        this.optionsContainer.appendChild(goldCard);

        this.showMenu();
    }

    showEvolutionDialog() {
        if (!this.overlay || !this.overlayOptions) return;
        this.hideMenu();
        this.overlay.style.display = 'flex';
        if (this.overlayTitle) this.overlayTitle.textContent = '武器进化';
        if (this.confirmBtn) this.confirmBtn.style.display = 'none';
        this.overlayOptions.classList.remove('is-selection');
        this.overlayOptions.innerHTML = '';

        this.evolutionRecipes.forEach(recipe => {
            const card = this.createEvolutionCard(recipe);
            card.onclick = () => this.commitSelection({ type: 'evolution', recipe });
            this.overlayOptions.appendChild(card);
        });
    }

    showFusionDialog() {
        if (!this.overlay || !this.overlayOptions) return;
        this.hideMenu();
        this.overlay.style.display = 'flex';
        if (this.overlayTitle) this.overlayTitle.textContent = '武器融合';
        if (this.confirmBtn) {
            this.confirmBtn.style.display = 'inline-flex';
            this.confirmBtn.disabled = true;
        }

        this.selectedFusionIds.clear();
        this.overlayOptions.classList.add('is-selection');
        this.overlayOptions.innerHTML = '';

        const sortedWeapons = this.fusionWeapons
            .filter(w => w && w.def && w.def.id)
            .slice()
            .sort((a, b) => {
                const idA = a.def.id;
                const idB = b.def.id;
                const orderA = ORDER_MAP[idA] ?? 9999;
                const orderB = ORDER_MAP[idB] ?? 9999;
                if (orderA !== orderB) return orderA - orderB;
                return idA.localeCompare(idB);
            });

        sortedWeapons.forEach(weapon => {
            const card = this.createFusionSelectCard(weapon);
            this.overlayOptions.appendChild(card);
        });

        this.updateFusionSelectionUI();
    }

    handleEscape() {
        if (this.overlay && this.overlay.style.display === 'flex') {
            this.showMenu();
            return true;
        }
        if (this.menu && this.menu.style.display === 'flex') {
            return this.selectDefaultReward();
        }
        return false;
    }

    selectDefaultReward() {
        if (!this.onSelectReward || !this.defaultReward) return false;
        this.commitSelection(this.defaultReward);
        return true;
    }

    commitSelection(selection) {
        const callback = this.onSelectReward;
        this.onSelectReward = null;
        this.defaultReward = null;
        this.selectedFusionIds.clear();
        this.close();
        if (callback) callback(selection);
    }

    confirmFusion() {
        const ids = Array.from(this.selectedFusionIds);
        if (ids.length !== 2) return;
        const sorted = sortWeaponIds(ids);
        this.commitSelection({ type: 'fusion', weaponIds: sorted });
    }

    toggleFusionSelection(weaponId) {
        if (!weaponId) return;
        if (this.selectedFusionIds.has(weaponId)) {
            this.selectedFusionIds.delete(weaponId);
        } else {
            if (this.selectedFusionIds.size >= 2) return;
            this.selectedFusionIds.add(weaponId);
        }
        this.updateFusionSelectionUI();
    }

    updateFusionSelectionUI() {
        if (this.overlayOptions) {
            const cards = this.overlayOptions.querySelectorAll('.fusion-select-card');
            cards.forEach(card => {
                const weaponId = card.dataset.weaponId;
                card.classList.toggle('selected', this.selectedFusionIds.has(weaponId));
            });
        }
        if (this.confirmBtn) {
            this.confirmBtn.disabled = this.selectedFusionIds.size !== 2;
        }
    }

    createRewardCard({ type, icon, title, desc }) {
        const card = document.createElement('div');
        card.className = 'reward-card';
        card.dataset.rewardType = type;
        card.innerHTML = `
            <div class="reward-icon">${icon}</div>
            <div class="reward-name">${title}</div>
            <div class="reward-desc">${desc}</div>
        `;
        return card;
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

    createEvolutionCard(recipe) {
        const div = document.createElement('div');
        div.className = 'fusion-card';

        const materialIcons = (recipe.materials || [])
            .map(id => `<span class="fusion-material-icon">${this.getWeaponIcon(id)}</span>`)
            .join('<span class="fusion-plus">+</span>');

        const resultIcon = recipe.icon || this.getWeaponIcon(recipe.result);

        div.innerHTML = `
            <div class="fusion-result">
                <div class="fusion-result-icon">${resultIcon}</div>
                <div class="fusion-result-name">${recipe.name}</div>
            </div>
            <div class="fusion-materials">${materialIcons}</div>
            <div class="fusion-description">${recipe.description || ''}</div>
        `;
        return div;
    }

    createFusionSelectCard(weapon) {
        const def = weapon.def || {};
        const card = document.createElement('div');
        card.className = 'fusion-select-card';
        card.dataset.weaponId = def.id;
        card.innerHTML = `
            <div class="fusion-select-icon">${this.getWeaponIcon(def.id, def)}</div>
            <div class="fusion-select-name">${def.name || def.id}</div>
        `;
        card.onclick = () => this.toggleFusionSelection(def.id);
        return card;
    }

    getWeaponIcon(weaponId, weaponDef = null) {
        if (weaponDef && weaponDef.isFusion) return '🌀';
        return WEAPON_ICON_MAP[weaponId] || '??';
    }

    getWeaponName(weaponId) {
        const key = Object.keys(WEAPONS).find(k => WEAPONS[k].id === weaponId);
        return key ? WEAPONS[key].name : weaponId;
    }

    showMenu() {
        if (this.overlay) this.overlay.style.display = 'none';
        if (this.menu) this.menu.style.display = 'flex';
    }

    hideMenu() {
        if (this.menu) this.menu.style.display = 'none';
    }

    close() {
        if (this.menu) this.menu.style.display = 'none';
        if (this.overlay) this.overlay.style.display = 'none';
    }

    isOpen() {
        return (this.menu && this.menu.style.display === 'flex') ||
            (this.overlay && this.overlay.style.display === 'flex');
    }
}
