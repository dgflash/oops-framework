
/*
 * 网络相关接口定义
 */
export type NetData = (string | ArrayBufferLike | Blob | ArrayBufferView);
export type NetCallFunc = (data: any) => void;

/** 请求协议 */
export interface IRequestProtocol {
    /** 动作名 */
    action: string,
    /** 模块名 */
    method: string,
    /** 回调方法名 */
    callback?: string,
    /** 是否压缩 */
    isCompress: boolean,
    /** 渠道编号 */
    channelid: number,
    /** 消息内容 */
    data?: any;
}

/** 相应协议 */
export interface IResponseProtocol {
    code: number,
    data?: any,
    callback?: string,
    isCompress: boolean
}

/** 回调对象 */
export interface CallbackObject {
    target: any,                // 回调对象，不为null时调用target.callback(xxx)
    callback: NetCallFunc,      // 回调函数
}

/** 请求对象 */
export interface RequestObject {
    buffer: NetData,                   // 请求的Buffer
    rspCmd: string,                    // 等待响应指令
    rspObject: CallbackObject | null,  // 等待响应的回调对象
}

/** 协议辅助接口 */
export interface IProtocolHelper {
    getHeadlen(): number;                                               // 返回包头长度
    getHearbeat(): NetData;                                             // 返回一个心跳包
    getPackageLen(msg: NetData): number;                                // 返回整个包的长度
    checkResponsePackage(msg: IResponseProtocol): boolean;              // 检查包数据是否合法（避免客户端报错崩溃）
    handlerRequestPackage(reqProtocol: IRequestProtocol): string;       // 处理请求包数据
    handlerResponsePackage(respProtocol: IResponseProtocol): boolean;   // 处理响应包数据
    getPackageId(msg: IResponseProtocol): string;                       // 返回包的id或协议类型
}

var unzip = function (str: string) {
    let charData = str.split('').map(function (x) {
        return x.charCodeAt(0);
    });
    let binData = new Uint8Array(charData);
    //@ts-ignore
    let data = pako.inflate(binData, { to: 'string' });
    return data;
}

var zip = function (str: string) {
    //@ts-ignore
    let binaryString = pako.gzip(str, { to: 'string' });
    return binaryString;
}

/** 默认字符串协议对象 */
export class DefStringProtocol implements IProtocolHelper {
    getHeadlen(): number {
        return 0;
    }
    getHearbeat(): NetData {
        return "";
    }
    getPackageLen(msg: NetData): number {
        return msg.toString().length;
    }
    checkResponsePackage(respProtocol: IResponseProtocol): boolean {
        return true;
    }

    handlerResponsePackage(respProtocol: IResponseProtocol): boolean {
        if (respProtocol.code == 1) {
            if (respProtocol.isCompress) {
                respProtocol.data = unzip(respProtocol.data);
            }
            respProtocol.data = JSON.parse(respProtocol.data);

            return true;
        }
        else {
            return false;
        }
    }

    handlerRequestPackage(reqProtocol: IRequestProtocol): string {
        var rspCmd = reqProtocol.action + "_" + reqProtocol.method;;
        reqProtocol.callback = rspCmd;
        if (reqProtocol.isCompress) {
            reqProtocol.data = zip(reqProtocol.data);
        }
        return rspCmd;
    }
    getPackageId(respProtocol: IResponseProtocol): string {
        return respProtocol.callback!;
    }
}

export type SocketFunc = (event: any) => void;
export type MessageFunc = (msg: NetData) => void;

/** Socket接口 */
export interface ISocket {
    onConnected: SocketFunc | null;         // 连接回调
    onMessage: MessageFunc | null;          // 消息回调
    onError: SocketFunc | null;             // 错误回调
    onClosed: SocketFunc | null;            // 关闭回调

    connect(options: any): any;                     // 连接接口
    send(buffer: NetData): number;                  // 数据发送接口
    close(code?: number, reason?: string): void;    // 关闭接口
}

/** 网络提示接口 */
export interface INetworkTips {
    connectTips(isShow: boolean): void;
    reconnectTips(isShow: boolean): void;
    requestTips(isShow: boolean): void;
    responseErrorCode(code: number): void;
}