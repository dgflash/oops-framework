/*
 * @Author: dgflash
 * @Date: 2021-08-18 17:00:59
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-25 15:18:58
 */

import { error, JsonAsset } from "cc";
import { config } from "../../game/common/config/Config";
import { resLoader } from "../common/loader/ResLoader";

/** JSON数据表工具 */

var data: Map<string, any> = new Map();
export class JsonUtil {
    static get(name: string): any {
        if (data.has(name))
            return data.get(name);
    }

    static load(name: string, callback: Function): void {
        if (data.has(name))
            callback(data.get(name));
        else {
            var url = config.game.getConfigPath(name);
            resLoader.load(url, JsonAsset, (err: Error | null, content: JsonAsset) => {
                if (err) {
                    error(err.message);
                }
                data.set(name, content.json);
                callback(content.json)
            });
        }
    }

    static loadAsync(name: string) {
        return new Promise((resolve, reject) => {
            if (data.has(name)) {
                resolve(data.get(name))
            }
            else {
                var url = config.game.getConfigPath(name);
                resLoader.load(url, JsonAsset, (err: Error | null, content: JsonAsset) => {
                    if (err) {
                        error(err.message);
                    }
                    data.set(name, content.json);
                    resolve(content.json)
                });
            }
        });
    }

    static release(name: string) {
        var url = config.game.getConfigPath(name);
        data.delete(name);
        resLoader.release(url);
    }
}