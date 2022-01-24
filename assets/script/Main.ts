/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-24 14:27:59
 */
import { game, setDisplayStats, _decorator } from 'cc';
import { DEBUG } from 'cc/env';
import { ecs } from './core/libs/ECS';
import { Root } from './core/Root';
import { SingletonModuleComp } from './ecs/component/common/SingletonModuleComp';
import { Initialize } from './ecs/entity/Initialize';
import { RootSystem } from './ecs/RootSystem';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Root {
    rootSystem!: RootSystem;

    start() {
        if (DEBUG) setDisplayStats(true);

        game.frameRate = 60;

        this.rootSystem = new RootSystem();
        this.rootSystem.init();
    }

    protected run() {
        var module = ecs.getSingleton(SingletonModuleComp);
        module.initialize = new Initialize();
        module.initialize.open();
    }

    update(dt: number) {
        this.rootSystem.execute(dt);
    }
}