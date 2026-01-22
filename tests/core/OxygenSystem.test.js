/**
 * OxygenSystem 单元测试
 */
import OxygenSystem from '../../js/core/OxygenSystem.js';

describe('OxygenSystem', () => {
    let system;

    beforeEach(() => {
        system = new OxygenSystem(4, 1); // 默认4秒间隔，每次1点伤害
    });

    describe('基础消耗', () => {
        test('计时器应该正确累加', () => {
            let damageReceived = 0;
            const mockStats = { takeDamage: (dmg) => { damageReceived += dmg; } };
            system.update(1, mockStats);
            expect(system.timer).toBe(1);
        });

        test('达到间隔时应该扣除氧气', () => {
            let damageReceived = 0;
            const mockStats = { takeDamage: (dmg) => { damageReceived += dmg; } };

            // 模拟4秒过去
            for (let i = 0; i < 4; i++) {
                system.update(1, mockStats);
            }

            expect(damageReceived).toBe(1);
        });

        test('reset应该重置计时器', () => {
            system.timer = 3.5;
            system.reset();
            expect(system.timer).toBe(0);
        });
    });

    describe('深度加速消耗', () => {
        test('updateIntervalByDepth 应该在0-1000m返回4秒', () => {
            system.updateIntervalByDepth(0);
            expect(system.interval).toBe(4);

            system.updateIntervalByDepth(500);
            expect(system.interval).toBe(4);

            system.updateIntervalByDepth(999);
            expect(system.interval).toBe(4);
        });

        test('updateIntervalByDepth 应该在1000-2500m返回2.5秒', () => {
            system.updateIntervalByDepth(1000);
            expect(system.interval).toBe(2.5);

            system.updateIntervalByDepth(2000);
            expect(system.interval).toBe(2.5);
        });

        test('updateIntervalByDepth 应该在2500-5000m返回1.5秒', () => {
            system.updateIntervalByDepth(2500);
            expect(system.interval).toBe(1.5);

            system.updateIntervalByDepth(4000);
            expect(system.interval).toBe(1.5);
        });

        test('updateIntervalByDepth 应该在5000m+返回0.8秒', () => {
            system.updateIntervalByDepth(5000);
            expect(system.interval).toBe(0.8);

            system.updateIntervalByDepth(10000);
            expect(system.interval).toBe(0.8);
        });

        test('getCurrentZoneInfo 应该返回当前区域信息', () => {
            const zone = system.getCurrentZoneInfo(3000);
            expect(zone.name).toBeDefined();
            expect(zone.interval).toBe(1.5);
        });
    });
});
