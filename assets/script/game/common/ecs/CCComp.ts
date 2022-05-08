/*
 * @Author: dgflash
 * @Date: 2021-11-11 19:05:32
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-26 16:48:03
 */

import { Component, Node, _decorator } from 'cc';
import { EventDispatcher } from '../../../core/common/event/EventDispatcher';
import { ecs } from '../../../core/libs/ecs/ECS';
import { ViewUtil } from '../../../core/utils/ViewUtil';

const { ccclass, property } = _decorator;

/** 
 * ECS结合Cocos Creator组件
 * 使用方法：
 * 1、对象拥有Cocos引擎组件功能、ECS 组件全局访问功能
 * 2、网络游戏，优先有数据对象，在才创建视图组件的流程，在释放视图组件时，不释放数据对象
 * 3、对象自带监听、释放、发送全局消息功能
 * 4、对象管理的所有节点摊平，直接通过节点名获取cc.Node对象（节点名不能有重名）
 */
@ccclass('CCComp')
export abstract class CCComp extends Component implements ecs.IComp {
    static tid: number = -1;
    static compName: string;

    canRecycle!: boolean;
    ent!: ecs.Entity;

    abstract reset(): void;

    private nodes: Map<string, Node> = new Map();

    /** 通过节点名获取预制上的节点，整个预制不能有重名节点 */
    get(name: string): Node | undefined {
        return this.nodes.get(name);
    }

    onLoad() {
        ViewUtil.nodeTreeInfoLite(this.node, this.nodes);
    }

    //#region 全局事件管理
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
    public dispatchEvent(event: string, arg: any = null) {
        this.eventDispatcher.dispatchEvent(event, arg);
    }

    onDestroy() {
        if (this._eventDispatcher) {
            this._eventDispatcher.destroy();
            this._eventDispatcher = null;
        }

        this.nodes.clear();
    }
    //#endregion
}