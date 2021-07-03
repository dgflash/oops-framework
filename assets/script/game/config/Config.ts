
import { JsonAsset } from "cc";
import { resLoader } from "../../core/utils/ResLoader";
import { BuildTimeConstants } from "./BuildTimeConstants";
import { GameConfig } from "./GameConfig";
import { QueryConfig } from "./QueryConfig";

/** 游戏配置静态访问类 */
export class Config {
    /** 构建时环境常量 */
    public btc!: BuildTimeConstants;

    /** 配置数据，版本号、支持语种等数据 */
    public game!: GameConfig;

    /** 处理浏览器地址栏参数，包括服务器ip、端口等数据 */
    public query!: QueryConfig;

    public init(callback: Function) {
        let config_name = "config/config";
        resLoader.load(config_name, JsonAsset, () => {
            var config = resLoader.get(config_name);
            this.btc = new BuildTimeConstants();
            this.query = new QueryConfig();
            this.game = new GameConfig(config);

            callback();
        })
    }
}

export const config = new Config()