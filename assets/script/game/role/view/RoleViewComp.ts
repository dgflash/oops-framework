/*
 * @Author: dgflash
 * @Date: 2021-11-18 17:42:59
 * @LastEditors: dgflash
 * @LastEditTime: 2022-08-05 10:32:42
 */

import { sp, _decorator } from "cc";
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { CCComp } from "../../../../../extensions/oops-plugin-framework/assets/module/common/CCComp";
import { Role } from "../Role";
import { RoleEvent } from "../RoleEvent";
import { RoleViewAnimator } from "./RoleViewAnimator";
import { RoleViewController } from "./RoleViewController";
import { RoleViewLoader } from "./RoleViewLoader";

const { ccclass, property } = _decorator;

/** 角色显示组件 */
@ccclass('RoleViewComp')                   // 定义为 Cocos Creator 组件
@ecs.register('RoleView', false)           // 定义为 ECS 组件
export class RoleViewComp extends CCComp {
    @property({ type: sp.Skeleton, tooltip: '角色动画' })
    spine: sp.Skeleton = null!;

    /** 角色动画资源管理 */
    loader: RoleViewLoader = null!;
    /** 角色动画规则管理 */
    animator: RoleViewAnimator = null!;
    /** 角色控制器 */
    controller: RoleViewController = null!;

    /** 视图层逻辑代码分离演示 */
    onLoad() {
        var role = this.ent as Role;

        this.loader = this.node.addComponent(RoleViewLoader);
        this.node.emit("load", role);

        this.animator = this.spine.getComponent(RoleViewAnimator)!;
        this.animator.role = role;

        this.controller = this.node.addComponent(RoleViewController);
        this.controller.role = role;

        this.on(RoleEvent.ChangeJob, this.onHandler, this);
    }

    /** 业务层全局消息通知视图层逻辑处理，两层之间逻辑解耦合演示 */
    private onHandler(event: string, args: any) {
        switch (event) {
            case RoleEvent.ChangeJob:
                this.animator.refresh();
                break;
        }
    }

    reset() {
        this.node.destroy();
    }
}