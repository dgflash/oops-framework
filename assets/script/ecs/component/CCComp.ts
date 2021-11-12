/*
 * @Author: dgflash
 * @Date: 2021-11-11 19:05:32
 * @LastEditors: dgflash
 * @LastEditTime: 2021-11-12 11:46:24
 */

import { Component, _decorator } from "cc";
import { ecs } from "../../core/libs/ECS";

const { ccclass, property } = _decorator;

/** 
 * ECS结合Cocos Creator组件
 * 使用方法：
 * 1、ECS结合Cocos Creator组件可独立形成一个ECS的复杂视图实例对象
 * 2、对网络游戏，优先有数据对象，在才创建视图组件的流程，在释放视图组件时，不释放数据对象
 */
@ccclass('CCComp')
export abstract class CCComp extends Component implements ecs.IComp {
    static tid: number = -1;
    static compName: string;

    canRecycle!: boolean;
    ent!: ecs.Entity;

    onLoad() {
        this.ent = ecs.createEntity();
        this.ent.add(this);
    }

    onDestroy() {
        this.ent.destroy();
    }

    abstract reset(): void;
}