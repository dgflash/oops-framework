/*
 * @Author: dgflash
 * @Date: 2021-11-16 14:30:24
 * @LastEditors: dgflash
 * @LastEditTime: 2021-12-28 17:53:51
 */
import { animation, sp, v3, _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass("RightComponent")
export class RightComponent extends animation.StateMachineComponent {
    /**
     * Called when a motion state right after it entered.
     * @param controller The animation controller it within.
     * @param stateStatus The status of the motion.
     */
    public onMotionStateEnter(controller: animation.AnimationController, stateStatus: Readonly<animation.StateStatus>): void {
        // Can be overrode
        // console.log("onMotionStateEnter");
        console.log("RIGHT", controller.getValue("dir"));

        var spine: sp.Skeleton = controller.getComponent(sp.Skeleton)!;
        spine.setAnimation(0, "huaxian/sideStand", true);
        spine.node.setScale(v3(-1, 1, 1))
    }

    /**
     * Called when a motion state is going to be exited.
     * @param controller The animation controller it within.
     * @param stateStatus The status of the motion.
     */
    public onMotionStateExit(controller: animation.AnimationController, stateStatus: Readonly<animation.StateStatus>): void {

    }

    /**
     * Called when a motion state updated except for the first and last frame.
     * @param controller The animation controller it within.
     * @param stateStatus The status of the motion.
     */
    public onMotionStateUpdate(controller: animation.AnimationController, stateStatus: Readonly<animation.StateStatus>): void {

    }

    /**
     * Called when a state machine right after it entered.
     * @param controller The animation controller it within.
     * @param stateStatus The status of the motion.
     */
    public onStateMachineEnter(controller: animation.AnimationController) {

    }

    /**
     * Called when a state machine right after it entered.
     * @param controller The animation controller it within.
     * @param stateStatus The status of the motion.
     */
    public onStateMachineExit(controller: animation.AnimationController) {

    }
}
