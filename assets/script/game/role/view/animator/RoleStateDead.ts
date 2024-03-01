/*
 * @Author: dgflash
 * @Date: 2022-01-26 16:07:58
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-14 19:56:19
 */
import { AnimatorStateLogic } from "../../../../../../extensions/oops-plugin-framework/assets/libs/animator/core/AnimatorStateLogic";
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

