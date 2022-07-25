/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2021-11-04 17:33:02
 */
import { Logger } from "../../core/common/log/Logger";
import { ISocket, MessageFunc, NetData } from "./NetInterface";

type Connected = (event: any) => void;

/*
*   WebSocket封装
*   1. 连接/断开相关接口
*   2. 网络异常回调
*   3. 数据发送与接收
*/
export class WebSock implements ISocket {
    private _ws: WebSocket | null = null;              // websocket对象

    onConnected: ((this: WebSocket, ev: Event) => any) | null = null;
    onMessage: MessageFunc | null = null;
    onError: ((this: WebSocket, ev: Event) => any) | null = null;
    onClosed: ((this: WebSocket, ev: CloseEvent) => any) | null = null;

    connect(options: any) {
        if (this._ws) {
            if (this._ws.readyState === WebSocket.CONNECTING) {
                Logger.logNet("websocket connecting, wait for a moment...")
                return false;
            }
        }

        let url = null;
        if (options.url) {
            url = options.url;
        }
        else {
            let ip = options.ip;
            let port = options.port;
            let protocol = options.protocol;
            url = `${protocol}://${ip}:${port}`;
        }

        this._ws = new WebSocket(url);
        this._ws.binaryType = options.binaryType ? options.binaryType : "arraybuffer";
        this._ws.onmessage = (event) => {
            let onMessage: MessageFunc = this.onMessage!;
            onMessage(event.data);
        };
        this._ws.onopen = this.onConnected;
        this._ws.onerror = this.onError;
        this._ws.onclose = this.onClosed;
        return true;
    }

    send(buffer: NetData): number {
        if (this._ws && this._ws.readyState == WebSocket.OPEN) {
            this._ws.send(buffer);
            return 1;
        }
        return -1;
    }

    close(code?: number, reason?: string) {
        if (this._ws) {
            this._ws.close(code, reason);
        }
    }
}