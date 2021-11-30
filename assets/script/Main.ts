/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2021-11-30 15:51:42
 */
import { game, setDisplayStats, _decorator } from 'cc';
import { DEBUG } from 'cc/env';
import { engine } from './core/Engine';
import { LayerType, UIConfig } from './core/gui/layer/LayerManager';
import { Root } from './core/Root';
import { Demo } from './ecs/entity/Demo';
import { RootSystem } from './ecs/RootSystem';
const { ccclass, property } = _decorator;

export enum UIID {
    UILoading = 0,
    Window = 1,
    UILoading_Prompt = 2,
    Demo = 3,
}

export var UICF: { [key: number]: UIConfig } = {
    [UIID.UILoading]: { layer: LayerType.UI, prefab: "loading/prefab/loading" },
    [UIID.UILoading_Prompt]: { layer: LayerType.PopUp, prefab: "common/prefab/netinstable" },
    [UIID.Window]: { layer: LayerType.Dialog, prefab: "common/prefab/window" },
    [UIID.Demo]: { layer: LayerType.UI, prefab: "gui/prefab/demo" },
}

@ccclass('Main')
export class Main extends Root {
    rootSystem!: RootSystem;

    start() {
        if (DEBUG)
            setDisplayStats(true);

        game.frameRate = 60;

        this.rootSystem = new RootSystem();
        this.rootSystem.init();
    }

    protected run() {
        engine.gui.init(UICF);
        engine.gui.open(UIID.UILoading);

        this.ecs_demo();
    }

    /** 通过ECS设计通用业务组件来复用 */
    private async ecs_demo() {
        Demo.load(() => {
            var a = new Demo();
            a.init(1);

            // 模块业务逻辑
            a.login();

            // 模块视图
            a.show(this.node);
        });
    }

    update(dt: number) {
        this.rootSystem.execute(dt);
    }
}