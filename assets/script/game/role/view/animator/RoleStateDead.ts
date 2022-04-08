/*
 * @Author: dgflash
 * @Date: 2022-01-26 16:07:58
 * @LastEditors: dgflash
 * @LastEditTime: 2022-03-09 14:13:25
 */
/*
 * @Author: dgflash
 * @Date: 2021-09-01 15:19:04
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-25 10:05:40
 */

import { AnimatorStateLogic } from "../../../../core/libs/animator/core/AnimatorStateLogic";
import { Role } from "../../Role";
import { AnimationEventHandler } from "./AnimationEventHandler";

/** 受击状态逻辑 */
export class RoleStateDead extends AnimatorStateLogic {
    private role: Role;
    private anim: AnimationEventHandler;

    public constructor(role: Role, anim: AnimationEventHandler) {
        super();
        this.role = role;
        this.anim = anim;
        this.anim.addFrameEvent("dead", this.onDead, this);
    }

    private onDead() {
        var onHitActionComplete = this.role.RoleView.animator.onHitActionComplete;
        onHitActionComplete && onHitActionComplete();
    }

    public onEntry() {

    }

    public onUpdate() {

    }

    public onExit() {

    }
}

