/** 服务器区域信息 */
export interface IServerRegionInfo {
    /** 服务区域名 */
    title: string,
    /** 服务区域状态 */
    state: number,
    /** 服务器列表 */
    servers: Array<IServerInfo>
}

/** 服务器区域信息 */
export interface IServerInfo {
    /** 服务器编号 */
    id: number,
    /** 服务器编名 */
    name: string,
    /** 服务器地址 */
    host: string,
    /** 游戏服务器端口 */
    port: number,
    /** 聊天服务器端口 */
    chat_port: number,
    /** 服务器状态 */
    server_state: number,
    /** 连接状态 */
    connect_state: number,
    /**  */
    pingshen: number
}

/** 网络配置 */
class NetConfig {
    public gmServer: string = "http://192.168.1.13/";
    /** 更新地址 */
    public updateUrl!: string;
    /** 通知地址 */
    public noticeUrl!: string;
    /** 登录地址 */
    public loginUrl!: string;
    /** 支付地址 */
    public payUrl!: string;
    /** 服务器列表地址 */
    public serverListUrl!: string;

    /** 渠道编号 */
    public channelid!: number;
    /** 数据库编号 */
    public dbid!: number;
    /** SDK访问令牌 */
    public accessToken!: string;
    /** 会话关键字 */
    public sessionKey!: string

    /** 服务器列表 */
    public listServer: Map<string, IServerRegionInfo> = new Map<string, IServerRegionInfo>();
    /** 最后一次登录服务器信息 */
    public get lastLoginServer(): IServerInfo {
        var lastLoginServers = this.listServer.get("lastLogin")!;
        return lastLoginServers.servers[lastLoginServers.state];
    }
}

/** 网络配置 */
export var netConfig = new NetConfig();