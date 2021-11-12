/*
 * @Author: dgflash
 * @Date: 2021-08-18 17:00:59
 * @LastEditors: dgflash
 * @LastEditTime: 2021-11-12 11:59:32
 */

import { error, JsonAsset } from "cc";
import { GameConfig } from "../../game/config/GameConfig";
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
            var url = GameConfig.getConfigPath(name);
            resLoader.load(url, JsonAsset, (err: Error | null, content: JsonAsset) => {
                if (err) {
                    error(err.message);
                }
                data.set(name, content.json);
                callback(content.json)
            });
        }
    }
}