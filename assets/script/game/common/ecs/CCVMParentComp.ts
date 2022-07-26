/*
 * @Author: dgflash
 * @Date: 2021-11-11 19:05:32
 * @LastEditors: dgflash
 * @LastEditTime: 2022-07-25 17:05:53
 */

import { _decorator } from 'cc';
import { ecs } from '../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS';
import VMParent from '../../../../../extensions/oops-plugin-framework/assets/libs/model-view/VMParent';

const { ccclass, property } = _decorator;

/** 
 * Cocos Creator Component + ECS Comp + VM VMParent
 * 使用方法：
 * 1、对象拥有Cocos引擎组件功能、ECS 组件全局访问功能、显示对象与数据结构绑定功能
 * 2、网络游戏，优先有数据对象，然后才创建视图组件，在释放视图组件时，不释放数据对象
 * 3、对象自带监听、释放、发送全局消息功能
 * 4、对象管理的所有节点摊平，直接通过节点名获取cc.Node对象（节点名不能有重名）
 */
@ccclass('CCVMParentComp')
export abstract class CCVMParentComp extends VMParent implements ecs.IComp {
    static tid: number = -1;
    static compName: string;

    canRecycle!: boolean;
    ent!: ecs.Entity;

    abstract reset(): void;
}