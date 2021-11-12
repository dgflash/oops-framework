/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2021-11-12 10:16:59
 */

import { Logger } from "../../core/common/log/Logger";

/*
 * 游戏配置解析，对应 resources/config/config.json 配置
 */
export class GameConfig {
    /**
     * 客户端版本号配置
     */
    public get version(): string {
        return this._data["config"]["version"];
    }

    public static getConfigPath(relative_path: string) {
        return "config/game/" + relative_path;
    }

    /**
     * 获取当前客户端支持的语言类型
     */
    public get language(): Array<string> {
        return this._data["language"]["type"] || ["zh"];
    }
    public get languagePathJson(): string {
        return this._data["language"]["path"]["json"] || "language/json";
    }
    public get languagePathTexture(): string {
        return this._data["language"]["path"]["texture"] || "language/texture";
    }

    /** 包名 */
    public get package(): string {
        return this._data["config"]["package"];
    }

    /**
     *  获取resources/config/config.json数据
     */
    public get data() {
        return this._data;
    }

    private _data: any = null;
    constructor(config: any) {
        let data = config.json;
        this._data = Object.freeze(data);

        Logger.logConfig(this._data, "游戏配置");
    }
}