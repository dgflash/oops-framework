import { sys, warn } from "cc";
import { Logger } from "../../core/common/log/Logger";
import { UrlParse } from "./UrlParse";

/*
 * 获取和处理浏览器地址栏参数
 */
export class QueryConfig {
    public get roomid(): string {
        return this._data["roomid"];
    }

    public get openId(): string {
        return this._data["openId"];
    }

    /** 玩家帐号名 */
    public get username(): string {
        return this._data["username"];
    }

    /** 语言 */
    public get lang(): string {
        return this._data["lang"] || "zh";
    }

    /** 客户端ip，区别于ips */
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
            data["username"] = getWeakUUID();
        }
        this._data = Object.freeze(data);

        Logger.logConfig(this._data, "查询参数");
    }
}

let getWeakUUID = function () {
    function uuidGenerator(len: number, radix: number) {
        let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        let uuid = [], i;
        radix = radix || chars.length;

        if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        }
        else {
            // rfc4122, version 4 form
            let r;

            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';
            // Fill in random data. At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    }
    let uuid = sys.localStorage.getItem("__uuid_");
    if (!uuid) {
        uuid = sys.os + sys.platform + "_" + uuidGenerator(13, 16);
        uuid = uuid.replace(/[\s]+/, "")
        sys.localStorage.setItem("__uuid_", uuid);
    }
    return uuid;
}