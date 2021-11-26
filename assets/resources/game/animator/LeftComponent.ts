/*
 * @Author: dgflash
 * @Date: 2021-11-16 14:30:24
 * @LastEditors: dgflash
 * @LastEditTime: 2021-11-18 10:32:14
 */
import { _decorator, animation, sp } from "cc";
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

@ccclass("LeftComponent")
export class LeftComponent extends animation.StateMachineComponent {
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
        console.log("LEFT");

        var spine: sp.Skeleton = controller.getComponent(sp.Skeleton)!;
        spine.setAnimation(0, "huaxian/sideStand", true);
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
