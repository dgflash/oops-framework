/*
 * @Date: 2021-08-12 09:33:37
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-26 14:07:18
 */
import { Message } from "../../../core/common/event/MessageManager";
import { Logger } from "../../../core/common/log/Logger";
import { tips } from "../../../core/gui/prompt/TipsManager";
import { INetworkTips } from "../../../core/network/NetInterface";
import { GameEvent } from "../config/GameEvent";

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
            Message.dispatchEvent(GameEvent.GameServerConnected);
        }
    }

    disconnectTips(): void {
        tips.alert("net_server_disconnected", () => {
            // netChannel.gameConnect();
        })
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