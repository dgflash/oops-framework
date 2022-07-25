/*
 * 检测监听网络状态 
 * web模式基于HTML5 API
 */
import { log, sys } from "cc";
import { EventDispatcher } from "../../core/common/event/EventDispatcher";

export enum NetworkEvent {
    /** 网络变化事件 */
    CHANGE = "NetworkEvent.CHANGE"
}

/** 网络状态 */
export enum NetworkState {
    /** 未知 */
    UNKNOWN = "unknown",
    /** 联网在线 */
    ONLINE = "online",
    /** 断网 */
    OFFLINE = "offline"
}

export class Network extends EventDispatcher {
    private _state: NetworkState = NetworkState.UNKNOWN;
    constructor() {
        super()
        if (sys.isBrowser) {
            // web模式
            this._webInit();
        }
        else {
            // native模式 待补充
        }
    }

    /**
     * 获取网络状态
     */
    get state(): NetworkState {
        return this._state;
    }

    private changeState(state: NetworkState) {
        if (this._state === state) {
            return;
        }
        this._state = state;
        log("[Network] " + state);
        this.dispatchEvent(NetworkEvent.CHANGE, state);
    }

    private _webInit() {
        this._callback(navigator.onLine);

        let _window = <any>window;
        let el: any = document.body;
        if (el.addEventListener) {
            _window.addEventListener("online", () => {
                this._callback(true)
            }, true);
            _window.addEventListener("offline", () => {
                this._callback(false)
            }, true);
        }
        else if (el.attachEvent) {
            _window.attachEvent("ononline", () => {
                this._callback(true)
            });
            _window.attachEvent("onoffline", () => {
                this._callback(false)
            });
        }
        else {
            _window.ononline = () => {
                this._callback(true)
            };
            _window.onoffline = () => {
                this._callback(false)
            };
        }

        // PC模式用 online.js判断网络连接
        if (!sys.isMobile) {
            (<any>window).onLineHandler = () => {
                this._callback(true);
            }
            (<any>window).offLineHandler = () => {
                this._callback(false);
            }
        }
    }

    private _callback(online: boolean) {
        if (online) {
            this.changeState(NetworkState.ONLINE)
        }
        else {
            this.changeState(NetworkState.OFFLINE)
        }
    }
}

export const network = new Network();