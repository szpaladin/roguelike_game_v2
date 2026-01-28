import {
    WEAPONS,
    WEAPON_ICON_MAP,
    WEAPON_ID_MAP,
    WEAPON_FUSION_TABLE,
    WEAPON_TIER
} from '../weapons/WeaponsData.js';

const FPS = 60;

const TIER_LABEL = {
    [WEAPON_TIER.INITIAL]: '初始',
    [WEAPON_TIER.BASIC]: '基础',
    [WEAPON_TIER.EVOLUTION]: '进化',
    [WEAPON_TIER.FUSION]: '融合'
};

const GROUPS = [
    {
        key: 'basic',
        label: '基础',
        predicate: (tier) => tier === WEAPON_TIER.INITIAL || tier === WEAPON_TIER.BASIC
    },
    {
        key: 'evolution',
        label: '进化',
        predicate: (tier) => tier === WEAPON_TIER.EVOLUTION
    },
    {
        key: 'fusion',
        label: '融合',
        predicate: (tier) => tier === WEAPON_TIER.FUSION
    }
];

function fmtFrames(frames) {
    if (frames === undefined || frames === null) return '';
    const sec = (Number(frames) / FPS);
    return `${frames}f (${sec.toFixed(2)}s)`;
}

function fmtBool(v) {
    return v ? '是' : '否';
}

function safeText(s) {
    return (s === undefined || s === null) ? '' : String(s);
}

function buildWeaponsById() {
    const map = {};
    for (const def of Object.values(WEAPONS)) {
        if (def && def.id) map[def.id] = def;
    }
    return map;
}

function deriveEffects(def) {
    if (!def) return '（待补全）';
    if (def.effects) return def.effects;

    const tags = [];
    if (def.canSplit) tags.push('分裂');
    if (def.piercing) tags.push('穿透');
    if (def.aoeRadius || def.explosionRadius) tags.push('范围伤害');
    if (def.rayRange || def.rayLength) tags.push('射线');
    if (def.chainCount) tags.push('连锁');
    if (def.burnDuration) tags.push('燃烧');
    if (def.poisonDuration) tags.push('中毒');
    if (def.freezeChance || def.freezeDuration) tags.push('冻结');
    if (def.blindChance || def.blindDuration) tags.push('致盲');
    if (def.lifeStealChance) tags.push('吸血');
    if (def.vulnerability || def.radiationVulnerability) tags.push('易伤');

    return tags.length ? tags.join('、') : '（待补全）';
}

export default class WeaponCodexUI {
    constructor(opts = {}) {
        this.getPaused = opts.getPaused || (() => false);
        this.setPaused = opts.setPaused || (() => { });
        this.isBlocked = opts.isBlocked || (() => false);

        this._prevPaused = false;

        this.weaponsById = buildWeaponsById();

        this.overlay = null;
        this.dialog = null;
        this.grid = null;
        this.searchInput = null;
        this.countEl = null;

        this.detailOverlay = null;
        this.detailDialog = null;

        this.weaponEntries = this.buildWeaponEntries();
    }

    init() {
        this.injectButton();
        this.ensureDom();
        this.renderList('');
    }

    buildWeaponEntries() {
        const entries = Object.values(WEAPON_ID_MAP)
            .slice()
            .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999))
            .map(info => {
                const id = info.id;
                const def = this.weaponsById[id];
                return {
                    id,
                    name: (def && def.name) || info.name || id,
                    tier: (def && def.tier) ?? info.tier,
                    icon: WEAPON_ICON_MAP[id] || '??',
                    def: def || null
                };
            });

        return entries;
    }

    injectButton() {
        const weaponPanel = document.querySelector('.weapon-panel');
        if (!weaponPanel) return;
        const title = weaponPanel.querySelector('h2');
        if (!title) return;

        // Avoid double-inject on hot reloads.
        if (weaponPanel.querySelector('.codex-open-btn')) return;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'codex-open-btn';
        btn.textContent = '图鉴';
        btn.onclick = () => this.open();
        title.appendChild(btn);
    }

    ensureDom() {
        if (!this.overlay) {
            this.overlay = document.createElement('div');
            this.overlay.id = 'codex-overlay';
            this.overlay.className = 'overlay codex-overlay';
            this.overlay.style.display = 'none';
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) this.closeAll();
            });

            this.dialog = document.createElement('div');
            this.dialog.className = 'dialog codex-dialog';

            const header = document.createElement('div');
            header.className = 'codex-header';
            header.innerHTML = `
                <h2 class="codex-title">武器图鉴</h2>
                <button type="button" class="codex-close-btn" aria-label="关闭图鉴">关闭</button>
            `;
            header.querySelector('.codex-close-btn').onclick = () => this.closeAll();

            const toolbar = document.createElement('div');
            toolbar.className = 'codex-toolbar';
            toolbar.innerHTML = `
                <input class="codex-search" type="search" placeholder="搜索武器（名称/ID）" />
                <div class="codex-count"></div>
            `;

            this.searchInput = toolbar.querySelector('.codex-search');
            this.countEl = toolbar.querySelector('.codex-count');
            this.searchInput.addEventListener('input', () => this.renderList(this.searchInput.value));
            this.searchInput.addEventListener('keydown', (e) => e.stopPropagation());
            this.searchInput.addEventListener('keyup', (e) => e.stopPropagation());

            this.grid = document.createElement('div');
            this.grid.className = 'codex-grid';
            this.grid.addEventListener('click', (e) => {
                const card = e.target.closest('[data-weapon-id]');
                if (!card) return;
                const weaponId = card.getAttribute('data-weapon-id');
                this.openDetail(weaponId);
            });

            this.dialog.appendChild(header);
            this.dialog.appendChild(toolbar);
            this.dialog.appendChild(this.grid);
            // Prevent game controls while interacting with the codex UI.
            this.dialog.addEventListener('keydown', (e) => e.stopPropagation());
            this.dialog.addEventListener('keyup', (e) => e.stopPropagation());
            this.overlay.appendChild(this.dialog);
            document.body.appendChild(this.overlay);
        }

        if (!this.detailOverlay) {
            this.detailOverlay = document.createElement('div');
            this.detailOverlay.id = 'codex-detail-overlay';
            this.detailOverlay.className = 'overlay codex-overlay codex-detail-overlay';
            this.detailOverlay.style.display = 'none';
            this.detailOverlay.addEventListener('click', (e) => {
                if (e.target === this.detailOverlay) this.closeDetail();
            });

            this.detailDialog = document.createElement('div');
            this.detailDialog.className = 'dialog codex-dialog codex-detail-dialog';
            // Prevent game controls while interacting with the detail view.
            this.detailDialog.addEventListener('keydown', (e) => e.stopPropagation());
            this.detailDialog.addEventListener('keyup', (e) => e.stopPropagation());

            this.detailOverlay.appendChild(this.detailDialog);
            document.body.appendChild(this.detailOverlay);
        }
    }

    open() {
        if (this.isOpen()) return;
        if (this.isBlocked()) return;

        this.ensureDom();

        this._prevPaused = !!this.getPaused();
        this.setPaused(true);

        this.overlay.style.display = 'flex';
        this.renderList('');
        if (this.searchInput) {
            this.searchInput.value = '';
            this.searchInput.focus();
        }
    }

    closeAll() {
        this.closeDetail();
        if (this.overlay) this.overlay.style.display = 'none';
        this.setPaused(this._prevPaused);
    }

    closeDetail() {
        if (this.detailOverlay) this.detailOverlay.style.display = 'none';
        if (this.detailDialog) this.detailDialog.innerHTML = '';
    }

    closeTop() {
        if (this.isDetailOpen()) this.closeDetail();
        else this.closeAll();
    }

    handleEscape() {
        if (!this.isOpen()) return false;
        this.closeTop();
        return true;
    }

    isOpen() {
        return !!(this.overlay && this.overlay.style.display === 'flex');
    }

    isDetailOpen() {
        return !!(this.detailOverlay && this.detailOverlay.style.display === 'flex');
    }

    renderList(query) {
        if (!this.grid) return;
        const q = safeText(query).trim().toLowerCase();
        const filtered = !q ? this.weaponEntries : this.weaponEntries.filter(w => {
            return w.name.toLowerCase().includes(q) || w.id.toLowerCase().includes(q);
        });

        if (this.countEl) {
            this.countEl.textContent = `${filtered.length}/${this.weaponEntries.length}`;
        }

        const cardHtml = (w) => `
            <button type="button" class="codex-card" data-weapon-id="${w.id}">
                <div class="codex-card-icon">${w.icon}</div>
                <div class="codex-card-name">${w.name}</div>
            </button>
        `;

        // 搜索时直接平铺结果；平时按“基础/进化/融合”分组，中间用长分隔线。
        if (q) {
            this.grid.innerHTML = `
                <div class="codex-group-grid">
                    ${filtered.map(cardHtml).join('')}
                </div>
            `;
            return;
        }

        const sections = [];
        for (const g of GROUPS) {
            const groupItems = filtered.filter(w => g.predicate(w.tier));
            if (!groupItems.length) continue;

            sections.push(`
                <div class="codex-group">
                    <div class="codex-group-title">${g.label}</div>
                    <div class="codex-group-grid">
                        ${groupItems.map(cardHtml).join('')}
                    </div>
                </div>
            `);
        }

        this.grid.innerHTML = sections.join('<div class="codex-divider"></div>');
    }

    openDetail(weaponId) {
        const def = this.weaponsById[weaponId] || null;
        const icon = WEAPON_ICON_MAP[weaponId] || '??';
        const name = (def && def.name) || weaponId;
        const tierLabel = TIER_LABEL[def ? def.tier : undefined] || '未知';

        const recipes = WEAPON_FUSION_TABLE.filter(r => r.result === weaponId);

        const statsRows = [];
        const add = (label, value) => {
            if (value === undefined || value === null || value === '') return;
            statsRows.push(`<div class="codex-stat"><div class="codex-stat-k">${label}</div><div class="codex-stat-v">${value}</div></div>`);
        };

        if (def) {
            add('伤害', safeText(def.damage));
            add('间隔', fmtFrames(def.interval));
            add('速度', safeText(def.speed));
            add('半径', safeText(def.radius));
            add('存活', fmtFrames(def.lifetime));
            add('穿透', fmtBool(!!def.piercing));

            add('射线范围', safeText(def.rayRange));
            add('射线长度', safeText(def.rayLength));
            add('射线宽度', safeText(def.rayWidth));

            add('AOE半径', safeText(def.aoeRadius));
            add('AOE伤害', safeText(def.aoeDamage));

            add('爆炸半径', safeText(def.explosionRadius));
            add('爆炸伤害', safeText(def.explosionDamage));

            add('连锁次数', safeText(def.chainCount));
            add('连锁范围', safeText(def.chainRange));
            add('连锁冷却', safeText(def.chainCooldown));

            add('燃烧时长', fmtFrames(def.burnDuration));
            if (def.burnDamagePerFrame !== undefined) {
                add('燃烧伤害', `${def.burnDamagePerFrame.toFixed ? def.burnDamagePerFrame.toFixed(4) : def.burnDamagePerFrame}/f`);
            }

            add('中毒时长', fmtFrames(def.poisonDuration));
            if (def.poisonDamagePerStack !== undefined) {
                add('中毒伤害', `${def.poisonDamagePerStack.toFixed ? def.poisonDamagePerStack.toFixed(4) : def.poisonDamagePerStack}/f`);
            }

            if (def.freezeChance !== undefined) add('冻结概率', `${Math.round(def.freezeChance * 100)}%`);
            add('冻结时长', fmtFrames(def.freezeDuration));
            if (def.blindChance !== undefined) add('致盲概率', `${Math.round(def.blindChance * 100)}%`);
            add('致盲时长', fmtFrames(def.blindDuration));
            if (def.lifeStealChance !== undefined) add('吸血概率', `${Math.round(def.lifeStealChance * 100)}%`);
            add('吸血数值', safeText(def.lifeStealAmount));

            if (def.vulnerability !== undefined) add('易伤', `${Math.round(def.vulnerability * 100)}%`);
            if (def.radiationVulnerability !== undefined) add('辐射易伤', `${Math.round(def.radiationVulnerability * 100)}%`);
            add('辐射时长', fmtFrames(def.radiationVulnerabilityDuration));
        }

        const recipesHtml = recipes.length ? recipes.map(r => {
            const m = r.materials || [];
            const m0 = m[0];
            const m1 = m[1];
            const m0Icon = WEAPON_ICON_MAP[m0] || '??';
            const m1Icon = WEAPON_ICON_MAP[m1] || '??';
            const m0Name = (this.weaponsById[m0] && this.weaponsById[m0].name) || m0;
            const m1Name = (this.weaponsById[m1] && this.weaponsById[m1].name) || m1;
            return `
                <div class="codex-recipe">
                    <div class="codex-recipe-mats">
                        <span class="codex-mat">${m0Icon} ${m0Name}</span>
                        <span class="codex-plus">+</span>
                        <span class="codex-mat">${m1Icon} ${m1Name}</span>
                    </div>
                    <div class="codex-recipe-desc">${safeText(r.description) || '（待补全）'}</div>
                </div>
            `;
        }).join('') : `<div class="codex-muted">不可通过合成获得</div>`;

        const descHtml = (() => {
            if (recipes.length) {
                const list = recipes.map(r => safeText(r.description)).filter(Boolean);
                if (list.length) {
                    return `<div class="codex-desc-list">${list.map(d => `<div class="codex-desc-item">${d}</div>`).join('')}</div>`;
                }
            }
            if (def && def.description) return `<div class="codex-desc-item">${def.description}</div>`;
            return `<div class="codex-muted">（待补全）</div>`;
        })();

        const effectsHtml = `<div class="codex-effects">${safeText(deriveEffects(def))}</div>`;

        this.detailDialog.innerHTML = `
            <div class="codex-detail-header">
                <div class="codex-detail-title">
                    <div class="codex-detail-icon">${icon}</div>
                    <div class="codex-detail-meta">
                        <div class="codex-detail-name">${name}</div>
                        <div class="codex-detail-tier">${tierLabel}</div>
                    </div>
                </div>
                <button type="button" class="codex-back-btn">返回</button>
            </div>

            <div class="codex-section">
                <div class="codex-section-title">数值面板</div>
                <div class="codex-stats">
                    ${statsRows.length ? statsRows.join('') : '<div class="codex-muted">无可显示数值</div>'}
                </div>
            </div>

            <div class="codex-section">
                <div class="codex-section-title">合成材料</div>
                ${recipesHtml}
            </div>

            <div class="codex-section">
                <div class="codex-section-title">描述</div>
                ${descHtml}
            </div>

            <div class="codex-section">
                <div class="codex-section-title">效果</div>
                ${effectsHtml}
            </div>
        `;

        this.detailDialog.querySelector('.codex-back-btn').onclick = () => this.closeDetail();

        this.detailOverlay.style.display = 'flex';
    }
}
