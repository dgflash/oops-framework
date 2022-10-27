/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2022-10-14 15:25:22
 */
import { dynamicAtlasManager, macro, profiler, _decorator } from 'cc';
import { DEBUG, JSB } from 'cc/env';
import { RandomManager } from '../../extensions/oops-plugin-framework/assets/core/common/manager/RandomManager';
import { oops } from '../../extensions/oops-plugin-framework/assets/core/Oops';
import { Root } from '../../extensions/oops-plugin-framework/assets/core/Root';
import { ecs } from '../../extensions/oops-plugin-framework/assets/libs/ecs/ECS';
import { EcsAccountSystem } from './game/account/Account';
import { UIConfigData } from './game/common/config/GameUIConfig';
import { EcsPositionSystem } from './game/common/ecs/position/EcsPositionSystem';
import { smc } from './game/common/ecs/SingletonModuleComp';
import { EcsInitializeSystem, Initialize } from './game/initialize/Initialize';
import { EcsRoleSystem } from './game/role/Role';

const { ccclass, property } = _decorator;

macro.CLEANUP_IMAGE_CACHE = false;
dynamicAtlasManager.enabled = true;
dynamicAtlasManager.maxFrameSize = 512;

@ccclass('Main')
export class Main extends Root {
    start() {
        if (DEBUG) profiler.showStats();
        RandomManager.instance.setSeed(1);
        for (let index = 0; index < 10; index++) {
            console.log(RandomManager.instance.getRandomInt(1, 1000));
        }
    }

    protected run() {
        smc.initialize = ecs.getEntity<Initialize>(Initialize);
        if (JSB) {
            oops.gui.toast("热更新后新程序的提示");
        }
    }

    protected initGui() {
        oops.gui.init(UIConfigData);
    }

    protected async initEcsSystem() {
        oops.ecs.add(new EcsPositionSystem())
        oops.ecs.add(new EcsAccountSystem());
        oops.ecs.add(new EcsRoleSystem());
        oops.ecs.add(new EcsInitializeSystem());
    }
}
