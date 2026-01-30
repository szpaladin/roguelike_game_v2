/**
 * 武器 Tier 分级枚举
 * INITIAL: 初始武器 - 普通弹珠，游戏开始自带
 * BASIC: 基础武器 - 通过消耗技能点获取
 * EVOLUTION: 进化武器 - 消耗2个武器合成得到新武器
 * FUSION: 融合武器 - 预留，不消耗武器，叠加特性
 */
export const WEAPON_TIER = {
    INITIAL: 0,
    BASIC: 1,
    EVOLUTION: 2,
    FUSION: 3
};

/**
 * 武器定义表
 * 包含所有武器的属性定义
 */
export const WEAPONS = {
    // === 初始武器 ===
    BASIC: {
        id: 'basic',
        name: '普通弹珠',
        tier: WEAPON_TIER.INITIAL,
        damage: 1,
        interval: 30,
        speed: 8,
        radius: 4,
        color: '#ffff00',
        lifetime: 120,
        piercing: false
    },
    // === 基础武器 ===
    FIRE: {
        id: 'fire',
        name: '火焰',
        tier: WEAPON_TIER.BASIC,
        damage: 1.0,
        interval: 30,
        speed: 8,
        radius: 4,
        color: '#ff6600',
        lifetime: 120,
        piercing: false,
        burnDuration: 300,
        burnDamagePerFrame: 5 / 60
    },
    FROST: {
        id: 'frost',
        name: '冰霜',
        tier: WEAPON_TIER.BASIC,
        damage: 1.0,
        interval: 30,
        speed: 8,
        radius: 4,
        color: '#00ccff',
        lifetime: 120,
        piercing: false,
        freezeChance: 0.3,
        freezeDuration: 120,
        vulnerability: 0.25
    },
    SWIFT: {
        id: 'swift',
        name: '疾风',
        tier: WEAPON_TIER.BASIC,
        damage: 0.6,
        interval: 20,
        speed: 12,
        radius: 4,
        color: '#00ff00',
        lifetime: 120,
        piercing: true
    },
    VAMPIRE: {
        id: 'vampire',
        name: '吸血',
        tier: WEAPON_TIER.BASIC,
        damage: 1.0,
        interval: 30,
        speed: 6,
        radius: 4,
        color: '#8b0000',
        lifetime: 120,
        piercing: false,
        lifeStealChance: 0.06,
        lifeStealAmount: 1
    },
    POISON: {
        id: 'poison',
        name: '剧毒',
        tier: WEAPON_TIER.BASIC,
        damage: 0.5,
        interval: 30,
        speed: 8,
        radius: 4,
        color: '#00ff00',
        lifetime: 120,
        piercing: false,
        poisonDuration: 900,
        poisonDamagePerStack: 3 / 60
    },
    STEEL: {
        id: 'steel',
        name: '钢铁',
        tier: WEAPON_TIER.BASIC,
        damage: 3.0,
        interval: 90,
        speed: 6,
        radius: 6,
        color: '#c0c0c0',
        lifetime: 100,
        piercing: false
    },
    DARK: {
        id: 'dark',
        name: '黑暗',
        tier: WEAPON_TIER.BASIC,
        damage: 2.0,
        interval: 60,
        speed: 5,
        radius: 5,
        color: '#4b0082',
        lifetime: 150,
        piercing: false
    },
    LIGHTNING: {
        id: 'lightning',
        name: '闪电',
        tier: WEAPON_TIER.BASIC,
        damage: 1.0,
        interval: 30,
        speed: 8,
        radius: 4,
        color: '#ffff00',
        lifetime: 120,
        piercing: false,
        chainCount: 3,
        chainRange: 150,
        chainCooldown: 10
    },
    LIGHT: {
        id: 'light',
        name: '光芒',
        tier: WEAPON_TIER.BASIC,
        damage: 1.0,
        interval: 30,
        speed: 8,
        radius: 4,
        color: '#ffffaa',
        lifetime: 120,
        piercing: false,
        blindChance: 0.5,
        blindDuration: 180
    },
    ROCK: {
        id: 'rock',
        name: '岩石',
        tier: WEAPON_TIER.BASIC,
        damage: 0.8,
        interval: 30,
        speed: 8,
        radius: 4,
        color: '#8B4513',
        lifetime: 120,
        piercing: false,
        aoeRadius: 80,
        aoeDamage: 0.8
    },
    GHOST: {
        id: 'ghost',
        name: '幽灵',
        tier: WEAPON_TIER.BASIC,
        damage: 1.0,
        interval: 30,
        speed: 12,
        radius: 4,
        color: '#1E3A8A',
        lifetime: 120,
        piercing: true
    },
    RAY: {
        id: 'ray',
        name: '射线',
        tier: WEAPON_TIER.BASIC,
        damage: 0.8,
        interval: 30,
        speed: 8,
        radius: 4,
        color: '#FFA500',
        lifetime: 120,
        piercing: false,
        rayRange: 300,
        rayLength: 600,
        rayWidth: 10
    },
    CELL: {
        id: 'cell',
        name: '细胞',
        tier: WEAPON_TIER.BASIC,
        damage: 0.8,
        interval: 30,
        speed: 8,
        radius: 4,
        color: '#20B2AA',
        lifetime: 120,
        piercing: false,
        canSplit: true,
        splitCount: 2,
        splitRange: 200
    },

    // === 进化武器 ===
    BOMB: {
        id: 'bomb',
        name: '炸弹',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 3.0,
        interval: 90,
        speed: 8,
        radius: 6,
        color: '#ff4500',
        lifetime: 120,
        piercing: false,
        explosionRadius: 100,
        explosionDamage: 2.0
    },
    STORM: {
        id: 'storm',
        name: '风暴',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 0.75,
        interval: 20,
        speed: 12,
        radius: 12,
        color: '#ffff00',
        lifetime: 120,
        piercing: true,
        chainCount: 3,
        chainRange: 150,
        chainCooldown: 10
    },
    POISON_MIST: {
        id: 'poison_mist',
        name: '毒雾',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 0.75,
        interval: 30,
        speed: 10,
        radius: 12,
        color: '#00ff00',
        lifetime: 120,
        piercing: true,
        poisonDuration: 900,
        poisonDamagePerStack: 3 / 60
    },
    BLIZZARD: {
        id: 'blizzard',
        name: '暴风雪',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 0.75,
        interval: 20,
        speed: 12,
        radius: 12,
        color: '#00ccff',
        lifetime: 120,
        piercing: true,
        freezeChance: 0.5,
        freezeDuration: 180,
        vulnerability: 0.25
    },
    INFERNO: {
        id: 'inferno',
        name: '炼狱',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 1.0,
        interval: 30,
        speed: 10,
        radius: 12,
        color: '#cc0000',
        lifetime: 120,
        piercing: true,
        burnDuration: 300,
        burnDamagePerFrame: 5 / 60
    },
    FROSTFIRE: {
        id: 'frostfire',
        name: '燃霜',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 1.0,
        interval: 30,
        speed: 8,
        radius: 4,
        color: '#00ccff',
        lifetime: 120,
        piercing: false,
        burnDuration: 1200,
        burnDamagePerFrame: 10 / 60,
        burnColor: '#00ccff',
        vulnerability: 0.25
    },

    PLAGUE: {
        id: 'plague',
        name: '瘟疫',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 0.6,
        interval: 30,
        speed: 8,
        radius: 12,
        color: '#6f7a66',
        lifetime: 120,
        piercing: false,
        plagueDuration: 600,
        plagueDamagePerStack: 2 / 60,
        plagueCloudRadius: 140,
        effects: '瘟疫扩散 + 持续DOT',
        sources: ['poison', 'cell', 'dark', 'ghost', 'vampire'],
        status: '现有'
    },

    RADIATION_BEAM: {
        id: 'radiation_beam',
        name: '辐射射线',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 0.8,
        interval: 30,
        speed: 8,
        radius: 12,
        color: '#7CFC00',
        lifetime: 120,
        piercing: false,
        rayRange: 300,
        rayLength: 600,
        rayWidth: 10,
        radiationVulnerability: 0.1,
        radiationVulnerabilityDuration: 600,
        effects: '射线AOE + 辐射易伤叠层',
        sources: ['cell', 'ray'],
        status: '现有'
    },

    OVERGROWTH: {
        id: 'overgrowth',
        name: '蔓延',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 0.8,
        interval: 30,
        speed: 8,
        radius: 12,
        color: '#567c5f',
        lifetime: 120,
        piercing: false,
        overgrowthDuration: 300,
        overgrowthTriggerStacks: 3,
        overgrowthExplosionRadius: 60,
        overgrowthExplosionMultiplier: 2.5,
        effects: '蔓延叠层 + 爆发AOE',
        sources: ['cell', 'rock'],
        status: '建议'
    },

    DARK_FLAME: {
        id: 'dark_flame',
        name: '暗焰',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 1.5,
        interval: 45,
        speed: 6.5,
        radius: 5,
        color: '#a53341',
        lifetime: 150,
        piercing: false,
        burnDuration: 300,
        burnDamagePerFrame: 0.083333,
        vulnerability: 0.25,
        effects: '燃烧DOT + 易伤',
        sources: ['dark', 'fire'],
        status: '建议'
    },

    FROST_CORROSION: {
        id: 'frost_corrosion',
        name: '怨灵',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 1.5,
        interval: 45,
        speed: 6.5,
        radius: 5,
        color: '#2666c1',
        lifetime: 150,
        piercing: false,
        freezeChance: 0.3,
        freezeDuration: 120,
        curseDuration: 1800,
        curseConsumeStacks: 1,
        curseDamageMultiplier: 1.5,
        effects: '冻结 + 诅咒',
        sources: ['dark', 'frost'],
        status: '现有'
    },

    SHADOW_WRAITH: {
        id: 'shadow_wraith',
        name: '恶灵',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 1.5,
        interval: 45,
        speed: 8.5,
        radius: 5,
        color: '#351d86',
        lifetime: 150,
        piercing: true,
        curseDuration: 1800,
        curseConsumeStacks: 1,
        curseDamageMultiplier: 1.5,
        effects: '穿透 + 诅咒',
        sources: ['dark', 'ghost'],
        status: '现有'
    },

    ECLIPSE: {
        id: 'eclipse',
        name: '日蚀',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 1.5,
        interval: 45,
        speed: 6.5,
        radius: 5,
        color: '#a58096',
        lifetime: 150,
        piercing: false,
        vulnerability: 0.25,
        blindChance: 0.5,
        blindDuration: 180,
        effects: '致盲 + 易伤',
        sources: ['dark', 'light'],
        status: '建议'
    },

    VOID_BEAM: {
        id: 'void_beam',
        name: '虚空射线',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 1.4,
        interval: 45,
        speed: 6.5,
        radius: 12,
        color: '#a55341',
        lifetime: 150,
        piercing: false,
        rayRange: 300,
        rayLength: 600,
        rayWidth: 10,
        curseDuration: 1800,
        curseConsumeStacks: 1,
        curseDamageMultiplier: 1.5,
        effects: '射线AOE + 诅咒',
        sources: ['dark', 'ray'],
        status: '现有'
    },

    CURSED_STONE: {
        id: 'cursed_stone',
        name: '暗蚀地带',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 1.4,
        interval: 45,
        speed: 6.5,
        radius: 12,
        color: '#6b234b',
        lifetime: 150,
        piercing: false,
        aoeRadius: 80,
        aoeDamage: 0.8,
        curseDuration: 1800,
        curseConsumeStacks: 1,
        curseDamageMultiplier: 1.5,
        effects: '圆形AOE + 诅咒',
        sources: ['dark', 'rock'],
        status: '现有'
    },

    DARK_STEEL: {
        id: 'dark_steel',
        name: '黑钢',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 3,
        interval: 90,
        speed: 5.5,
        radius: 6,
        color: '#8660a1',
        lifetime: 150,
        piercing: false,
        vulnerability: 0.25,
        effects: '高伤 + 易伤',
        sources: ['dark', 'steel'],
        status: '建议'
    },

    SOUL_DRAIN: {
        id: 'soul_drain',
        name: '血咒',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 1.5,
        interval: 45,
        speed: 5.5,
        radius: 5,
        color: '#6b0041',
        lifetime: 150,
        piercing: false,
        curseDuration: 1800,
        curseConsumeStacks: 1,
        curseDamageMultiplier: 1.5,
        effects: '诅咒',
        sources: ['dark', 'vampire'],
        status: '现有'
    },

    GHOST_FIRE: {
        id: 'ghost_fire',
        name: '鬼火',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 1,
        interval: 30,
        speed: 10,
        radius: 4,
        color: '#8f5045',
        lifetime: 120,
        piercing: true,
        burnDuration: 300,
        burnDamagePerFrame: 0.083333,
        effects: '穿透 + 燃烧DOT',
        sources: ['fire', 'ghost'],
        status: '建议'
    },

    TOXIC_FLAME: {
        id: 'toxic_flame',
        name: '毒焰',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 0.75,
        interval: 30,
        speed: 8,
        radius: 4,
        color: '#80b300',
        lifetime: 120,
        piercing: false,
        burnDuration: 300,
        burnDamagePerFrame: 0.083333,
        poisonDuration: 900,
        poisonDamagePerStack: 0.05,
        effects: '燃烧DOT + 中毒DOT',
        sources: ['fire', 'poison'],
        status: '建议'
    },

    SOLAR_BEAM: {
        id: 'solar_beam',
        name: '太阳束',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 0.9,
        interval: 30,
        speed: 8,
        radius: 12,
        color: '#ff8600',
        lifetime: 120,
        piercing: false,
        rayRange: 300,
        rayLength: 600,
        rayWidth: 10,
        burnDuration: 300,
        burnDamagePerFrame: 0.083333,
        effects: '射线AOE + 燃烧DOT',
        sources: ['fire', 'ray'],
        status: '建议'
    },

    LAVA: {
        id: 'lava',
        name: '熔岩',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 0.9,
        interval: 30,
        speed: 6,
        radius: 14,
        color: '#c5560a',
        lifetime: 240,
        piercing: false,
        spawnMode: 'sky_drop',
        dropOffsetX: 10,
        dropOffsetY: 60,
        dropSpeed: 6,
        dropLifetime: 240,
        dropRadius: 14,
        burnDuration: 300,
        burnDamagePerFrame: 0.083333,
        effects: '顶落岩石 + 燃烧',
        sources: ['fire', 'rock'],
        status: '建议'
    },

    FROST_WRAITH: {
        id: 'frost_wraith',
        name: '霜灵',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 1,
        interval: 30,
        speed: 10,
        radius: 4,
        color: '#0f83c5',
        lifetime: 120,
        piercing: true,
        freezeChance: 0.3,
        freezeDuration: 120,
        effects: '穿透 + 冻结',
        sources: ['frost', 'ghost'],
        status: '建议'
    },

    COLD_BEAM: {
        id: 'cold_beam',
        name: '寒束',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 0.9,
        interval: 30,
        speed: 8,
        radius: 12,
        color: '#80b980',
        lifetime: 120,
        piercing: false,
        rayRange: 300,
        rayLength: 600,
        rayWidth: 10,
        freezeChance: 0.3,
        freezeDuration: 120,
        effects: '射线AOE + 冻结',
        sources: ['frost', 'ray'],
        status: '建议'
    },

    GLACIER: {
        id: 'glacier',
        name: '冰川',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 0.9,
        interval: 30,
        speed: 6,
        radius: 14,
        color: '#468989',
        lifetime: 240,
        piercing: false,
        spawnMode: 'sky_drop',
        dropOffsetX: 10,
        dropOffsetY: 60,
        dropSpeed: 6,
        dropLifetime: 240,
        dropRadius: 14,
        freezeChance: 0.3,
        freezeDuration: 120,
        effects: '顶落岩石 + 冻结',
        sources: ['frost', 'rock'],
        status: '建议'
    },

    ICE_SPIKE: {
        id: 'ice_spike',
        name: '冰锥',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 2.4,
        interval: 80,
        speed: 7,
        radius: 6,
        color: '#60c6e0',
        lifetime: 120,
        piercing: false,
        freezeChance: 0.3,
        freezeDuration: 120,
        shatterMultiplier: 2,
        shatterConsumesFrozen: true,
        shatterPreventRefreeze: true,
        effects: '冻结 + 碎冰倍伤',
        sources: ['frost', 'steel'],
        status: '现有'
    },

    HOLY_WISP: {
        id: 'holy_wisp',
        name: '圣灵',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 1,
        interval: 30,
        speed: 10,
        radius: 4,
        color: '#8f9d9a',
        lifetime: 120,
        piercing: true,
        blindChance: 0.5,
        blindDuration: 180,
        effects: '致盲 + 穿透',
        sources: ['ghost', 'light'],
        status: '建议'
    },

    PHANTOM_ARC: {
        id: 'phantom_arc',
        name: '幽电',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 1,
        interval: 30,
        speed: 10,
        radius: 12,
        color: '#8f9d45',
        lifetime: 120,
        piercing: true,
        chainCount: 3,
        chainRange: 150,
        chainCooldown: 10,
        effects: '连锁闪电 + 穿透',
        sources: ['ghost', 'lightning'],
        status: '建议'
    },

    NETHER_STONE: {
        id: 'nether_stone',
        name: '幽冥石',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 0.9,
        interval: 30,
        speed: 6,
        radius: 14,
        color: '#55404f',
        lifetime: 240,
        piercing: true,
        spawnMode: 'sky_drop',
        dropOffsetX: 10,
        dropOffsetY: 60,
        dropSpeed: 6,
        dropLifetime: 240,
        dropRadius: 14,
        terrainOnHit: {
            type: 'ridge',
            length: 90,
            width: 18,
            duration: 120,
            slowAmount: 0.3,
            slowDuration: 120
        },
        effects: '顶落岩石 + 岩脊带控场 + 穿透',
        sources: ['ghost', 'rock'],
        status: '建议'
    },

    RADIANT_ARC: {
        id: 'radiant_arc',
        name: '闪耀电弧',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 1,
        interval: 30,
        speed: 8,
        radius: 12,
        color: '#ffff55',
        lifetime: 120,
        piercing: false,
        chainCount: 3,
        chainRange: 150,
        chainCooldown: 10,
        blindChance: 0.5,
        blindDuration: 180,
        effects: '连锁闪电 + 致盲',
        sources: ['light', 'lightning'],
        status: '建议'
    },

    SUN_LANCE: {
        id: 'sun_lance',
        name: '日光矛',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 0.9,
        interval: 30,
        speed: 8,
        radius: 12,
        color: '#ffd255',
        lifetime: 120,
        piercing: false,
        rayRange: 300,
        rayLength: 600,
        rayWidth: 10,
        blindChance: 0.5,
        blindDuration: 180,
        effects: '致盲 + 射线AOE',
        sources: ['light', 'ray'],
        status: '建议'
    },

    CRYSTAL_GLOW: {
        id: 'crystal_glow',
        name: '晶耀',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 0.9,
        interval: 30,
        speed: 6,
        radius: 14,
        color: '#c5a25f',
        lifetime: 240,
        piercing: false,
        spawnMode: 'sky_drop',
        dropOffsetX: 10,
        dropOffsetY: 60,
        dropSpeed: 6,
        dropLifetime: 240,
        dropRadius: 14,
        terrainOnHit: {
            type: 'ridge',
            length: 90,
            width: 18,
            duration: 120,
            slowAmount: 0.3,
            slowDuration: 120
        },
        blindChance: 0.5,
        blindDuration: 180,
        effects: '顶落岩石 + 岩脊带控场 + 致盲',
        sources: ['light', 'rock'],
        status: '建议'
    },

    HOLY_HAMMER: {
        id: 'holy_hammer',
        name: '圣锤',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 3,
        interval: 90,
        speed: 7,
        radius: 6,
        color: '#e0e0b5',
        lifetime: 120,
        piercing: false,
        blindChance: 0.5,
        blindDuration: 180,
        effects: '高伤 + 致盲',
        sources: ['light', 'steel'],
        status: '建议'
    },

    FLASH_STRIKE: {
        id: 'flash_strike',
        name: '闪袭',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 0.8,
        interval: 25,
        speed: 10,
        radius: 4,
        color: '#80ff55',
        lifetime: 120,
        piercing: true,
        blindChance: 0.5,
        blindDuration: 180,
        effects: '穿透 + 致盲',
        sources: ['light', 'swift'],
        status: '建议'
    },

    BLOOD_GLOW: {
        id: 'blood_glow',
        name: '血辉',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 1,
        interval: 30,
        speed: 7,
        radius: 4,
        color: '#c58055',
        lifetime: 120,
        piercing: false,
        lifeStealChance: 0.06,
        lifeStealAmount: 1,
        blindChance: 0.5,
        blindDuration: 180,
        effects: '致盲 + 吸血',
        sources: ['light', 'vampire'],
        status: '建议'
    },

    THUNDER_GRIT: {
        id: 'thunder_grit',
        name: '雷砾',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 0.9,
        interval: 30,
        speed: 6,
        radius: 14,
        color: '#c5a20a',
        lifetime: 240,
        piercing: false,
        spawnMode: 'sky_drop',
        dropOffsetX: 10,
        dropOffsetY: 60,
        dropSpeed: 6,
        dropLifetime: 240,
        dropRadius: 14,
        terrainOnHit: {
            type: 'ridge',
            length: 90,
            width: 18,
            duration: 120,
            slowAmount: 0.3,
            slowDuration: 120
        },
        effects: '顶落岩石 + 岩脊带控场',
        sources: ['lightning', 'rock'],
        status: '建议'
    },

    MAG_RAIL: {
        id: 'mag_rail',
        name: '磁轨',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 3,
        interval: 90,
        speed: 7,
        radius: 12,
        color: '#e0e060',
        lifetime: 120,
        piercing: false,
        chainCount: 3,
        chainRange: 150,
        chainCooldown: 10,
        effects: '高伤 + 连锁闪电',
        sources: ['lightning', 'steel'],
        status: '建议'
    },

    LEECH_ARC: {
        id: 'leech_arc',
        name: '吸雷链',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 1,
        interval: 30,
        speed: 7,
        radius: 12,
        color: '#c58000',
        lifetime: 120,
        piercing: false,
        chainCount: 3,
        chainRange: 150,
        chainCooldown: 10,
        lifeStealChance: 0.06,
        lifeStealAmount: 1,
        effects: '连锁闪电 + 吸血',
        sources: ['lightning', 'vampire'],
        status: '建议'
    },


    SWAMP: {
        id: 'swamp',
        name: '沼泽',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 0.65,
        interval: 30,
        speed: 6,
        radius: 14,
        color: '#46a20a',
        lifetime: 240,
        piercing: false,
        spawnMode: 'sky_drop',
        dropOffsetX: 10,
        dropOffsetY: 60,
        dropSpeed: 6,
        dropLifetime: 240,
        dropRadius: 14,
        poisonDuration: 900,
        poisonDamagePerStack: 0.05,
        effects: '顶落岩石 + 中毒',
        sources: ['poison', 'rock'],
        status: '建议'
    },

    TOXIC_SPIKE: {
        id: 'toxic_spike',
        name: '毒钉',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 3,
        interval: 90,
        speed: 7,
        radius: 6,
        color: '#60e060',
        lifetime: 120,
        piercing: false,
        poisonDuration: 900,
        poisonDamagePerStack: 0.05,
        effects: '高伤 + 中毒DOT',
        sources: ['poison', 'steel'],
        status: '建议'
    },

    LEY_BEAM: {
        id: 'ley_beam',
        name: '地脉束',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 0.8,
        interval: 30,
        speed: 8,
        radius: 12,
        color: '#c5750a',
        lifetime: 120,
        piercing: false,
        rayRange: 300,
        rayLength: 600,
        rayWidth: 10,
        terrainOnHit: {
            type: 'ridge',
            length: 90,
            width: 18,
            duration: 120,
            slowAmount: 0.3,
            slowDuration: 120
        },
        effects: '射线AOE + 岩脊带控场',
        sources: ['ray', 'rock'],
        status: '建议'
    },

    RAIL_BEAM: {
        id: 'rail_beam',
        name: '轨道束',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 3,
        interval: 90,
        speed: 7,
        radius: 12,
        color: '#e0b360',
        lifetime: 120,
        piercing: false,
        rayRange: 300,
        rayLength: 600,
        rayWidth: 10,
        effects: '射线AOE + 高伤',
        sources: ['ray', 'steel'],
        status: '建议'
    },

    RIFT_HAMMER: {
        id: 'rift_hammer',
        name: '裂地锤',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 3,
        interval: 90,
        speed: 6,
        radius: 14,
        color: '#a6836a',
        lifetime: 240,
        piercing: false,
        spawnMode: 'sky_drop',
        dropOffsetX: 10,
        dropOffsetY: 60,
        dropSpeed: 6,
        dropLifetime: 240,
        dropRadius: 14,
        effects: '顶落岩石',
        sources: ['rock', 'steel'],
        status: '建议'
    },

    SANDSTORM: {
        id: 'sandstorm',
        name: '砂暴',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 0.7,
        interval: 25,
        speed: 10,
        radius: 12,
        color: '#46a20a',
        lifetime: 120,
        piercing: true,
        aoeRadius: 80,
        aoeDamage: 0.8,
        effects: '穿透 + 圆形AOE',
        sources: ['rock', 'swift'],
        status: '建议'
    },

    BLOOD_QUAKE: {
        id: 'blood_quake',
        name: '血震',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 0.9,
        interval: 30,
        speed: 7,
        radius: 12,
        color: '#8b230a',
        lifetime: 120,
        piercing: false,
        aoeRadius: 80,
        aoeDamage: 0.8,
        lifeStealChance: 0.06,
        lifeStealAmount: 1,
        effects: '圆形AOE + 吸血',
        sources: ['rock', 'vampire'],
        status: '建议'
    },

    RAPID_LANCE: {
        id: 'rapid_lance',
        name: '疾枪',
        tier: WEAPON_TIER.EVOLUTION,
        damage: 3,
        interval: 90,
        speed: 9,
        radius: 6,
        color: '#60e060',
        lifetime: 120,
        piercing: true,
        effects: '穿透 + 高伤',
        sources: ['steel', 'swift'],
        status: '建议'
    },

};

/**
 * 武器ID与序号映射表
 */
export const WEAPON_ID_MAP = {
    BASIC: { id: 'basic', name: '普通弹珠', tier: WEAPON_TIER.INITIAL, order: 0 },
    FIRE: { id: 'fire', name: '火焰', tier: WEAPON_TIER.BASIC, order: 1 },
    FROST: { id: 'frost', name: '冰霜', tier: WEAPON_TIER.BASIC, order: 2 },
    SWIFT: { id: 'swift', name: '疾风', tier: WEAPON_TIER.BASIC, order: 3 },
    VAMPIRE: { id: 'vampire', name: '吸血', tier: WEAPON_TIER.BASIC, order: 4 },
    POISON: { id: 'poison', name: '剧毒', tier: WEAPON_TIER.BASIC, order: 5 },
    STEEL: { id: 'steel', name: '钢铁', tier: WEAPON_TIER.BASIC, order: 6 },
    DARK: { id: 'dark', name: '黑暗', tier: WEAPON_TIER.BASIC, order: 7 },
    LIGHTNING: { id: 'lightning', name: '闪电', tier: WEAPON_TIER.BASIC, order: 8 },
    LIGHT: { id: 'light', name: '光芒', tier: WEAPON_TIER.BASIC, order: 9 },
    ROCK: { id: 'rock', name: '岩石', tier: WEAPON_TIER.BASIC, order: 10 },
    GHOST: { id: 'ghost', name: '幽灵', tier: WEAPON_TIER.BASIC, order: 11 },
    RAY: { id: 'ray', name: '射线', tier: WEAPON_TIER.BASIC, order: 12 },
    CELL: { id: 'cell', name: '细胞', tier: WEAPON_TIER.BASIC, order: 13 },
    BLIZZARD: { id: 'blizzard', name: '暴风雪', tier: WEAPON_TIER.EVOLUTION, order: 14 },
    INFERNO: { id: 'inferno', name: '炼狱', tier: WEAPON_TIER.EVOLUTION, order: 15 },
    FROSTFIRE: { id: 'frostfire', name: '燃霜', tier: WEAPON_TIER.EVOLUTION, order: 16 },
    BOMB: { id: 'bomb', name: '炸弹', tier: WEAPON_TIER.EVOLUTION, order: 17 },
    STORM: { id: 'storm', name: '风暴', tier: WEAPON_TIER.EVOLUTION, order: 18 },
    POISON_MIST: { id: 'poison_mist', name: '毒雾', tier: WEAPON_TIER.EVOLUTION, order: 19 },
    PLAGUE: { id: 'plague', name: '瘟疫', tier: WEAPON_TIER.EVOLUTION, order: 26 },
    RADIATION_BEAM: { id: 'radiation_beam', name: '辐射射线', tier: WEAPON_TIER.EVOLUTION, order: 27 },
    OVERGROWTH: { id: 'overgrowth', name: '蔓延', tier: WEAPON_TIER.EVOLUTION, order: 28 },
    DARK_FLAME: { id: 'dark_flame', name: '暗焰', tier: WEAPON_TIER.EVOLUTION, order: 32 },
    FROST_CORROSION: { id: 'frost_corrosion', name: '怨灵', tier: WEAPON_TIER.EVOLUTION, order: 33 },
    SHADOW_WRAITH: { id: 'shadow_wraith', name: '恶灵', tier: WEAPON_TIER.EVOLUTION, order: 34 },
    ECLIPSE: { id: 'eclipse', name: '日蚀', tier: WEAPON_TIER.EVOLUTION, order: 35 },
    VOID_BEAM: { id: 'void_beam', name: '虚空射线', tier: WEAPON_TIER.EVOLUTION, order: 38 },
    CURSED_STONE: { id: 'cursed_stone', name: '暗蚀地带', tier: WEAPON_TIER.EVOLUTION, order: 39 },
    DARK_STEEL: { id: 'dark_steel', name: '黑钢', tier: WEAPON_TIER.EVOLUTION, order: 40 },
    SOUL_DRAIN: { id: 'soul_drain', name: '血咒', tier: WEAPON_TIER.EVOLUTION, order: 42 },
    GHOST_FIRE: { id: 'ghost_fire', name: '鬼火', tier: WEAPON_TIER.EVOLUTION, order: 43 },
    TOXIC_FLAME: { id: 'toxic_flame', name: '毒焰', tier: WEAPON_TIER.EVOLUTION, order: 46 },
    SOLAR_BEAM: { id: 'solar_beam', name: '太阳束', tier: WEAPON_TIER.EVOLUTION, order: 47 },
    LAVA: { id: 'lava', name: '熔岩', tier: WEAPON_TIER.EVOLUTION, order: 48 },
    FROST_WRAITH: { id: 'frost_wraith', name: '霜灵', tier: WEAPON_TIER.EVOLUTION, order: 50 },
    COLD_BEAM: { id: 'cold_beam', name: '寒束', tier: WEAPON_TIER.EVOLUTION, order: 54 },
    GLACIER: { id: 'glacier', name: '冰川', tier: WEAPON_TIER.EVOLUTION, order: 55 },
    ICE_SPIKE: { id: 'ice_spike', name: '冰锥', tier: WEAPON_TIER.EVOLUTION, order: 56 },
    HOLY_WISP: { id: 'holy_wisp', name: '圣灵', tier: WEAPON_TIER.EVOLUTION, order: 58 },
    PHANTOM_ARC: { id: 'phantom_arc', name: '幽电', tier: WEAPON_TIER.EVOLUTION, order: 59 },
    NETHER_STONE: { id: 'nether_stone', name: '幽冥石', tier: WEAPON_TIER.EVOLUTION, order: 62 },
    RADIANT_ARC: { id: 'radiant_arc', name: '闪耀电弧', tier: WEAPON_TIER.EVOLUTION, order: 66 },
    SUN_LANCE: { id: 'sun_lance', name: '日光矛', tier: WEAPON_TIER.EVOLUTION, order: 68 },
    CRYSTAL_GLOW: { id: 'crystal_glow', name: '晶耀', tier: WEAPON_TIER.EVOLUTION, order: 69 },
    HOLY_HAMMER: { id: 'holy_hammer', name: '圣锤', tier: WEAPON_TIER.EVOLUTION, order: 70 },
    FLASH_STRIKE: { id: 'flash_strike', name: '闪袭', tier: WEAPON_TIER.EVOLUTION, order: 71 },
    BLOOD_GLOW: { id: 'blood_glow', name: '血辉', tier: WEAPON_TIER.EVOLUTION, order: 72 },
    THUNDER_GRIT: { id: 'thunder_grit', name: '雷砾', tier: WEAPON_TIER.EVOLUTION, order: 75 },
    MAG_RAIL: { id: 'mag_rail', name: '磁轨', tier: WEAPON_TIER.EVOLUTION, order: 76 },
    LEECH_ARC: { id: 'leech_arc', name: '吸雷链', tier: WEAPON_TIER.EVOLUTION, order: 77 },
    SWAMP: { id: 'swamp', name: '沼泽', tier: WEAPON_TIER.EVOLUTION, order: 79 },
    TOXIC_SPIKE: { id: 'toxic_spike', name: '毒钉', tier: WEAPON_TIER.EVOLUTION, order: 80 },
    LEY_BEAM: { id: 'ley_beam', name: '地脉束', tier: WEAPON_TIER.EVOLUTION, order: 82 },
    RAIL_BEAM: { id: 'rail_beam', name: '轨道束', tier: WEAPON_TIER.EVOLUTION, order: 83 },
    RIFT_HAMMER: { id: 'rift_hammer', name: '裂地锤', tier: WEAPON_TIER.EVOLUTION, order: 86 },
    SANDSTORM: { id: 'sandstorm', name: '砂暴', tier: WEAPON_TIER.EVOLUTION, order: 87 },
    BLOOD_QUAKE: { id: 'blood_quake', name: '血震', tier: WEAPON_TIER.EVOLUTION, order: 88 },
    RAPID_LANCE: { id: 'rapid_lance', name: '疾枪', tier: WEAPON_TIER.EVOLUTION, order: 89 }
};

/**
 * 武器合成表
 */
export const WEAPON_FUSION_TABLE = [{
        id: 'fusion_cell_poison',
        name: '瘟疫',
        materials: ['cell', 'poison'],
        result: 'plague',
        description: '由细胞与剧毒融合而成，效果：瘟疫扩散 + 持续DOT',
        tier: 1,
        icon: '🦠',
        status: '现有'
    },
    {
        id: 'fusion_cell_ray',
        name: '辐射射线',
        materials: ['cell', 'ray'],
        result: 'radiation_beam',
        description: '由细胞与射线融合而成，效果：射线AOE + 辐射易伤',
        tier: 1,
        icon: '☢️',
        status: '现有'
    },
    {
        id: 'fusion_cell_rock',
        name: '蔓延',
        materials: ['cell', 'rock'],
        result: 'overgrowth',
        description: '由细胞与岩石融合而成，效果：蔓延叠层 + 爆发AOE',
        tier: 1,
        icon: '🌱',
        status: '建议'
    },{
        id: 'fusion_dark_fire',
        name: '暗焰',
        materials: ['dark', 'fire'],
        result: 'dark_flame',
        description: '由黑暗与火焰融合而成，效果：燃烧DOT + 易伤',
        tier: 1,
        icon: '🔥',
        status: '建议'
    },
    {
        id: 'fusion_dark_frost',
        name: '怨灵',
        materials: ['dark', 'frost'],
        result: 'frost_corrosion',
        description: '由黑暗与冰霜融合而成，效果：冻结 + 诅咒',
        tier: 1,
        icon: '❄️',
        status: '建议'
    },
    {
        id: 'fusion_dark_ghost',
        name: '恶灵',
        materials: ['dark', 'ghost'],
        result: 'shadow_wraith',
        description: '由黑暗与幽灵融合而成，效果：穿透 + 诅咒',
        tier: 1,
        icon: '🌑',
        status: '建议'
    },
    {
        id: 'fusion_dark_light',
        name: '日蚀',
        materials: ['dark', 'light'],
        result: 'eclipse',
        description: '由黑暗与光芒融合而成，效果：致盲 + 易伤',
        tier: 1,
        icon: '✨',
        status: '建议'
    },{
        id: 'fusion_dark_poison',
        name: '瘟疫',
        materials: ['dark', 'poison'],
        result: 'plague',
        description: '由黑暗与剧毒融合而成，效果：瘟疫扩散 + 持续DOT',
        tier: 1,
        icon: '🦠',
        status: '现有'
    },
    {
        id: 'fusion_dark_ray',
        name: '虚空射线',
        materials: ['dark', 'ray'],
        result: 'void_beam',
        description: '由黑暗与射线融合而成，效果：射线AOE + 诅咒',
        tier: 1,
        icon: '🌑',
        status: '建议'
    },
    {
        id: 'fusion_dark_rock',
        name: '暗蚀地带',
        materials: ['dark', 'rock'],
        result: 'cursed_stone',
        description: '由黑暗与岩石融合而成，效果：圆形AOE + 诅咒',
        tier: 1,
        icon: '🪨',
        status: '建议'
    },
    {
        id: 'fusion_dark_steel',
        name: '黑钢',
        materials: ['dark', 'steel'],
        result: 'dark_steel',
        description: '由黑暗与钢铁融合而成，效果：高伤 + 易伤',
        tier: 1,
        icon: '✨',
        status: '建议'
    },{
        id: 'fusion_dark_vampire',
        name: '血咒',
        materials: ['dark', 'vampire'],
        result: 'soul_drain',
        description: '由黑暗与吸血融合而成，效果：诅咒',
        tier: 1,
        icon: '🩸',
        status: '建议'
    },
    {
        id: 'fusion_frostfire',
        name: '燃霜',
        materials: ['frost', 'fire'],
        result: 'frostfire',
        description: '冰霜与火焰的矛盾融合为燃霜',
        tier: 1,
        icon: '💠',
        status: '现有'
    },
    {
        id: 'fusion_fire_ghost',
        name: '鬼火',
        materials: ['fire', 'ghost'],
        result: 'ghost_fire',
        description: '由火焰与幽灵融合而成，效果：穿透 + 燃烧DOT',
        tier: 1,
        icon: '🔥',
        status: '建议'
    },{
        id: 'fusion_fire_poison',
        name: '毒焰',
        materials: ['fire', 'poison'],
        result: 'toxic_flame',
        description: '由火焰与剧毒融合而成，效果：燃烧DOT + 中毒DOT',
        tier: 1,
        icon: '🔥',
        status: '建议'
    },
    {
        id: 'fusion_fire_ray',
        name: '太阳束',
        materials: ['fire', 'ray'],
        result: 'solar_beam',
        description: '由火焰与射线融合而成，效果：射线AOE + 燃烧DOT',
        tier: 1,
        icon: '🔥',
        status: '建议'
    },
    {
        id: 'fusion_fire_rock',
        name: '熔岩',
        materials: ['fire', 'rock'],
        result: 'lava',
        description: '由火焰与岩石融合而成，效果：顶落岩石 + 燃烧',
        tier: 1,
        icon: '🌋',
        status: '建议'
    },
    {
        id: 'fusion_bomb',
        name: '炸弹',
        materials: ['steel', 'fire'],
        result: 'bomb',
        description: '钢铁的威力与火焰的爆炸融合为炸弹',
        tier: 1,
        icon: '💣',
        status: '现有'
    },
    {
        id: 'fusion_inferno',
        name: '炼狱',
        materials: ['swift', 'fire'],
        result: 'inferno',
        description: '疾风的穿透与火焰的灼烧融合为炼狱',
        tier: 1,
        icon: '🌋',
        status: '现有'
    },{
        id: 'fusion_frost_ghost',
        name: '霜灵',
        materials: ['frost', 'ghost'],
        result: 'frost_wraith',
        description: '由冰霜与幽灵融合而成，效果：穿透 + 冻结',
        tier: 1,
        icon: '❄️',
        status: '建议'
    },{
        id: 'fusion_frost_ray',
        name: '寒束',
        materials: ['frost', 'ray'],
        result: 'cold_beam',
        description: '由冰霜与射线融合而成，效果：射线AOE + 冻结',
        tier: 1,
        icon: '❄️',
        status: '建议'
    },
    {
        id: 'fusion_frost_rock',
        name: '冰川',
        materials: ['frost', 'rock'],
        result: 'glacier',
        description: '由冰霜与岩石融合而成，效果：顶落岩石 + 冻结',
        tier: 1,
        icon: '🧊',
        status: '建议'
    },
    {
        id: 'fusion_frost_steel',
        name: '冰锥',
        materials: ['frost', 'steel'],
        result: 'ice_spike',
        description: '由冰霜与钢铁融合而成，效果：冻结 + 碎冰倍伤',
        tier: 1,
        icon: '🧊',
        status: '现有'
    },
    {
        id: 'fusion_blizzard',
        name: '暴风雪',
        materials: ['swift', 'frost'],
        result: 'blizzard',
        description: '疾风的速度与冰霜的寒冷融合为暴风雪',
        tier: 1,
        icon: '🌨️',
        status: '现有'
    },{
        id: 'fusion_ghost_light',
        name: '圣灵',
        materials: ['ghost', 'light'],
        result: 'holy_wisp',
        description: '由幽灵与光芒融合而成，效果：致盲 + 穿透',
        tier: 1,
        icon: '✨',
        status: '建议'
    },
    {
        id: 'fusion_ghost_lightning',
        name: '幽电',
        materials: ['ghost', 'lightning'],
        result: 'phantom_arc',
        description: '由幽灵与闪电融合而成，效果：连锁闪电 + 穿透',
        tier: 1,
        icon: '⚡',
        status: '建议'
    },
    {
        id: 'fusion_ghost_poison',
        name: '瘟疫',
        materials: ['ghost', 'poison'],
        result: 'plague',
        description: '由幽灵与剧毒融合而成，效果：瘟疫扩散 + 持续DOT',
        tier: 1,
        icon: '🦠',
        status: '现有'
    },
    {
        id: 'fusion_ghost_ray',
        name: '辐射射线',
        materials: ['ghost', 'ray'],
        result: 'radiation_beam',
        description: '由幽灵与射线融合而成，效果：射线AOE + 辐射易伤',
        tier: 1,
        icon: '☢️',
        status: '现有'
    },
    {
        id: 'fusion_ghost_rock',
        name: '幽冥石',
        materials: ['ghost', 'rock'],
        result: 'nether_stone',
        description: '由幽灵与岩石融合而成，效果：顶落岩石 + 岩脊带控场 + 穿透',
        tier: 1,
        icon: '🪨',
        status: '建议'
    },{
        id: 'fusion_light_lightning',
        name: '闪耀电弧',
        materials: ['light', 'lightning'],
        result: 'radiant_arc',
        description: '由光芒与闪电融合而成，效果：连锁闪电 + 致盲',
        tier: 1,
        icon: '⚡',
        status: '建议'
    },{
        id: 'fusion_light_ray',
        name: '日光矛',
        materials: ['light', 'ray'],
        result: 'sun_lance',
        description: '由光芒与射线融合而成，效果：致盲 + 射线AOE',
        tier: 1,
        icon: '✨',
        status: '建议'
    },
    {
        id: 'fusion_light_rock',
        name: '晶耀',
        materials: ['light', 'rock'],
        result: 'crystal_glow',
        description: '由光芒与岩石融合而成，效果：顶落岩石 + 岩脊带控场 + 致盲',
        tier: 1,
        icon: '✨',
        status: '建议'
    },
    {
        id: 'fusion_light_steel',
        name: '圣锤',
        materials: ['light', 'steel'],
        result: 'holy_hammer',
        description: '由光芒与钢铁融合而成，效果：高伤 + 致盲',
        tier: 1,
        icon: '✨',
        status: '建议'
    },
    {
        id: 'fusion_light_swift',
        name: '闪袭',
        materials: ['light', 'swift'],
        result: 'flash_strike',
        description: '由光芒与疾风融合而成，效果：穿透 + 致盲',
        tier: 1,
        icon: '⚡',
        status: '建议'
    },
    {
        id: 'fusion_light_vampire',
        name: '血辉',
        materials: ['light', 'vampire'],
        result: 'blood_glow',
        description: '由光芒与吸血融合而成，效果：致盲 + 吸血',
        tier: 1,
        icon: '✨',
        status: '建议'
    },{
        id: 'fusion_lightning_rock',
        name: '雷砾',
        materials: ['lightning', 'rock'],
        result: 'thunder_grit',
        description: '由闪电与岩石融合而成，效果：顶落岩石 + 岩脊带控场',
        tier: 1,
        icon: '⚡',
        status: '建议'
    },
    {
        id: 'fusion_lightning_steel',
        name: '磁轨',
        materials: ['lightning', 'steel'],
        result: 'mag_rail',
        description: '由闪电与钢铁融合而成，效果：高伤 + 连锁闪电',
        tier: 1,
        icon: '⚡',
        status: '建议'
    },
    {
        id: 'fusion_storm',
        name: '风暴',
        materials: ['swift', 'lightning'],
        result: 'storm',
        description: '疾风的穿透与闪电的连锁融合为风暴',
        tier: 1,
        icon: '⛈️',
        status: '现有'
    },
    {
        id: 'fusion_lightning_vampire',
        name: '吸雷链',
        materials: ['lightning', 'vampire'],
        result: 'leech_arc',
        description: '由闪电与吸血融合而成，效果：连锁闪电 + 吸血',
        tier: 1,
        icon: '⚡',
        status: '建议'
    },
    {
        id: 'fusion_poison_ray',
        name: '辐射射线',
        materials: ['poison', 'ray'],
        result: 'radiation_beam',
        description: '由剧毒与射线融合而成，效果：射线AOE + 辐射易伤',
        tier: 1,
        icon: '☢️',
        status: '现有'
    },
    {
        id: 'fusion_poison_rock',
        name: '沼泽',
        materials: ['poison', 'rock'],
        result: 'swamp',
        description: '由剧毒与岩石融合而成，效果：顶落岩石 + 中毒',
        tier: 1,
        icon: '☠️',
        status: '建议'
    },
    {
        id: 'fusion_poison_steel',
        name: '毒钉',
        materials: ['poison', 'steel'],
        result: 'toxic_spike',
        description: '由剧毒与钢铁融合而成，效果：高伤 + 中毒DOT',
        tier: 1,
        icon: '☠️',
        status: '建议'
    },
    {
        id: 'fusion_poison_mist',
        name: '毒雾',
        materials: ['swift', 'poison'],
        result: 'poison_mist',
        description: '疾风的穿透与剧毒的毒素融合为毒雾',
        tier: 1,
        icon: '☁️',
        status: '现有'
    },
    {
        id: 'fusion_poison_vampire',
        name: '瘟疫',
        materials: ['poison', 'vampire'],
        result: 'plague',
        description: '由剧毒与吸血融合而成，效果：瘟疫扩散 + 持续DOT',
        tier: 1,
        icon: '🦠',
        status: '现有'
    },
    {
        id: 'fusion_ray_rock',
        name: '地脉束',
        materials: ['ray', 'rock'],
        result: 'ley_beam',
        description: '由射线与岩石融合而成，效果：射线AOE + 岩脊带控场',
        tier: 1,
        icon: '📡',
        status: '建议'
    },
    {
        id: 'fusion_ray_steel',
        name: '轨道束',
        materials: ['ray', 'steel'],
        result: 'rail_beam',
        description: '由射线与钢铁融合而成，效果：射线AOE + 高伤',
        tier: 1,
        icon: '🔦',
        status: '建议'
    },{
        id: 'fusion_rock_steel',
        name: '裂地锤',
        materials: ['rock', 'steel'],
        result: 'rift_hammer',
        description: '由岩石与钢铁融合而成，效果：顶落岩石',
        tier: 1,
        icon: '🔨',
        status: '建议'
    },
    {
        id: 'fusion_rock_swift',
        name: '砂暴',
        materials: ['rock', 'swift'],
        result: 'sandstorm',
        description: '由岩石与疾风融合而成，效果：穿透 + 圆形AOE',
        tier: 1,
        icon: '🗡️',
        status: '建议'
    },
    {
        id: 'fusion_rock_vampire',
        name: '血震',
        materials: ['rock', 'vampire'],
        result: 'blood_quake',
        description: '由岩石与吸血融合而成，效果：圆形AOE + 吸血',
        tier: 1,
        icon: '🩸',
        status: '建议'
    },
    {
        id: 'fusion_steel_swift',
        name: '疾枪',
        materials: ['steel', 'swift'],
        result: 'rapid_lance',
        description: '由钢铁与疾风融合而成，效果：穿透 + 高伤',
        tier: 1,
        icon: '🗡️',
        status: '建议'
    }
];

export const WEAPON_ICON_MAP = {
    blizzard: '🌨️',
    blood_glow: '✨',
    blood_quake: '🩸',
    bomb: '💣',
    cell: '🧬',
    cold_beam: '❄️',
    cursed_stone: '🪨',
    dark: '🌑',
    dark_flame: '🔥',
    dark_steel: '✨',
    rift_hammer: '🔨',
    eclipse: '✨',
    fire: '🔥',
    flash_strike: '⚡',
    crystal_glow: '✨',
    frost: '❄️',
    frost_corrosion: '❄️',
    frost_wraith: '❄️',
    frostfire: '💠',
    ghost: '👻',
    ghost_fire: '🔥',
    glacier: '🧊',
    holy_hammer: '✨',
    holy_wisp: '✨',
    ice_spike: '🧊',
    inferno: '🌋',
    leech_arc: '⚡',
    light: '✨',
    lightning: '⚡',
    mag_rail: '⚡',
    lava: '🌋',
    phantom_arc: '⚡',
    poison: '☠️',
    poison_mist: '☁️',
    radiant_arc: '⚡',
    rail_beam: '🔦',
    rapid_lance: '🗡️',
    ray: '📡',

    radiation_beam: '☢️',
    rock: '🪨',
    overgrowth: '🌱',
    sandstorm: '🗡️',
    shadow_wraith: '🌑',
    ley_beam: '📡',
    solar_beam: '🔥',
    soul_drain: '🩸',
    nether_stone: '🪨',
    steel: '🔩',
    storm: '⛈️',
    sun_lance: '✨',
    swift: '💨',
    thunder_grit: '⚡',
    swamp: '☠️',
    toxic_flame: '🔥',
    toxic_spike: '☠️',
    plague: '🦠',
    vampire: '🩸',
    void_beam: '🌑'
};



/**
 * 工具函数
 */
export function getWeaponInfo(weaponId) {
    for (const key in WEAPON_ID_MAP) {
        if (WEAPON_ID_MAP[key].id === weaponId) {
            return WEAPON_ID_MAP[key];
        }
    }
    return null;
}

export function getWeaponIdByOrder(order) {
    for (const key in WEAPON_ID_MAP) {
        if (WEAPON_ID_MAP[key].order === order) {
            return WEAPON_ID_MAP[key].id;
        }
    }
    return null;
}

export function getAvailableFusions(playerWeapons) {
    const availableFusions = [];
    const playerWeaponIds = playerWeapons
        .filter(w => w && w.def && !(w.def.isFusion || w.def.tier === WEAPON_TIER.FUSION))
        .map(w => w.def.id);

    for (const recipe of WEAPON_FUSION_TABLE) {
        const hasAllMaterials = recipe.materials.every(materialId => {
            return playerWeaponIds.includes(materialId);
        });

        if (hasAllMaterials) {
            // 合成限制：合成后武器数不超过4个 (原逻辑)
            const afterFusionCount = playerWeapons.length - recipe.materials.length + 1;
            if (afterFusionCount <= 4) {
                availableFusions.push(recipe);
            }
        }
    }

    return availableFusions;
}

export function performFusion(playerWeapons, recipe) {
    const playerWeaponIds = playerWeapons.map(w => w.def.id);
    const hasAllMaterials = recipe.materials.every(materialId => {
        return playerWeaponIds.includes(materialId);
    });

    if (!hasAllMaterials) {
        return { success: false, message: '材料不足', newWeapon: null };
    }

    // 移除材料
    const materialsToRemove = [...recipe.materials];
    for (let i = playerWeapons.length - 1; i >= 0; i--) {
        const weaponId = playerWeapons[i].def.id;
        const materialIndex = materialsToRemove.indexOf(weaponId);

        if (materialIndex !== -1) {
            playerWeapons.splice(i, 1);
            materialsToRemove.splice(materialIndex, 1);
            if (materialsToRemove.length === 0) break;
        }
    }

    // 添加结果
    const resultWeaponKey = Object.keys(WEAPONS).find(
        key => WEAPONS[key].id === recipe.result
    );

    if (!resultWeaponKey) {
        return { success: false, message: '合成结果武器不存在', newWeapon: null };
    }

    const resultWeaponDef = WEAPONS[resultWeaponKey];

    const newWeapon = {
        def: resultWeaponDef,
        name: resultWeaponDef.name,
        color: resultWeaponDef.color,
        cooldown: 0
    };

    playerWeapons.push(newWeapon);

    return {
        success: true,
        message: `成功合成 ${resultWeaponDef.name}！`,
        newWeapon: newWeapon
    };
}



