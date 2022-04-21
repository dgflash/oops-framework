/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2022-04-21 15:06:55
 */
import { setDisplayStats, _decorator } from 'cc';
import { DEBUG } from 'cc/env';
import { ecs } from './core/libs/ECS';
import { Root } from './core/Root';
import { smc } from './game/common/ecs/SingletonModuleComp';
import { Initialize } from './game/initialize/Initialize';

const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Root {
    start() {
        if (DEBUG) setDisplayStats(true);
    }

    protected async run() {
        smc.initialize = ecs.getEntity<Initialize>(Initialize);
    }
}