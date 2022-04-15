/*
 * @Author: dgflash
 * @Date: 2022-04-14 17:08:01
 * @LastEditors: dgflash
 * @LastEditTime: 2022-04-15 12:23:52
 */
import { warn } from "cc";
import { nanoid } from "nanoid";
import { Logger } from "../../../core/common/log/Logger";
import { UrlParse } from "./UrlParse";

/*
 * 获取和处理浏览器地址栏参数
 */
export class GameQueryConfig {
    /** 玩家帐号名 */
    public get username(): string {
        return this._data["username"];
    }

    /** 语言 */
    public get lang(): string {
        return this._data["lang"] || "zh";
    }

    /** 客户端ip */
    public get ip(): string {
        return this._data["ip"] || "";
    }

    /** 游戏服务器端口 */
    public get port(): string {
        return this._data["port"];
    }

    /** 测试模式开关 */
    public get debug(): string {
        return this._data["debug"];
    }

    /** 处理动态传递给游戏的服务器地址 */
    public getConfigServerInfo(): { ips: Array<string>, ssl: boolean, port: number } {
        let ret = {
            ips: [],
            ssl: false,
            port: 0
        }

        if (this.port) {
            ret.port = parseInt(this.port)
        }
        if (ret.ips.length < 1) {
            warn("请在地址栏输入游戏服务器ip");
        }
        if (ret.port < 1) {
            warn("请在地址栏输入端口号")
        }
        return ret;
    }

    // 浏览器地址栏原始参数，不可修改！
    private _data: any = null;
    public get data() {
        return this._data;
    }
    constructor() {
        let data: any = (new UrlParse()).query;
        if (!data) {
            return;
        }
        if (!data["username"]) {
            data["username"] = nanoid();
        }
        this._data = Object.freeze(data);

        Logger.logConfig(this._data, "查询参数");
    }
}