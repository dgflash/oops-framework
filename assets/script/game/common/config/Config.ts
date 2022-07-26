/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-14 18:43:22
 */

import { game, JsonAsset } from "cc";
import { resLoader } from "../../../../../extensions/oops-plugin-framework/assets/core/common/loader/ResLoader";
import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { BuildTimeConstants } from "./BuildTimeConstants";
import { GameConfig } from "./GameConfig";
import { GameQueryConfig } from "./GameQueryConfig";
import { UIConfigData } from "./GameUIConfig";

/** 游戏配置静态访问类 */
export class Config {
    /** 构建时环境常量 */
    public btc!: BuildTimeConstants;

    /** 配置数据，版本号、支持语种等数据 */
    public game!: GameConfig;

    /** 处理浏览器地址栏参数，包括服务器ip、端口等数据 */
    public query!: GameQueryConfig;

    public init(callback: Function) {
        let config_name = "config/config";
        resLoader.load(config_name, JsonAsset, () => {
            var config = resLoader.get(config_name);
            this.btc = new BuildTimeConstants();
            this.query = new GameQueryConfig();
            this.game = new GameConfig(config);

            // 初始化每秒传输帧数
            game.frameRate = this.game.frameRate;
            // Http 服务器地址
            oops.http.server = this.game.httpServer;
            //  Http 请求超时时间
            oops.http.timeout = this.game.httpTimeout;
            // 初始化本地存储加密
            oops.storage.init(this.game.localDataKey, this.game.localDataIv);
            // 初始化界面窗口配置
            oops.gui.init(UIConfigData);

            callback();
        })
    }
}

export const config = new Config()