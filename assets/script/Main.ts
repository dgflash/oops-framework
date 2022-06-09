/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-09 16:23:35
 */
import { setDisplayStats, _decorator } from 'cc';
import { DEBUG, JSB } from 'cc/env';
import { ecs } from './core/libs/ecs/ECS';
import { oops } from './core/Oops';
import { CommonEnter } from './game/common/ecs/CommonEnter';
import { smc } from './game/common/ecs/SingletonModuleComp';
import { Initialize } from './game/initialize/Initialize';

const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends CommonEnter {
    start() {
        if (DEBUG) setDisplayStats(true);
    }

    protected async run() {
        smc.initialize = ecs.getEntity<Initialize>(Initialize);

        if (JSB) {
            oops.gui.toast("热更新后新程序的提示");
        }
    }
}
