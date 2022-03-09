/*
 * @Author: dgflash
 * @Date: 2021-11-18 17:42:59
 * @LastEditors: dgflash
 * @LastEditTime: 2022-03-09 14:29:43
 */

import { sp, _decorator } from "cc";
import { ecs } from "../../../core/libs/ECS";
import { CCComp } from "../../common/ecs/CCComp";
import { Role } from "../Role";
import { RoleEvent } from "../RoleEvent";
import { RoleViewAnimator } from "./component/RoleViewAnimator";
import { RoleViewController } from "./component/RoleViewController";
import { RoleViewLoader } from "./component/RoleViewLoader";

const { ccclass, property } = _decorator;

/** 角色显示组件 - 管理业务功能方法的定义与模块之间交互处理 */
@ccclass('RoleViewComp')
@ecs.register('RoleView', false)
export class RoleViewComp extends CCComp {
    @property({ type: sp.Skeleton, tooltip: '角色动画' })
    spine: sp.Skeleton = null!;

    /** --- 演示显示层业务逻辑分离 --- */

    /** 资源加载管理 */
    loader: RoleViewLoader = null!;
    /** 动画状态机 */
    animator: RoleViewAnimator = null!;
    /** 角色控制器 */
    controller: RoleViewController = null!;

    onLoad() {
        this.on(RoleEvent.ChangeJob, this.onHandler, this);
    }

    /** 全局事件处理器 - 模块之间解耦合 */
    private onHandler(event: string, args: any) {
        switch (event) {
            case RoleEvent.ChangeJob:
                // 切换职业动画 - 演示业务层通过事件控制视图层逻辑，避免两层代码直接偶合
                this.animator.refresh();
                break;
        }
    }

    load() {
        this.loader = this.node.addComponent(RoleViewLoader);
        this.loader.load("model1");

        this.animator = this.spine.getComponent(RoleViewAnimator)!;
        this.animator.role = this.ent as Role;

        this.controller = this.node.addComponent(RoleViewController);
        this.controller.role = this.ent as Role;
    }

    reset() {
        this.node.destroy();
    }
}