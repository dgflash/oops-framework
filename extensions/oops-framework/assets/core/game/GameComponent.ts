/*
 * @Author: dgflash
 * @Date: 2022-04-14 17:08:01
 * @LastEditors: dgflash
 * @LastEditTime: 2022-04-14 19:07:39
 */
import { Component, _decorator } from "cc";
import { EventDispatcher } from "../common/event/EventDispatcher";

const { ccclass } = _decorator;

@ccclass("GameComponent")
export class GameComponent extends Component {
    private _eventDispatcher: EventDispatcher | null = null;

    public get eventDispatcher(): EventDispatcher {
        if (!this._eventDispatcher) {
            this._eventDispatcher = new EventDispatcher();
        }
        return this._eventDispatcher;
    }

    // 事件是否绑定node的active
    private _isBindMessageActive: boolean = false;

    /** 绑定node active属性，即只有active为true才会响应事件 */
    public bindMessageActive() {
        this._isBindMessageActive = true;
    }

    /** 解绑node active属性，无论node是否可见都会响应事件 */
    public unbindMessageActive() {
        this._isBindMessageActive = false;
    }

    /**
     * 注册全局事件
     * @param event(string)      事件名
     * @param listener(function) 处理事件的侦听器函数
     * @param thisObj(object)    侦听函数绑定的this对象
     */
    public on(event: string, listener: Function, thisObj: any) {
        this.eventDispatcher.on(event, (event, args) => {
            if (!this.isValid) {
                if (this._eventDispatcher) {
                    this._eventDispatcher.destroy();
                    this._eventDispatcher = null;
                }
                return;
            }

            if (this._isBindMessageActive) {
                if (this.node.active) {
                    listener.call(thisObj, event, args);
                }
            }
            else {
                listener.call(thisObj, event, args);
            }
        }, thisObj);
    }

    /**
     * 移除全局事件
     * @param event(string)      事件名
     */
    public off(event: string) {
        if (this._eventDispatcher) {
            this._eventDispatcher.off(event);
        }
    }

    /** 
     * 触发全局事件 
     * @param event(string)      事件名
     * @param arg(Array)         事件参数
     */
    public dispatchEvent(event: string, arg = null) {
        this.eventDispatcher.dispatchEvent(event, arg);
    }

    onDestroy() {
        if (this._eventDispatcher) {
            this._eventDispatcher.destroy();
            this._eventDispatcher = null;
        }
    }
}