# Roguelike Game v2.0

一款使用纯 JavaScript + Canvas 开发的 Roguelike 射击游戏。

## 🎮 游戏特性

- **自动战斗**：玩家自动向最近的敌人发射子弹
- **武器系统**：多种基础武器和进化武器，支持武器合成
- **状态效果**：燃烧、冰冻、中毒、致盲等多种效果
- **升级系统**：通过击杀敌人获得经验，升级后获得技能点
- **宝箱系统**：击杀敌人掉落宝箱，获取新武器

## 🚀 快速开始

### 方式一：使用启动脚本
双击 `启动游戏.bat` 即可启动游戏服务器并打开浏览器。

### 方式二：命令行启动
```bash
npm install      # 首次运行需安装依赖
npm run serve    # 启动服务器
```
然后访问 http://localhost:8080/

## 🎯 操作说明

| 按键 | 功能 |
|------|------|
| W/A/S/D | 移动 |
| E | 打开升级菜单（有技能点时） |
| ESC | 关闭菜单 |

## 📁 项目结构

```
js/
├── core/           # 核心模块 (Game, Player, PlayerStats)
├── combat/         # 战斗模块 (Bullet, BulletPool, CollisionManager, AOEHandler)
├── enemies/        # 敌人模块 (Enemy, StatusEffects)
├── weapons/        # 武器模块 (Weapon, WeaponSystem, WeaponsData)
├── effects/        # 视觉特效
├── ui/             # UI 组件
└── chest/          # 宝箱系统
```

## 🧪 运行测试

```bash
npm test
```

## 📋 开发日志

### 2026/1/21
- ✨ 新增**撤离系统**：搜打撤玩法核心机制
  - 每500米生成撤离点，停留3秒成功撤离
  - 撤离成功保留100%金币，死亡保留50%
  - 创建 `EvacuationManager.js`、`MetaProgress.js`、`EvacuationResultUI.js`
- 🎨 更新武器图标（疾风💨、钢铁🔩、燃霜💠等）
- 🔧 武器进化界面改为图标显示材料
- ⚙️ 氧气消耗速度可配置（当前每4秒扣1血）

### 2026/1/20
- 添加子弹扩散功能（多武器子弹不再重叠）
- 重构目录结构，创建 `combat/` 模块
- 将 `upgradeAttack()` 改为 `upgradeStrength()`
- 拆分 `CollisionManager`，提取 `AOEHandler`
- 将状态效果应用逻辑移至 `StatusEffects.js`

### 2026/1/18
- 实现宝箱掉落系统（从敌人死亡处掉落）

### 2026/1/17
- 重构状态效果系统，创建 `StatusEffect` 模块
