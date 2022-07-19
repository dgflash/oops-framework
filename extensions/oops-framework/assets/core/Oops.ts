/*
 * @Author: dgflash
 * @Date: 2022-02-11 09:32:47
 * @LastEditors: dgflash
 * @LastEditTime: 2022-07-19 11:02:08
 */
import { ECSRootSystem } from "../libs/ecs/ECSSystem";
import { AudioManager } from "./common/audio/AudioManager";
import { Logger } from "./common/log/Logger";
import { TimerManager } from "./common/manager/TimerManager";
import { storage } from "./common/storage/StorageManager";
import { GameManager } from "./game/GameManager";
import { LanguageManager } from "./gui/language/Language";
import { LayerManager } from "./gui/layer/LayerManager";
import { HttpRequest } from "./network/HttpRequest";

/** 框架版本 */
export var version: string = "1.0.7";

export class oops {
    /** 日志管理 */
    static log = Logger;
    /** 本地存储 */
    static storage = storage;
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
}