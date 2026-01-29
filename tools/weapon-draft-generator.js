import fs from 'fs';
import { WEAPONS, WEAPON_TIER, WEAPON_FUSION_TABLE } from '../js/weapons/WeaponsData.js';

export const NAME_TO_ID = {
    '鍐板睉缇?: 'ice_shard_swarm',
    '鍐板窛闇?: 'glacier',
    '鍐版瘨': 'ice_toxin',
    '鍐扮數閾?: 'ice_chain',
    '鍚告瘨': 'leech_toxin',
    '鍚搁浄閾?: 'leech_arc',
    '鍦ｇ伒': 'holy_wisp',
    '鍦ｉ敜': 'holy_hammer',
    '澶滃垉': 'night_blade',
    '澶槼鏉?: 'solar_beam',
    '瀵掓潫': 'cold_beam',
    '瀵掗瓌鍚?: 'frost_leech',
    '钄撳欢': 'overgrowth',
    '骞藉垉': 'phantom_blade',
    '骞界數': 'phantom_arc',
    '骞界兢': 'wraith_swarm',
    '鎭剁伒': 'shadow_wraith',
    '褰辩柧': 'shadow_rush',
    '鏃ュ厜鐭?: 'sun_lance',
    '鏃ヨ殌': 'eclipse',
    '鏅舵牸鏉?: 'lattice_beam',
    '鏆楀缇?: 'dark_spore_swarm',
    '鏆楃劙': 'dark_flame',
    '妫卞厜缇?: 'prism_swarm',
    '姣掑缇?: 'toxic_spore_swarm',
    '姣掔伒': 'toxic_wraith',
    '姣掔劙': 'toxic_flame',
    '姣掔垎': 'swamp',
    '姣掔數閾?: 'venom_arc',
    '姣掔湬': 'toxic_daze',
    '姣掗拤': 'toxic_spike',
    '琛€鍜?: 'soul_drain',
    '鐏靛博': 'nether_stone',
    '鐐庡缇?: 'flame_spore_swarm',
    '鐔斿博鐖?: 'lava',
    '鐢靛缇?: 'spark_spore_swarm',
    '鐤拻': 'plague_curse',
    '鐤惧厜鏉?: 'rapid_beam',
    '鐤炬灙': 'rapid_lance',
    '鐧芥檿': 'white_halo',
    '鐩镐綅鏉?: 'phase_beam',
    '鐪╁厜鐒?: 'dazzle_flame',
    '鐮傛毚': 'sandstorm',
    '鐮村啺閿?: 'icebreaker_hammer',
    '鐮寸墖鏍?: 'shrapnel_core',
    '纾佽建': 'mag_rail',
    '绂诲瓙鏉?: 'ion_beam',
    '绛夌鐏摼': 'plasma_chain',
    '铏氱┖灏勭嚎': 'void_beam',
    '铏氶浄': 'void_thunder',
    '琛€瀛㈢兢': 'blood_spore_swarm',
    '琛€褰?: 'blood_wraith',
    '琛€鏉?: 'blood_beam',
    '琛€妲?: 'blood_hammer',
    '琛€鐒?: 'blood_flame',
    '琛€杈?: 'blood_glow',
    '琛€闇?: 'blood_quake',
    '瑁傚湴閿?: 'rift_hammer',
    '瑁傞缇?: 'split_wind_swarm',
    '鏆楄殌鍦板甫': 'cursed_stone',
    '杞ㄩ亾鏉?: 'rail_beam',
    '杩呭惛': 'swift_leech',
    '閰告潫': 'acid_beam',
    '闂厜寮?: 'crystal_glow',
    '闂€€鐢靛姬': 'radiant_arc',
    '闂': 'flash_strike',
    '闆烽渿': 'thunder_grit',
    '闇囪崱鏉?: 'ley_beam',
    '闇滅伒': 'frost_wraith',
    '鎬ㄧ伒': 'frost_corrosion',
    '楝肩伀': 'ghost_fire',
    '榛戦挗': 'dark_steel'
};

const REQUIRED_COLUMNS = [
    '鏉愭枡A_ID', '鏉愭枡A_鍚嶇О',
    '鏉愭枡B_ID', '鏉愭枡B_鍚嶇О',
    '杩涘寲姝﹀櫒_ID', '杩涘寲姝﹀櫒_鍚嶇О',
    '杩涘寲姝﹀櫒_鐗规畩鏁堟灉', '鐘舵€?
];

const OPTIONAL_FIELDS = [
    'burnDuration', 'burnDamagePerFrame', 'burnColor',
    'freezeChance', 'freezeDuration', 'vulnerability',
    'lifeStealChance', 'lifeStealAmount',
    'poisonDuration', 'poisonDamagePerStack',
    'chainCount', 'chainRange', 'chainCooldown',
    'blindChance', 'blindDuration',
    'aoeRadius', 'aoeDamage',
    'rayRange', 'rayLength', 'rayWidth',
    'canSplit', 'splitCount', 'splitRange',
    'explosionRadius', 'explosionDamage',
    'overgrowthDuration', 'overgrowthTriggerStacks',
    'overgrowthExplosionRadius', 'overgrowthExplosionMultiplier'
];

function stripBom(value) {
    return value.startsWith('\ufeff') ? value.slice(1) : value;
}

function parseCsvLine(line) {
    const out = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
            const next = line[i + 1];
            if (inQuotes && next === '"') {
                cur += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (ch === ',' && !inQuotes) {
            out.push(cur);
            cur = '';
        } else {
            cur += ch;
        }
    }
    out.push(cur);
    return out;
}

function parseCsv(csvText) {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length === 0) {
        throw new Error('CSV is empty.');
    }
    const header = parseCsvLine(stripBom(lines[0]));
    const rows = lines.slice(1).map(parseCsvLine).map(row => {
        while (row.length < header.length) {
            row.push('');
        }
        return row;
    });
    return { header, rows };
}

function buildColumnIndex(header) {
    const index = new Map(header.map((name, i) => [name, i]));
    for (const key of REQUIRED_COLUMNS) {
        if (!index.has(key)) {
            throw new Error(`Missing column: ${key}`);
        }
    }
    return index;
}

function buildExistingMaps(fusionTable) {
    const byResult = new Map();
    const byPair = new Map();
    for (const recipe of fusionTable) {
        if (!recipe) continue;
        if (recipe.result) byResult.set(recipe.result, recipe);
        if (Array.isArray(recipe.materials) && recipe.materials.length === 2) {
            const key = [...recipe.materials].sort().join('+');
            byPair.set(key, recipe);
        }
    }
    return { byResult, byPair };
}

function ensureUniqueNameMapping(nameToId, existingWeapons) {
    const values = Object.values(nameToId);
    const unique = new Set(values);
    if (unique.size !== values.length) {
        throw new Error('Duplicate IDs in NAME_TO_ID mapping.');
    }
}

function ensureResultId(nameToId, name) {
    const id = nameToId[name];
    if (!id) {
        throw new Error(`Missing english ID mapping for name: ${name}`);
    }
    return id;
}

function pickIcon(name, effects) {
    const text = `${name} ${effects}`;
    if (/[鐏劙鐐庣噧鐑/.test(text)) return '馃敟';
    if (/[鍐伴湝闆喕缁揮/.test(text)) return '鉂勶笍';
    if (/[姣掔槦鐤腑姣抅/.test(text)) return '鈽狅笍';
    if (/[闆风數闂摼]/.test(text)) return '鈿?;
    if (/[鍏夎€€鏃ヨ緣鐪╄嚧鐩瞉/.test(text)) return '鉁?;
    if (/[琛€鍚歌]/.test(text)) return '馃└';
    if (/[鐖嗙偢]/.test(text)) return '馃挜';
    if (/[宀╃煶闇嘳/.test(text)) return '馃';
    if (/[褰辨殫铏氳瘏]/.test(text)) return '馃寫';
    if (/[鐏甸瓊楝煎菇]/.test(text)) return '馃懟';
    if (/[灏勭嚎鏉熺煕]/.test(text)) return '馃敠';
    if (/[瑁傚缇ゅ垎瑁俔/.test(text)) return '馃К';
    if (/[绌块€廬/.test(text)) return '馃棥锔?;
    return '鉁?;
}

function hexToRgb(hex) {
    const value = hex.replace('#', '').trim();
    if (value.length !== 6) return null;
    const r = Number.parseInt(value.slice(0, 2), 16);
    const g = Number.parseInt(value.slice(2, 4), 16);
    const b = Number.parseInt(value.slice(4, 6), 16);
    return { r, g, b };
}

function rgbToHex({ r, g, b }) {
    const toHex = (n) => n.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function blendColor(aColor, bColor) {
    const a = hexToRgb(aColor || '#ffffff');
    const b = hexToRgb(bColor || '#ffffff');
    if (!a || !b) return aColor || bColor || '#ffffff';
    return rgbToHex({
        r: Math.round((a.r + b.r) / 2),
        g: Math.round((a.g + b.g) / 2),
        b: Math.round((a.b + b.b) / 2)
    });
}

function roundNumber(value, digits = 2) {
    const factor = 10 ** digits;
    return Math.round(value * factor) / factor;
}

function getWeaponById(weapons, id) {
    return Object.values(weapons).find(weapon => weapon.id === id) || null;
}

function applyIfMissing(target, key, value) {
    if (target[key] === undefined) {
        target[key] = value;
    }
}

function buildSuggestedWeaponDefinition(aWeapon, bWeapon, effects, name, id) {
    const has = (keyword) => effects.includes(keyword);
    const avg = (a, b) => (a + b) / 2;

    let damage = avg(aWeapon.damage, bWeapon.damage);
    let interval = Math.round(avg(aWeapon.interval, bWeapon.interval));
    let speed = roundNumber(avg(aWeapon.speed, bWeapon.speed), 2);
    let radius = Math.max(aWeapon.radius, bWeapon.radius);
    let lifetime = Math.max(aWeapon.lifetime, bWeapon.lifetime);
    let piercing = aWeapon.piercing || bWeapon.piercing || has('绌块€?);

    if (has('楂橀€?)) {
        speed = Math.max(aWeapon.speed, bWeapon.speed) + 2;
        interval = Math.max(10, Math.round(interval * 0.9));
    }

    if (has('楂樹激')) {
        damage = Math.max(aWeapon.damage, bWeapon.damage);
        interval = Math.max(aWeapon.interval, bWeapon.interval);
    }

    if (has('鐖嗙偢AOE') || has('鍦嗗舰AOE') || has('灏勭嚎AOE') || has('杩為攣闂數') || has('鍒嗚瀛愬脊')) {
        radius = Math.max(radius, 12);
    }

    const def = {
        id,
        name,
        tier: WEAPON_TIER.EVOLUTION,
        damage: roundNumber(damage, 2),
        interval,
        speed: roundNumber(speed, 2),
        radius,
        color: blendColor(aWeapon.color, bWeapon.color),
        lifetime,
        piercing
    };

    if (has('鐕冪儳')) {
        applyIfMissing(def, 'burnDuration', 300);
        applyIfMissing(def, 'burnDamagePerFrame', roundNumber(5 / 60, 6));
    }

    if (has('鍐荤粨')) {
        applyIfMissing(def, 'freezeChance', 0.3);
        applyIfMissing(def, 'freezeDuration', 120);
    }

    if (has('涓瘨')) {
        applyIfMissing(def, 'poisonDuration', 900);
        applyIfMissing(def, 'poisonDamagePerStack', roundNumber(3 / 60, 6));
    }

    if (has('鑷寸洸')) {
        applyIfMissing(def, 'blindChance', 0.5);
        applyIfMissing(def, 'blindDuration', 180);
    }

    if (has('鏄撲激')) {
        applyIfMissing(def, 'vulnerability', 0.25);
    }

    if (has('鍚歌')) {
        applyIfMissing(def, 'lifeStealChance', 0.06);
        applyIfMissing(def, 'lifeStealAmount', 1);
    }

    if (has('杩為攣闂數')) {
        applyIfMissing(def, 'chainCount', 3);
        applyIfMissing(def, 'chainRange', 150);
        applyIfMissing(def, 'chainCooldown', 10);
    }

    if (has('鐖嗙偢AOE')) {
        applyIfMissing(def, 'explosionRadius', 100);
        applyIfMissing(def, 'explosionDamage', 2.0);
    }

    if (has('鍦嗗舰AOE')) {
        applyIfMissing(def, 'aoeRadius', 80);
        applyIfMissing(def, 'aoeDamage', 0.8);
    }

    if (has('灏勭嚎AOE')) {
        applyIfMissing(def, 'rayRange', 300);
        applyIfMissing(def, 'rayLength', 600);
        applyIfMissing(def, 'rayWidth', 10);
    }

    if (has('鍒嗚瀛愬脊')) {
        applyIfMissing(def, 'canSplit', true);
        applyIfMissing(def, 'splitCount', 2);
        applyIfMissing(def, 'splitRange', 200);
    }

    return def;
}

function escapeString(value) {
    return String(value)
        .replace(/\\/g, '\\\\')
        .replace(/'/g, '\\\'');
}

function formatFusionDraftModule(fusionDraft) {
    const lines = [];
    lines.push('// 鑷姩鐢熸垚锛歸eapon_fusion_suggestions.csv -> WEAPON_FUSION_TABLE 鑽夋');
    lines.push('// 璇存槑锛歳esult 涓烘柊姝﹀櫒 ID 鏃讹紝璇峰湪 WEAPONS 涓ˉ鍏呭畾涔?);
    lines.push('export const WEAPON_FUSION_TABLE_DRAFT = [');
    for (const item of fusionDraft) {
        lines.push('    {');
        lines.push(`        id: '${escapeString(item.id)}',`);
        lines.push(`        name: '${escapeString(item.name)}',`);
        lines.push(`        materials: ['${item.materials[0]}', '${item.materials[1]}'],`);
        lines.push(`        result: '${escapeString(item.result)}',`);
        lines.push(`        description: '${escapeString(item.description)}',`);
        lines.push(`        tier: ${item.tier},`);
        lines.push(`        icon: '${escapeString(item.icon)}',`);
        lines.push(`        status: '${escapeString(item.status)}'`);
        lines.push('    },');
    }
    lines.push('];');
    return lines.join('\n');
}

function formatEvolutionDraftModule(evolutionDraft) {
    const lines = [];
    lines.push('// 鑷姩鐢熸垚锛歸eapon_fusion_suggestions.csv -> Evolution 姝﹀櫒鑽夋');
    lines.push('// 璇存槑锛歴tatus=寤鸿 鐨勬潯鐩槸鏍规嵁鏉愭枡鍜屾晥鏋滅殑鑽夋鍙傛暟');
    lines.push('// 鎻愮ず锛歵ier 褰撳墠涓烘暟鍊?2锛屽搴?WEAPON_TIER.EVOLUTION');
    lines.push('export const WEAPON_EVOLUTION_DRAFT = [');
    for (const weapon of evolutionDraft) {
        lines.push('    {');
        lines.push(`        id: '${escapeString(weapon.id)}',`);
        lines.push(`        name: '${escapeString(weapon.name)}',`);
        lines.push(`        tier: ${weapon.tier},`);
        lines.push(`        damage: ${weapon.damage},`);
        lines.push(`        interval: ${weapon.interval},`);
        lines.push(`        speed: ${weapon.speed},`);
        lines.push(`        radius: ${weapon.radius},`);
        lines.push(`        color: '${escapeString(weapon.color)}',`);
        lines.push(`        lifetime: ${weapon.lifetime},`);
        lines.push(`        piercing: ${weapon.piercing ? 'true' : 'false'},`);

        for (const field of OPTIONAL_FIELDS) {
            if (weapon[field] !== undefined) {
                const value = typeof weapon[field] === 'string' ? `'${escapeString(weapon[field])}'` : weapon[field];
                lines.push(`        ${field}: ${value},`);
            }
        }

        lines.push(`        effects: '${escapeString(weapon.effects)}',`);
        lines.push(`        sources: ['${weapon.sources[0]}', '${weapon.sources[1]}'],`);
        lines.push(`        status: '${escapeString(weapon.status)}'`);
        lines.push('    },');
    }
    lines.push('];');
    return lines.join('\n');
}

export function generateDraftsFromCsv({
    csvText,
    weapons = WEAPONS,
    fusionTable = WEAPON_FUSION_TABLE,
    nameToId = NAME_TO_ID
}) {
    const { header, rows } = parseCsv(csvText);
    const columnIndex = buildColumnIndex(header);
    const { byResult, byPair } = buildExistingMaps(fusionTable);
    const weaponsArray = Object.values(weapons);

    ensureUniqueNameMapping(nameToId, weaponsArray);

    const fusionDraft = [];
    const evolutionDraft = new Map();

    for (const row of rows) {
        const aId = row[columnIndex.get('鏉愭枡A_ID')]?.trim();
        const aName = row[columnIndex.get('鏉愭枡A_鍚嶇О')]?.trim();
        const bId = row[columnIndex.get('鏉愭枡B_ID')]?.trim();
        const bName = row[columnIndex.get('鏉愭枡B_鍚嶇О')]?.trim();
        const csvResultId = row[columnIndex.get('杩涘寲姝﹀櫒_ID')]?.trim();
        const resultName = row[columnIndex.get('杩涘寲姝﹀櫒_鍚嶇О')]?.trim();
        const resultEffects = row[columnIndex.get('杩涘寲姝﹀櫒_鐗规畩鏁堟灉')]?.trim();
        const csvStatus = row[columnIndex.get('鐘舵€?)]?.trim();

        if (!aId || !bId) continue;

        const pairKey = [aId, bId].sort().join('+');
        const existing = byPair.get(pairKey) || (csvResultId ? byResult.get(csvResultId) : null);
        const materials = existing?.materials ?? [aId, bId].sort();

        const finalResultId = existing?.result || csvResultId || ensureResultId(nameToId, resultName);
        const finalName = existing?.name || resultName || `${aName}+${bName}`;
        const finalEffects = resultEffects || '';
        const finalDesc = existing?.description || `鐢?{aName}涓?{bName}铻嶅悎鑰屾垚锛屾晥鏋滐細${finalEffects}`;
        const finalIcon = existing?.icon || pickIcon(finalName, finalEffects);
        const status = existing ? '鐜版湁' : (csvStatus || '寤鸿');

        const fusionId = existing?.id || `fusion_${materials.join('_')}`;

        fusionDraft.push({
            id: fusionId,
            name: finalName,
            materials,
            result: finalResultId,
            description: finalDesc,
            tier: existing?.tier ?? 1,
            icon: finalIcon,
            status
        });

        if (!evolutionDraft.has(finalResultId)) {
            const existingWeapon = getWeaponById(weapons, finalResultId);
            if (existingWeapon) {
                evolutionDraft.set(finalResultId, {
                    ...existingWeapon,
                    effects: finalEffects,
                    sources: materials,
                    status: '鐜版湁'
                });
            } else {
                const aWeapon = getWeaponById(weapons, aId);
                const bWeapon = getWeaponById(weapons, bId);
                if (!aWeapon || !bWeapon) {
                    throw new Error(`Missing material definition for ${aId} or ${bId}`);
                }
                const definition = buildSuggestedWeaponDefinition(
                    aWeapon,
                    bWeapon,
                    finalEffects,
                    finalName,
                    finalResultId
                );
                evolutionDraft.set(finalResultId, {
                    ...definition,
                    effects: finalEffects,
                    sources: materials,
                    status: '寤鸿'
                });
            }
        }
    }

    return {
        fusionDraft,
        evolutionDraft: Array.from(evolutionDraft.values())
    };
}

export function generateDraftFiles({
    csvPath = 'weapon_fusion_suggestions.csv',
    fusionOutPath = 'weapon_fusion_table_draft.js',
    evolutionOutPath = 'weapon_evolution_draft.js',
    weapons = WEAPONS,
    fusionTable = WEAPON_FUSION_TABLE,
    nameToId = NAME_TO_ID
} = {}) {
    const csvText = fs.readFileSync(csvPath, 'utf8');
    const { fusionDraft, evolutionDraft } = generateDraftsFromCsv({
        csvText,
        weapons,
        fusionTable,
        nameToId
    });

    fs.writeFileSync(fusionOutPath, formatFusionDraftModule(fusionDraft), 'utf8');
    fs.writeFileSync(evolutionOutPath, formatEvolutionDraftModule(evolutionDraft), 'utf8');

    return {
        fusionCount: fusionDraft.length,
        evolutionCount: evolutionDraft.length
    };
}

