/*
 * @Author: dgflash
 * @Date: 2021-09-01 15:19:04
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-25 09:45:20
 */
import { AnimatorStateLogic } from "../../../../core/libs/animator/core/AnimatorStateLogic";
import { Role } from "../../Role";
import { AnimationEventHandler } from "./AnimationEventHandler";

/** 受击状态逻辑 */
export class RoleStateHit extends AnimatorStateLogic {
    private role: Role;
    private anim: AnimationEventHandler;

    public constructor(role: Role, anim: AnimationEventHandler) {
        super();
        this.role = role;
        this.anim = anim;
    }


    public onEntry() {

    }

    public onUpdate() {

    }

    public onExit() {
        var onHitActionComplete = this.role.RoleView.animator.onHitActionComplete;
        onHitActionComplete && onHitActionComplete();
    }
}

