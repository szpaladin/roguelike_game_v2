/**
 * 敌人数据定义
 */
export const ENEMY_TYPES = [
    {
        name: '史莱姆',
        hp: 50,
        maxHp: 50,
        attack: 2,
        defense: 0,
        exp: 5,
        gold: 2,
        color: '#00ff00',
        speed: 0.6,
        radius: 10
    },
    {
        name: '哥布林',
        hp: 150,
        maxHp: 150,
        attack: 5,
        defense: 1,
        exp: 10,
        gold: 5,
        color: '#00aa00',
        speed: 0.8,
        radius: 12
    },
    {
        name: '骷髅',
        hp: 300,
        maxHp: 300,
        attack: 8,
        defense: 2,
        exp: 20,
        gold: 10,
        color: '#cccccc',
        speed: 0.9,
        radius: 13
    },
    {
        name: '暗影',
        hp: 600,
        maxHp: 600,
        attack: 10,
        defense: 2,
        exp: 28,
        gold: 15,
        color: '#6600cc',
        speed: 1.0,
        radius: 14
    },
    {
        name: '恶魔',
        hp: 1000,
        maxHp: 1000,
        attack: 12,
        defense: 3,
        exp: 35,
        gold: 20,
        color: '#ff0000',
        speed: 1.0,
        radius: 14
    }
];

/**
 * 敌人生成配置
 * 根据距离逐步解锁更强的敌人
 */
export const ENEMY_SPAWN_CONFIG = {
    // 正式模式：循序渐进解锁敌人
    unlockThresholds: [
        { distance: 0, maxTier: 0 },      // 0距离：只有史莱姆
        { distance: 500, maxTier: 1 },    // 500距离：解锁哥布林
        { distance: 1500, maxTier: 2 },   // 1500距离：解锁骷髅
        { distance: 3000, maxTier: 3 },   // 3000距离：解锁暗影
        { distance: 5000, maxTier: 4 }    // 5000距离：解锁恶魔
    ]

    // 🧪 测试模式：快速解锁（调试时取消注释）
    // unlockThresholds: [
    //     { distance: 0, maxTier: 0 },
    //     { distance: 20, maxTier: 1 },
    //     { distance: 50, maxTier: 2 },
    //     { distance: 70, maxTier: 3 },
    //     { distance: 100, maxTier: 4 }
    // ]
};

/**
 * 根据索引获取敌人类型
 */
export function getEnemyType(index) {
    if (index >= 0 && index < ENEMY_TYPES.length) {
        return { ...ENEMY_TYPES[index] };
    }
    return null;
}

/**
 * 根据名称获取敌人类型
 */
export function getEnemyTypeByName(name) {
    const enemy = ENEMY_TYPES.find(e => e.name === name);
    return enemy ? { ...enemy } : null;
}

/**
 * 获取当前距离下可生成的最大敌人等级
 */
export function getMaxEnemyTier(distance) {
    for (let i = ENEMY_SPAWN_CONFIG.unlockThresholds.length - 1; i >= 0; i--) {
        if (distance >= ENEMY_SPAWN_CONFIG.unlockThresholds[i].distance) {
            return ENEMY_SPAWN_CONFIG.unlockThresholds[i].maxTier;
        }
    }
    return 0;
}

/**
 * 根据距离随机获取敌人类型
 */
export function getRandomEnemyType(distance) {
    const maxTier = getMaxEnemyTier(distance);
    const randomIndex = Math.floor(Math.random() * (maxTier + 1));
    return getEnemyType(randomIndex);
}
