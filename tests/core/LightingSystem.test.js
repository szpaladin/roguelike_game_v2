/**
 * LightingSystem 单元测试
 */
import LightingSystem from '../../js/core/LightingSystem.js';

describe('LightingSystem', () => {
    let lighting;

    beforeEach(() => {
        lighting = new LightingSystem();
    });

    describe('深度光照', () => {
        test('getDarknessAlpha 应该在0-1000m返回0', () => {
            expect(lighting.getDarknessAlpha(0)).toBe(0);
            expect(lighting.getDarknessAlpha(500)).toBe(0);
            expect(lighting.getDarknessAlpha(999)).toBe(0);
        });

        test('getDarknessAlpha 应该在1000-2500m返回0.2', () => {
            expect(lighting.getDarknessAlpha(1000)).toBe(0.2);
            expect(lighting.getDarknessAlpha(2000)).toBe(0.2);
        });

        test('getDarknessAlpha 应该在2500-5000m返回0.45', () => {
            expect(lighting.getDarknessAlpha(2500)).toBe(0.45);
            expect(lighting.getDarknessAlpha(4000)).toBe(0.45);
        });

        test('getDarknessAlpha 应该在5000m+返回0.7', () => {
            expect(lighting.getDarknessAlpha(5000)).toBe(0.7);
            expect(lighting.getDarknessAlpha(10000)).toBe(0.7);
        });

        test('getCurrentZoneInfo 应该返回当前区域信息', () => {
            const zone = lighting.getCurrentZoneInfo(3000);
            expect(zone.name).toBe('黑暗');
            expect(zone.alpha).toBe(0.45);
        });
    });

    describe('平滑过渡', () => {
        test('update 应该设置目标alpha', () => {
            lighting.update(3000, 0.1);
            expect(lighting.targetAlpha).toBe(0.45);
        });

        test('currentAlpha 应该向targetAlpha过渡', () => {
            lighting.update(5000, 1); // 目标0.7，过渡速度0.5
            expect(lighting.currentAlpha).toBe(0.5); // 1秒后增加0.5
        });

        test('reset 应该重置所有状态', () => {
            lighting.currentAlpha = 0.5;
            lighting.targetAlpha = 0.7;
            lighting.reset();
            expect(lighting.currentAlpha).toBe(0);
            expect(lighting.targetAlpha).toBe(0);
        });
    });
});
