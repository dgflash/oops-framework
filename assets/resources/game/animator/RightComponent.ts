/*
 * @Author: dgflash
 * @Date: 2021-11-16 14:30:24
 * @LastEditors: dgflash
 * @LastEditTime: 2021-11-18 10:32:12
 */
import { _decorator, animation, sp, v3 } from "cc";
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = AnimationGraphComponent
 * DateTime = Tue Nov 16 2021 14:30:24 GMT+0800 (中国标准时间)
 * Author = dgflash
 * FileBasename = AnimationGraphComponent.ts
 * FileBasenameNoExtension = AnimationGraphComponent
 * URL = db://assets/resources/game/animator/AnimationGraphComponent.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass("RightComponent")
export class RightComponent extends animation.StateMachineComponent {
    /**
     * Called when a motion state right after it entered.
     * @param controller The animation controller it within.
     * @param stateStatus The status of the motion.
     */
    public onMotionStateEnter(controller: animation.AnimationController, stateStatus: Readonly<animation.StateStatus>): void {
        // Can be overrode
    }

    /**
     * Called when a motion state is going to be exited.
     * @param controller The animation controller it within.
     * @param stateStatus The status of the motion.
     */
    public onMotionStateExit(controller: animation.AnimationController, stateStatus: Readonly<animation.StateStatus>): void {
        // Can be overrode
    }

    /**
     * Called when a motion state updated except for the first and last frame.
     * @param controller The animation controller it within.
     * @param stateStatus The status of the motion.
     */
    public onMotionStateUpdate(controller: animation.AnimationController, stateStatus: Readonly<animation.StateStatus>): void {
        // Can be overrode
    }

    /**
     * Called when a state machine right after it entered.
     * @param controller The animation controller it within.
     * @param stateStatus The status of the motion.
     */
    public onStateMachineEnter(controller: animation.AnimationController) {
        // Can be overrode
        console.log("RIGHT");

        var spine: sp.Skeleton = controller.getComponent(sp.Skeleton)!;
        spine.setAnimation(0, "huaxian/sideStand", true);
        spine.node.setScale(v3(-1, 1, 1))
    }

    /**
     * Called when a state machine right after it entered.
     * @param controller The animation controller it within.
     * @param stateStatus The status of the motion.
     */
    public onStateMachineExit(controller: animation.AnimationController) {
        // Can be overrode
    }
}
