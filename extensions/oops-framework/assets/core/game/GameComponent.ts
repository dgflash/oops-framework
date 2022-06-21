/*
 * @Author: dgflash
 * @Date: 2022-04-14 17:08:01
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-21 15:30:04
 */
import { Asset, Component, isValid, Node, _decorator } from "cc";
import { EventDispatcher } from "../common/event/EventDispatcher";
import { ViewUtil } from "../utils/ViewUtil";

const { ccclass } = _decorator;

/** 游戏显示对象组件模板 */
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

    /** 自动释放资源 */
    private dynamicsAssets: Asset[] = [];
    /** 摊平的节点集合（不能重名） */
    private nodes: Map<string, Node> = new Map();

    /** 通过节点名获取预制上的节点，整个预制不能有重名节点 */
    get(name: string): Node | undefined {
        return this.nodes.get(name);
    }

    onLoad() {
        ViewUtil.nodeTreeInfoLite(this.node, this.nodes);
    }

    /** 添加自动释放的资源 */
    addAutoReleaseAsset(asset: Asset) {
        if (isValid(asset)) {
            asset.addRef();
            this.dynamicsAssets.push(asset);
        }
    }

    /** 添加自动释放的资源数组 */
    addAutoReleaseAssets(assets: Asset[]) {
        assets.forEach(asset => {
            this.addAutoReleaseAsset(asset);
        });
    }

    /**
     * 注册全局事件
     * @param event(string)      事件名
     * @param listener(function) 处理事件的侦听器函数
     * @param thisObj(object)    侦听函数绑定的this对象
     */
    on(event: string, listener: Function, thisObj: any) {
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
    off(event: string) {
        if (this._eventDispatcher) {
            this._eventDispatcher.off(event);
        }
    }

    /** 
     * 触发全局事件 
     * @param event(string)      事件名
     * @param arg(Array)         事件参数
     */
    dispatchEvent(event: string, arg = null) {
        this.eventDispatcher.dispatchEvent(event, arg);
    }

    protected onDestroy() {
        // 释放消息对象
        if (this._eventDispatcher) {
            this._eventDispatcher.destroy();
            this._eventDispatcher = null;
        }

        // 节点引用数据清除
        this.nodes.clear();

        // 自动释放资源
        this.dynamicsAssets.forEach(asset => {
            asset.decRef();
        });
        this.dynamicsAssets.splice(0, this.dynamicsAssets.length);
    }
}