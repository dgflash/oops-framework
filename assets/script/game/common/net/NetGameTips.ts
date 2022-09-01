/*
 * @Date: 2021-08-12 09:33:37
 * @LastEditors: dgflash
 * @LastEditTime: 2022-07-22 18:09:52
 */
import { Logger } from "../../../../../extensions/oops-plugin-framework/assets/core/common/log/Logger";
import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { INetworkTips } from "../../../../../extensions/oops-plugin-framework/assets/libs/network/NetInterface";
import { GameEvent } from "../config/GameEvent";
import { tips } from "../prompt/TipsManager";

/** 游戏服务器提示 */
export class NetGameTips implements INetworkTips {
    /** 连接提示 */
    connectTips(isShow: boolean): void {
        if (isShow) {
            Logger.logNet("游戏服务器正在连接");
            tips.netInstableOpen();
        }
        else {
            Logger.logNet("游戏服务器连接成功");
            tips.netInstableClose();
            oops.message.dispatchEvent(GameEvent.GameServerConnected);
        }
    }

    /** 重连接提示 */
    reconnectTips(isShow: boolean): void { }

    /** 请求提示 */
    requestTips(isShow: boolean): void {
        if (isShow) {

        }
        else {

        }
    }

    /** 响应错误码提示 */
    responseErrorCode(code: number): void {
        console.log("游戏服务器错误码", code);

        if (code < 0) {
            tips.alert("netcode_" + code, () => {
                // SDKPlatform.restartGame(;)
            });
        }
        else {
            tips.alert("netcode_" + code);
        }
    }
}