/*
 * @Date: 2021-08-12 09:33:37
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-14 17:53:02
 */
import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { NetData } from "../../../../../extensions/oops-plugin-framework/assets/libs/network/NetInterface";
import { NetProtocolPako } from "../../../../../extensions/oops-plugin-framework/assets/libs/network/NetProtocolPako";
import { WebSock } from "../../../../../extensions/oops-plugin-framework/assets/libs/network/WebSock";
import { netConfig } from "./NetConfig";
import { NetGameTips } from "./NetGameTips";
import { NetNodeGame } from "./NetNodeGame";

export enum NetChannelType {
    /** 游戏服务器 */
    Game = 0,
}

/** 游戏服务器心跳协议 */
class GameProtocol extends NetProtocolPako {
    /** 心跳协议 */
    getHearbeat(): NetData {
        return `{"action":"LoginAction","method":"heart","data":"null","isCompress":false,"channelid":${netConfig.channelid},"callback":"LoginAction_heart"}`;
    }
}

export class NetChannelManager {
    public game!: NetNodeGame;

    /** 创建游戏服务器 */
    gameCreate() {
        this.game = new NetNodeGame();
        // 游戏网络事件逻辑统一在 NetGameTips 里写
        this.game.init(new WebSock(), new GameProtocol(), new NetGameTips());
        oops.tcp.setNetNode(this.game, NetChannelType.Game);
    }

    /** 连接游戏服务器 */
    gameConnect() {
        oops.tcp.connect({
            url: `ws://${netConfig.gameIp}:${netConfig.gamePort}`,
            autoReconnect: 0        // 手动重连接
        }, NetChannelType.Game);
    }

    /** 断开游戏服务器 */
    gameClose() {
        oops.tcp.close(undefined, undefined, NetChannelType.Game);
    }
}

export var netChannel = new NetChannelManager();