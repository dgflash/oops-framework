import { DefStringProtocol, NetData } from "../../core/network/NetInterface";
import { NetManager } from "../../core/network/NetManager";
import { WebSock } from "../../core/network/WebSock";
import { netConfig } from "./NetConfig";
import { NetNodeGame } from "./NetNodeGame";
import { NetTips } from "./NetTips";

export enum NetChannelType {
    /** 游戏服务器 */
    Game = 0,
    /** 聊天服务器 */
    Chat = 1
}

class GameProtocol extends DefStringProtocol {
    /** 心跳协议 */
    getHearbeat(): NetData {
        return `{"action":"LoginAction","method":"heart","data":"null","isCompress":false,"channelid":${netConfig.channelid},"callback":"LoginAction_heart"}`;
    }
}

export class NetChannelManager {
    public game!: NetNodeGame;
    public chat!: NetNodeGame;

    /** 创建游戏服务器 */
    gameCreate() {
        this.game = new NetNodeGame();
        this.game.init(new WebSock(), new GameProtocol(), new NetTips());
        NetManager.getInstance().setNetNode(this.game, NetChannelType.Game);
    }

    /** 连接游戏服务器 */
    gameConnect() {
        NetManager.getInstance().connect({ url: `ws://${netConfig.lastLoginServer.host}:${netConfig.lastLoginServer.port}`, autoReconnect: 0 }, NetChannelType.Game);
    }

    /** 断开游戏服务器 */
    gameClose() {
        NetManager.getInstance().close(undefined, undefined, NetChannelType.Game);
    }

    /** 创建聊天服务器 */
    chatCreate() {
        this.chat = new NetNodeGame();
        this.chat.init(new WebSock(), new DefStringProtocol());
        NetManager.getInstance().setNetNode(this.chat, NetChannelType.Chat);
    }

    /** 连接聊天服务器 */
    chatConnect() {
        NetManager.getInstance().connect({ url: `ws://${netConfig.lastLoginServer.host}:${netConfig.lastLoginServer.chat_port}`, autoReconnect: 0 }, NetChannelType.Chat);
    }

    /** 断开游戏服务器 */
    chatClose() {
        NetManager.getInstance().close(undefined, undefined, NetChannelType.Chat);
    }
}

export var netChannel = new NetChannelManager();

