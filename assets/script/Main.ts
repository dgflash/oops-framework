import { game, setDisplayStats, _decorator } from 'cc';
import { DEBUG } from 'cc/env';
import { engine } from './core/Engine';
import { LayerType, UIConfig } from './core/gui/layer/LayerManager';
import { Root } from './core/Root';
import { RootSystem } from './ecs/RootSystem';

const { ccclass } = _decorator;

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

        game.setFrameRate(60);

        this.rootSystem = new RootSystem();
        this.rootSystem.init();
    }

    protected run() {
        engine.gui.init(UICF);
        engine.gui.open(UIID.UILoading);
    }

    update(dt: number) {
        this.rootSystem.execute(dt);
    }
}