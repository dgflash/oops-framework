import { Component, director, game, Game, log, Node, view, _decorator } from "cc";
import { config } from "../game/config/Config";
import { EngineMessage } from "./common/event/EngineMessage";
import { Message } from "./common/event/MessageManager";
import { engine } from "./Engine";
import { GUI } from "./gui/GUI";

const { ccclass, property } = _decorator;

@ccclass('Root')
export class Root extends Component {
    @property({
        type: Node,
        tooltip: "游戏层"
    })
    public game: Node | null = null;

    @property({
        type: Node,
        tooltip: "界面层"
    })
    public gui: Node | null = null;

    onLoad() {
        this.init();

        //@ts-ignore
        engine.init(this);

        // 加载游戏配置
        config.init(this.run);
    }

    /** 加载完引擎配置文件后执行 */
    protected run() {

    }

    protected init() {
        var c_gui = this.gui?.addComponent(GUI)!;

        // 游戏显示事件
        game.on(Game.EVENT_SHOW, () => {
            log("Game.EVENT_SHOW");
            engine.timer.load();     // 平台不需要在退出时精准计算时间，直接暂时游戏时间
            engine.audio.resumeAll();
            director.resume();
            game.resume();
            Message.dispatchEvent(EngineMessage.GAME_ENTER);
        });

        // 游戏隐藏事件
        game.on(Game.EVENT_HIDE, () => {
            log("Game.EVENT_HIDE");
            engine.timer.save();     // 平台不需要在退出时精准计算时间，直接暂时游戏时间
            engine.audio.pauseAll();
            director.pause();
            game.pause();
            Message.dispatchEvent(EngineMessage.GAME_EXIT);
        });

        // 游戏尺寸修改事件
        view.setResizeCallback(() => {
            c_gui.resize();
            Message.dispatchEvent(EngineMessage.GAME_RESIZE);
        });
    }
}
