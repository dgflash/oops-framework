/*
 * @Date: 2021-08-12 09:33:37
 * @LastEditors: H.Joeson
 * @LastEditTime: 2021-11-25 15:49:50
 */
import { DefStringProtocol, NetData } from "../../core/network/NetInterface";
import { NetManager } from "../../core/network/NetManager";
import { WebSock } from "../../core/network/WebSock";
import { netConfig } from "./NetConfig";
import { NetGameTips } from "./NetGameTips";
import { NetNodeGame } from "./NetNodeGame";

export enum NetChannelType {
    /** 游戏服务器 */
    Game = 0,
}

/** 游戏服务器心跳协议 */
class GameProtocol extends DefStringProtocol {
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
        NetManager.getInstance().setNetNode(this.game, NetChannelType.Game);
    }

    /** 连接游戏服务器 */
    gameConnect() {
        NetManager.getInstance().connect({
            url: `ws://${netConfig.gameIp}:${netConfig.gamePort}`,
            autoReconnect: 0        // 手动重连接
        }, NetChannelType.Game);
    }

    /** 断开游戏服务器 */
    gameClose() {
        NetManager.getInstance().close(undefined, undefined, NetChannelType.Game);
    }
}

export var netChannel = new NetChannelManager();

