/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2022-08-02 14:25:50
 */

import { Logger } from "../../../../../extensions/oops-plugin-framework/assets/core/common/log/Logger";

/* 游戏配置解析，对应 resources/config/config.json 配置 */
export class GameConfig {
    /** 游戏配置路径 */
    getConfigPath(relative_path: string) {
        return "config/game/" + relative_path;
    }
    /** 角色资源路径 */
    getRolePath(name: string) {
        return `content/role/${name}`;
    }

    /** 客户端版本号配置 */
    get version(): string {
        return this._data["config"]["version"];
    }
    /** 包名 */
    get package(): string {
        return this._data["config"]["package"];
    }
    /** 游戏每秒传输帧数 */
    get frameRate(): number {
        return this._data.config.frameRate;
    }
    /** 本地存储内容加密 key */
    get localDataKey(): string {
        return this._data.config.localDataKey;
    }
    /** 本地存储内容加密 iv */
    get localDataIv(): string {
        return this._data.config.localDataIv;
    }
    /** Http 服务器地址 */
    get httpServer(): string {
        return this._data.config.httpServer;
    }
    /** Http 请求超时时间 */
    get httpTimeout(): number {
        return this._data.config.httpTimeout;
    }

    /** 获取当前客户端支持的语言类型 */
    get language(): Array<string> {
        return this._data.language.type || ["zh"];
    }
    get languagePathJson(): string {
        return this._data.language.path.json || "language/json";
    }
    get languagePathTexture(): string {
        return this._data.language.path.texture || "language/texture";
    }


    private _data: any = null;
    constructor(config: any) {
        let data = config.json;
        this._data = Object.freeze(data);

        Logger.logConfig(this._data, "游戏配置");
    }
}