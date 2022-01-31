/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-26 17:30:22
 */
import { setDisplayStats, _decorator } from 'cc';
import { DEBUG } from 'cc/env';
import { ecs } from './core/libs/ECS';
import { Root } from './core/Root';
import { SingletonModuleComp } from './game/common/ecs/SingletonModuleComp';
import { Initialize } from './game/initialize/Initialize';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Root {
    start() {
        if (DEBUG) setDisplayStats(true);
    }

    protected run() {
        var module = ecs.getSingleton(SingletonModuleComp);
        module.initialize = new Initialize();
        module.initialize.open();
    }
}