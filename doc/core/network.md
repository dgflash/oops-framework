### 功能说明
Oops Framework－网络模块WebSocket处理客户端与服务之间保持长链接通讯。

### 使用说明
##### 自定义网络通讯数据协议（GZip压缩）
```
class GameProtocol extends NetProtocolPako { 
    /** 心跳协议 */
    getHearbeat(): NetData {
        return `{"action":"LoginAction","method":"heart","data":"null","isCompress":false,"channelid":1,"callback":"LoginAction_heart"}`;
    }
}
```

##### 创建一个WebSocket网络连接对象
```
var net = new NetNodeGame();
var ws = new WebSock();        // WebSocket 网络连接对象
var gp = new GameProtocol();   // 网络通讯协议对象
var gt = new NetGameTips()     // 网络提示对象
net.init(ws, gp, gt);
NetManager.getInstance().setNetNode(net, NetChannelType.Game);
```

##### 连接游戏服务器
```
var options = {
    url: `ws://127.0.0.1:3000`,
    autoReconnect: 0            // -1 永久重连，0不自动重连，其他正整数为自动重试次数
}
NetManager.getInstance().connect(options, NetChannelType.Game);
```

##### 断开游戏服务器连接
```
NetManager.getInstance().close(undefined, undefined, NetChannelType.Game);
    
```

##### 游戏服务器提示
```
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

    /** 重连接提示 */
    reconnectTips(isShow: boolean): void { 
        if (isShow) {
            Logger.logNet("重连开始");
        }
        else {
            Logger.logNet("重连成功");
        }
    }

    /** 请求提示 */
    requestTips(isShow: boolean): void {
        if (isShow) {
            Logger.logNet("请求数据开始");
        }
        else {
            Logger.logNet("请求数据完成");
        }
    }

    /** 响应错误码提示 */
    responseErrorCode(code: number): void {
        console.log("游戏服务器错误码", code);
    }
}
```

##### 请求服务器数据
```
var params: any = {
    playerId: 10000
}

let onComplete = {
    target: this,
    callback: (data: any) => {
        // 服务器返回数据
        console.log(data);
    }
}
// net为NetNodeGame对象
net.req("LoginAction", "loadPlayer", params, onComplete);
```

##### 监听服务器推送数据
```
var onComplete = (data: any) => {
    // 服务器返回数据
    console.log(data);
}

// net为NetNodeGame对象
net.setResponeHandler("notify", onComplete, this);
```