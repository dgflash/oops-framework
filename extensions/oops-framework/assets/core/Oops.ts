/*
 * @Author: dgflash
 * @Date: 2022-02-11 09:32:47
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-17 11:20:20
 */
import { ECSRootSystem } from "../libs/ecs/ECSSystem";
import { AudioManager } from "./common/audio/AudioManager";
import { TimerManager } from "./common/manager/TimerManager";
import { storage } from "./common/storage/StorageManager";
import { GameManager } from "./game/GameManager";
import { LanguageManager } from "./gui/language/Language";
import { LayerManager } from "./gui/layer/LayerManager";
import { HttpRequest } from "./network/HttpRequest";

/** 框架版本 */
export var version: string = "1.0.5";

export class oops {
    /** ECS */
    static ecs: ECSRootSystem;
    /** 多语言模块 */
    static language: LanguageManager;
    /** 游戏时间管理 */
    static timer: TimerManager;
    /** 游戏音乐管理 */
    static audio: AudioManager;
    /** 二维界面管理 */
    static gui: LayerManager;
    /** 三维游戏世界管理 */
    static game: GameManager;
    /** HTTP */
    static http: HttpRequest;
    /** 本地存储 */
    static storage = storage;
}