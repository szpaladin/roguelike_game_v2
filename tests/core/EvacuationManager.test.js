/**
 * EvacuationManager 单元测试
 */
import EvacuationManager from '../../js/core/EvacuationManager.js';

describe('EvacuationManager', () => {
    let manager;

    beforeEach(() => {
        manager = new EvacuationManager();
    });

    describe('撤离点生成', () => {
        test('应该在达到间距时生成撤离点', () => {
            manager.updateSpawning(5000); // 达到第一个撤离点距离

            expect(manager.evacuationPoints.length).toBe(1);
        });

        test('不应该在未达到间距时生成撤离点', () => {
            manager.updateSpawning(4999);

            expect(manager.evacuationPoints.length).toBe(0);
        });

        test('应该正确生成多个撤离点', () => {
            manager.updateSpawning(5000);
            manager.updateSpawning(10000);
            manager.updateSpawning(15000);

            expect(manager.evacuationPoints.length).toBe(3);
        });
    });

    describe('撤离检测', () => {
        test('玩家进入撤离点应该开始撤离', () => {
            manager.spawnEvacuationPoint(0);
            const point = manager.evacuationPoints[0];

            // 模拟玩家在撤离点内
            const player = { x: point.x, y: point.y, radius: 10 };
            manager.update(player, 0, 0.1);

            expect(manager.isEvacuating).toBe(true);
        });

        test('玩家离开撤离点应该重置进度', () => {
            manager.spawnEvacuationPoint(0);
            const point = manager.evacuationPoints[0];

            // 进入撤离点
            const player = { x: point.x, y: point.y, radius: 10 };
            manager.update(player, 0, 0.1);
            expect(manager.isEvacuating).toBe(true);

            // 离开撤离点
            player.x = 9999;
            manager.update(player, 0, 0.1);
            expect(manager.isEvacuating).toBe(false);
            expect(manager.evacuationProgress).toBe(0);
        });

        test('停留足够时间应该触发撤离完成', () => {
            manager.spawnEvacuationPoint(0);
            const point = manager.evacuationPoints[0];
            const player = { x: point.x, y: point.y, radius: 10 };

            let evacuationCompleted = false;
            manager.setEvacuationCallback(() => {
                evacuationCompleted = true;
            });

            // 模拟3秒（每帧0.1秒，需要30帧）
            for (let i = 0; i < 35; i++) {
                manager.update(player, 0, 0.1);
            }

            expect(evacuationCompleted).toBe(true);
            expect(manager.evacuationProgress).toBe(1);
        });
    });

    describe('获取下一个撤离点距离', () => {
        test('应该正确计算到下一撤离点的距离', () => {
            const distanceToNext = manager.getDistanceToNextEvac(3000);

            // 下一个撤离点在5000，当前3000，差2000像素 = 200米
            expect(distanceToNext).toBe(200);
        });

        test('刚经过撤离点后应该显示到下一个的距离', () => {
            manager.updateSpawning(5000);
            const distanceToNext = manager.getDistanceToNextEvac(5500);

            // 下一个撤离点在10000，当前5500，差4500像素 = 450米
            expect(distanceToNext).toBe(450);
        });
    });

    describe('重置', () => {
        test('重置应该清空所有状态', () => {
            manager.updateSpawning(5000);
            manager.isEvacuating = true;
            manager.evacuationProgress = 0.5;

            manager.reset();

            expect(manager.evacuationPoints.length).toBe(0);
            expect(manager.isEvacuating).toBe(false);
            expect(manager.evacuationProgress).toBe(0);
            expect(manager.lastSpawnDistance).toBe(0);
        });
    });
});
