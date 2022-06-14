import { dragonBones, _decorator } from "cc";
import AnimatorBase, { AnimationPlayer } from "./core/AnimatorBase";
import { AnimatorStateLogic } from "./core/AnimatorStateLogic";

const { ccclass, property, requireComponent, disallowMultiple } = _decorator;

/** 
 * DragonBones状态机组件
 */
@ccclass
@disallowMultiple
@requireComponent(dragonBones.ArmatureDisplay)
export default class AnimatorDragonBones extends AnimatorBase {
    /** DragonBones组件 */
    private _dragonBones: dragonBones.ArmatureDisplay = null!;

    protected start() {
        if (!this.PlayOnStart || this._hasInit) {
            return;
        }
        this._hasInit = true;

        this._dragonBones = this.getComponent(dragonBones.ArmatureDisplay)!;
        this._dragonBones.addEventListener('complete', this.onAnimFinished, this);

        if (this.AssetRawUrl !== null) {
            this.initJson(this.AssetRawUrl.json);
        }
    }

    /**
     * 手动初始化状态机，可传入0-3个参数，类型如下
     * - onStateChangeCall 状态切换时的回调
     * - stateLogicMap 各个状态逻辑控制
     * - animationPlayer 自定义动画控制
     * @override
     */
    public onInit(...args: Array<Map<string, AnimatorStateLogic> | ((fromState: string, toState: string) => void) | AnimationPlayer>) {
        if (this.PlayOnStart || this._hasInit) {
            return;
        }
        this._hasInit = true;

        this.initArgs(...args);

        this._dragonBones = this.getComponent(dragonBones.ArmatureDisplay)!;
        this._dragonBones.addEventListener('complete', this.onAnimFinished, this);

        if (this.AssetRawUrl !== null) {
            this.initJson(this.AssetRawUrl.json);
        }
    }

    /**
     * 播放动画
     * @override
     * @param animName 动画名
     * @param loop 是否循环播放
     */
    protected playAnimation(animName: string, loop: boolean) {
        if (animName)
            this._dragonBones.playAnimation(animName, loop ? 0 : -1);
    }

    /**
     * 缩放动画播放速率
     * @override
     * @param scale 缩放倍率
     */
    protected scaleTime(scale: number) {
        if (scale > 0)
            this._dragonBones.timeScale = scale;
    }
}
