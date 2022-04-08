/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2022-02-16 14:12:28
 */
import { Component, director, game, Game, log, Node, view, _decorator } from "cc";
import { config } from "../game/common/config/Config";
import { RootSystem } from "../game/common/ecs/RootSystem";
import { AudioManager } from "./common/audio/AudioManager";
import { EngineMessage } from "./common/event/EngineMessage";
import { Message } from "./common/event/MessageManager";
import { TimerManager } from "./common/manager/TimerManager";
import { GameManager } from "./game/GameManager";
import { GUI } from "./gui/GUI";
import { LanguageManager } from "./gui/language/Language";
import { LayerManager } from "./gui/layer/LayerManager";
import { HttpRequest } from "./network/HttpRequest";
import { oops } from "./Oops";

const { ccclass, property } = _decorator;

@ccclass('Root')
export class Root extends Component {
    @property({
        type: Node,
        tooltip: "游戏层"
    })
    game: Node | null = null;

    @property({
        type: Node,
        tooltip: "界面层"
    })
    gui: Node | null = null;

    private ecs!: RootSystem;

    onLoad() {
        this.init();

        // 加载游戏配置
        config.init(this.run.bind(this));
    }

    protected init() {
        oops.language = new LanguageManager();
        oops.timer = new TimerManager(this);
        oops.audio = AudioManager.instance;
        oops.http = new HttpRequest();
        oops.gui = new LayerManager(this.gui!);
        oops.game = new GameManager(this.game!);

        // ECS系统初始化
        this.ecs = new RootSystem();
        this.ecs.init();

        // 游戏显示事件
        game.on(Game.EVENT_SHOW, () => {
            log("Game.EVENT_SHOW");
            oops.timer.load();     // 平台不需要在退出时精准计算时间，直接暂时游戏时间
            oops.audio.resumeAll();
            director.resume();
            game.resume();
            Message.dispatchEvent(EngineMessage.GAME_ENTER);
        });

        // 游戏隐藏事件
        game.on(Game.EVENT_HIDE, () => {
            log("Game.EVENT_HIDE");
            oops.timer.save();     // 平台不需要在退出时精准计算时间，直接暂时游戏时间
            oops.audio.pauseAll();
            director.pause();
            game.pause();
            Message.dispatchEvent(EngineMessage.GAME_EXIT);
        });

        // 游戏尺寸修改事件
        var c_gui = this.gui?.addComponent(GUI)!;
        view.setResizeCallback(() => {
            c_gui.resize();
            Message.dispatchEvent(EngineMessage.GAME_RESIZE);
        });
    }

    update(dt: number) {
        this.ecs.execute(dt);
    }

    /** 加载完引擎配置文件后执行 */
    protected run() {

    }
}
