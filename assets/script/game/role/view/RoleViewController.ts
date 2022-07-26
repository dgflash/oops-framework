/*
 * @Author: dgflash
 * @Date: 2021-11-18 17:42:59
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-14 17:57:33
 */

import { Component, EventTouch, Node, UITransform, v3, _decorator } from "cc";
import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { Role } from "../Role";

const { ccclass, property } = _decorator;

/** 角色资源加载 */
@ccclass('RoleViewController')
export class RoleViewController extends Component {
    /** 角色对象 */
    role: Role = null!;

    onLoad() {
        oops.gui.game.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    private onTouchEnd(event: EventTouch) {
        // 注：角色移动控制代码在RPG类游戏中，应该设计到地图模块监听触摸事件。因为测试代码只有一个角色，为了简少DEMO代码量，只表达程序设计思想
        var uit = this.node.parent!.getComponent(UITransform)!;
        var x = event.getUILocation().x - uit.contentSize.width / 2;
        var y = event.getUILocation().y - uit.contentSize.height / 2;
        this.role.move(v3(x, y));

        if (x < this.role.RoleView.node.position.x)
            this.role.RoleView.animator.left();
        else
            this.role.RoleView.animator.right();
    }

    onDestroy() {
        oops.gui.game.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }
}