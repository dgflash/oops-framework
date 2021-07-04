import { INetworkTips } from "../../core/network/NetInterface";

/** 网络提示（管理一个视图对象） */
export class NetTips implements INetworkTips {
    /** 连接提示 */
    connectTips(isShow: boolean): void {
        if (isShow) {
            console.log("connectTips_start");
        }
        else {
            console.log("connectTips_end");
        }
    }

    /** 重连接提示 */
    reconnectTips(isShow: boolean): void {
        if (isShow) {
            console.log("reconnectTips_start");
        }
        else {
            console.log("reconnectTips_end");
        }
    }

    /** 请求提示 */
    requestTips(isShow: boolean): void {
        if (isShow) {
            console.log("requestTips_start");
        }
        else {
            console.log("requestTips_end");
        }
    }
    /** 响应错误码提示 */
    responseErrorCode(code: number): void {
        console.log("错误码", code);
    }
}