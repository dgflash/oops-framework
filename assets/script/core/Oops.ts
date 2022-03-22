/*
 * @Author: dgflash
 * @Date: 2022-02-11 09:32:47
 * @LastEditors: dgflash
 * @LastEditTime: 2022-03-14 11:47:36
 */
import { AudioManager } from "./common/audio/AudioManager";
import { TimerManager } from "./common/manager/TimerManager";
import { storage } from "./common/storage/StorageManager";
import { GameManager } from "./game/GameManager";
import { LanguageManager } from "./gui/language/Language";
import { LayerManager } from "./gui/layer/LayerManager";
import { HttpRequest } from "./network/HttpRequest";

export class oops {
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
    public static storage = storage;
}