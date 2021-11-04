/*
 * @Author: dgflash
 * @Date: 2021-08-18 17:00:59
 * @LastEditors: dgflash
 * @LastEditTime: 2021-09-28 15:21:21
 */

import { error, JsonAsset } from "cc";
import { GameConfig } from "../../game/config/GameConfig";
import { resLoader } from "../common/loader/ResLoader";

/** JSON数据表工具 */

var data: Map<string, any> = new Map();
export class JsonUtil {
    static getData(name: string): any {
        if (data.has(name))
            return data.get(name);
        else
            return new Promise((resolve, reject) => {
                var url = GameConfig.getConfigPath(name);
                resLoader.load(url, JsonAsset, (err: Error | null, content: JsonAsset) => {
                    if (err) {
                        error(err.message);
                    }
                    data.set(name, content.json);
                    resolve(content.json);
                });
            });
    }

    static get(name: string): any {
        return new Promise((resolve, reject) => {
            if (data.has(name))
                resolve(data.get(name));
            else {
                var url = GameConfig.getConfigPath(name);
                resLoader.load(url, JsonAsset, (err: Error | null, content: JsonAsset) => {
                    if (err) {
                        error(err.message);
                    }
                    data.set(name, content.json);
                    resolve(content.json);
                });
            }
        });
    }
}