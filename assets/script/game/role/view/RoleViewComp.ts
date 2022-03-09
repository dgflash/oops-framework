/*
 * @Author: dgflash
 * @Date: 2021-11-18 17:42:59
 * @LastEditors: dgflash
 * @LastEditTime: 2022-03-09 15:10:54
 */

import { sp, _decorator } from "cc";
import { ecs } from "../../../core/libs/ECS";
import { CCComp } from "../../common/ecs/CCComp";
import { Role } from "../Role";
import { RoleEvent } from "../RoleEvent";
import { RoleViewAnimator } from "./RoleViewAnimator";
import { RoleViewController } from "./RoleViewController";
import { RoleViewLoader } from "./RoleViewLoader";

const { ccclass, property } = _decorator;

/** 角色显示组件 */
@ccclass('RoleViewComp')
@ecs.register('RoleView', false)
export class RoleViewComp extends CCComp {
    @property({ type: sp.Skeleton, tooltip: '角色动画' })
    spine: sp.Skeleton = null!;

    /** 角色动画资源管理 */
    loader: RoleViewLoader = null!;
    /** 角色动画规则管理 */
    animator: RoleViewAnimator = null!;
    /** 角色控制器 */
    controller: RoleViewController = null!;

    onLoad() {
        var role = this.ent as Role;

        this.loader = this.node.addComponent(RoleViewLoader);
        this.loader.load(role.RoleModel.anim);

        this.animator = this.spine.getComponent(RoleViewAnimator)!;
        this.animator.role = role;

        this.controller = this.node.addComponent(RoleViewController);
        this.controller.role = role;

        this.on(RoleEvent.ChangeJob, this.onHandler, this);
    }

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