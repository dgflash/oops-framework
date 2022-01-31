/*
 * @Author: dgflash
 * @Date: 2021-11-18 17:42:59
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-29 11:09:41
 */

import { EventTouch, Node, sp, UITransform, v3, _decorator } from "cc";
import { resLoader } from "../../../core/common/loader/ResLoader";
import { engine } from "../../../core/Engine";
import { ecs } from "../../../core/libs/ECS";
import { config } from "../../common/config/Config";
import { CCComp } from "../../common/ecs/CCComp";
import { RoleModelComp } from "../model/RoleModelComp";
import { RoleViewAnimatorComp } from "./RoleViewAnimatorComp";

const { ccclass, property } = _decorator;

/** 角色显示组件 */
@ccclass('RoleViewComp')
@ecs.register('RoleView', false)
export class RoleViewComp extends CCComp {
    @property({ type: sp.Skeleton, tooltip: '角色动画' })
    spine: sp.Skeleton | null = null;

    animator: RoleViewAnimatorComp = null!;

    onLoad() {
        this.node.active = false;

        this.animator = this.spine!.getComponent(RoleViewAnimatorComp)!;
    }

    load() {
        var name = "model1";
        var path = config.game.getRolePath(name);
        resLoader.load(path, sp.SkeletonData, (err, sd: sp.SkeletonData) => {
            if (err) {
                console.error(`动画名为【${path}】的角色资源不存在`);
                return;
            }

            this.spine!.skeletonData = sd;
            this.node.active = true;

            // 移动控制
            engine.gui.root.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        });
    }

    private onTouchEnd(event: EventTouch) {
        var role = this.ent.get(RoleModelComp).facade;
        var uit = this.node.parent!.getComponent(UITransform)!;
        role.move(v3(event.getUILocation().x - uit.contentSize.width / 2, event.getUILocation().y - uit.contentSize.height / 2));
    }

    reset() {
        this.node.destroy();
    }
}