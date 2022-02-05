import { AudioManager } from "./common/audio/AudioManager";
import { TimerManager } from "./common/manager/TimerManager";
import { SqlUtil } from "./common/storage/SqlUtil";
import { GameManager } from "./game/GameManager";
import { LanguageManager } from "./gui/language/Language";
import { LayerManager } from "./gui/layer/LayerManager";
import { HttpRequest } from "./network/HttpRequest";
import { Root } from "./Root";

export class engine {
    /** 多语言模块 */
    public static language: LanguageManager;
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
    /** 本地存储 */
    public static storage = SqlUtil;

    /** 在Root.ts中初始化引导模块 */
    private static init(root: Root) {
        engine.language = new LanguageManager()
        engine.timer = new TimerManager(root);
        engine.audio = AudioManager.instance;
        engine.http = new HttpRequest();
        engine.gui = new LayerManager(root.gui!);
        engine.game = root.addComponent(GameManager)!;
    }
}