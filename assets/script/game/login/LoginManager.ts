import { engine } from "../../core/Engine";
import { Logger } from "../../core/utils/Logger";
import { netChannel } from "./NetChannelManager";
import { netConfig } from "./NetConfig";

/** 登录管理 */
export class LoginManager {
    constructor() {
        this.test();
    }

    async test() {
        var channelId = 101;
        var config = await this.requestServerConfig();
        console.log("config", config);

        var login_data = await this.requestLogin("dgflash", channelId);
        console.log("login_data", login_data);

        var server_list: any = await this.requestServerList(101, 1088);
        console.log("server_list", server_list);

        netChannel.gameCreate();
        netChannel.gameConnect();

        // netChannel.chatCreate();
        // netChannel.chatConnect();

        netConfig.channelid = 101;
        this.requestLoadPlayer(10040311);
        this.requestPlayerAction();
    }

    requestPlayerAction() {
        var cb = (data: any) => {
            console.log(data);
        }
        netChannel.game.setResponeHandler("itemData", cb, this);
        netChannel.game.setResponeHandler("userData", cb, this);
        netChannel.game.setResponeHandler("chatInfo", cb, this);
    }

    requestHeart() {
        netChannel.game.req("LoginAction", "heart", null, {
            target: this, callback: (data: any) => {
                console.log("heart", data);
            }
        });
    }

    /** 请求角色登录游戏 */
    requestLoadPlayer(playerId: number) {
        var params: any = {
            playerId: playerId,
            serverId: netConfig.lastLoginServer.id,
            gmUid: netConfig.dbid,
            sessionKey: netConfig.sessionKey,
        }

        var onComplete = {
            target: this,
            callback: (data: any) => {
                console.log(data);
            }
        }

        netChannel.game.req("LoginAction", "loadPlayer", params, onComplete);
    }

    /** 请求服务器配置数据 */
    requestServerConfig() {
        return new Promise((resolve, reject) => {
            var url = `${netConfig.gmServer}?c=conf&a=getConf`;

            var onComplete = (data: any) => {
                netConfig.updateUrl = data.update;
                netConfig.noticeUrl = data.notice;
                netConfig.loginUrl = data.login;
                netConfig.payUrl = data.pay;
                netConfig.serverListUrl = data.serverList;
                resolve(data);
            }

            var onError = () => {
                Logger.trace("配置服务器连接失败");
                resolve(null);
            }

            engine.http.get(url, onComplete, onError);
        });
    }

    /**
     * 请求登录
     * @param username  用户名
     * @param channelId 渠道编号
     */
    requestLogin(user_name: string, channel_id: number) {
        return new Promise((resolve, reject) => {
            let params = { username: user_name, channelId: channel_id };

            var onComplete = (data: any) => {
                netConfig.dbid = parseInt(data.dbid);
                netConfig.accessToken = data.access_token;
                netConfig.sessionKey = data.sessionKey;
                resolve(data);
            }

            var onError = () => {
                Logger.trace("配置服务器连接失败");
                resolve(null);
            }

            engine.http.post(netConfig.loginUrl, params, onComplete, onError);
        });
    }

    /**
     * 获取游戏服务器列表
     * @param channelId     渠道编号
     * @param dbid          数据库编号
     */
    requestServerList(channelId: number, dbid: number) {
        return new Promise((resolve, reject) => {
            var url = `${netConfig.serverListUrl}&channelId=${channelId}&dbid=${dbid}`;

            var onComplete = (data: any) => {
                for (var key in data) {
                    netConfig.listServer.set(key, data[key]);
                }
                resolve(data);
            }

            var onError = () => {
                Logger.trace("游戏服务器列表获取失败");
                resolve(null);
            }

            engine.http.get(url, onComplete, onError);
        })
    }
}