import { AudioManager } from "./common/audio/AudioManager";
import { TimerManager } from "./common/manager/TimerManager";
import { GameManager } from "./game/GameManager";
import { LanguageManager } from "./gui/language/Language";
import { LayerManager } from "./gui/layer/LayerManager";
import { HttpRequest } from "./network/HttpRequest";
import { Root } from "./Root";

export class engine {
    /** 多语言模块 */
    public static i18n: LanguageManager;
    /** 游戏时间管理 */
    public static timer: TimerManager;
    /** 游戏音乐管理 */
    public static audio: AudioManager;
    /** 二维界面管理 */
    public static gui: LayerManager;
    /** 三维游戏世界管理 */
    public static game: GameManager;
    /** HTTP */
    public static http: HttpRequest;

    /** 在Root.ts中初始化引导模块 */
    private static init(root: Root) {
        engine.i18n = new LanguageManager()
        engine.timer = new TimerManager(root);
        engine.audio = AudioManager.instance;
        engine.gui = new LayerManager(root.gui!);
        engine.game = root.addComponent(GameManager)!;
        engine.http = new HttpRequest();
    }

    /** 修改引擎全局游戏速度 （k-cocos.js） */
    public static get speed(): number {
        // @ts-ignore
        return cc.kGetSpeed();
    }
    public static set speed(value: number) {
        // @ts-ignore
        cc.kSetSpeed(value);
    }
}