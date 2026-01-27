import { WEAPONS, WEAPON_FUSION_TABLE } from '../../js/weapons/WeaponsData.js';
import { generateDraftsFromCsv, NAME_TO_ID } from '../../tools/weapon-draft-generator.js';

const CSV_TEXT = `组合,材料A_ID,材料A_名称,材料A_参数,材料A_特殊效果,材料B_ID,材料B_名称,材料B_参数,材料B_特殊效果,进化武器_ID,进化武器_名称,进化武器_参数,进化武器_特殊效果,状态,备注
fire+swift,fire,火焰,,,swift,疾风,,,inferno,炼狱,,穿透 + 燃烧DOT,现有,
cell+dark,cell,细胞,,,dark,黑暗,,,,暗孢群,,分裂子弹 + 易伤,建议,`;

describe('weapon draft generator', () => {
    test('keeps existing evolution IDs for known recipes', () => {
        const { fusionDraft } = generateDraftsFromCsv({
            csvText: CSV_TEXT,
            weapons: WEAPONS,
            fusionTable: WEAPON_FUSION_TABLE
        });

        const inferno = fusionDraft.find(entry => entry.result === 'inferno');
        expect(inferno).toBeDefined();
        expect(inferno.status).toBe('现有');
    });

    test('uses existing recipe when fusion already defined and keeps key properties', () => {
        const { fusionDraft, evolutionDraft } = generateDraftsFromCsv({
            csvText: CSV_TEXT,
            weapons: WEAPONS,
            fusionTable: WEAPON_FUSION_TABLE
        });

        const expectedId = NAME_TO_ID['暗孢群'];
        const fusion = fusionDraft.find(entry => entry.name === '暗孢群');
        expect(fusion).toBeDefined();
        expect(fusion.result).toBe(expectedId);
        expect(fusion.status).toBe('现有');

        const evolution = evolutionDraft.find(entry => entry.id === expectedId);
        expect(evolution).toBeDefined();
        expect(evolution.damage).toBeDefined();
        expect(evolution.interval).toBeDefined();
        expect(evolution.speed).toBeDefined();
        expect(evolution.radius).toBeDefined();
        expect(evolution.color).toBeDefined();
        expect(evolution.lifetime).toBeDefined();
        expect(evolution.piercing).toBeDefined();
        expect(evolution.canSplit).toBe(true);
        expect(evolution.vulnerability).toBe(0.25);
        expect(evolution.status).toBe('现有');
    });
});
