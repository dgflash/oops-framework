/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2022-07-13 14:55:08
 */
import { dynamicAtlasManager, macro, profiler, _decorator } from 'cc';
import { DEBUG, JSB } from 'cc/env';
import { oops } from '../../extensions/oops-framework/assets/core/Oops';
import { ecs } from '../../extensions/oops-framework/assets/libs/ecs/ECS';
import { CommonEnter } from './game/common/ecs/CommonEnter';
import { smc } from './game/common/ecs/SingletonModuleComp';
import { Initialize } from './game/initialize/Initialize';

const { ccclass, property } = _decorator;

macro.CLEANUP_IMAGE_CACHE = false;
dynamicAtlasManager.enabled = true;
dynamicAtlasManager.maxFrameSize = 512;

@ccclass('Main')
export class Main extends CommonEnter {
    start() {
        if (DEBUG) profiler.showStats();
    }

    protected async run() {
        smc.initialize = ecs.getEntity<Initialize>(Initialize);

        if (JSB) {
            oops.gui.toast("热更新后新程序的提示");
        }
    }
}
