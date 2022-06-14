import { Animation, AnimationState, _decorator } from "cc";
import AnimatorBase, { AnimationPlayer } from "./core/AnimatorBase";
import { AnimatorStateLogic } from "./core/AnimatorStateLogic";

const { ccclass, property, requireComponent, disallowMultiple, menu } = _decorator;

/** 
 * Cocos Animation状态机组件
 */
@ccclass
@disallowMultiple
@requireComponent(Animation)
@menu('animator/AnimatorAnimation')
export default class AnimatorAnimation extends AnimatorBase {
    /** Animation组件 */
    protected _animation: Animation = null!;
    /** 当前的动画实例 */
    protected _animState: AnimationState = null!;
    /** 记录初始的wrapmode */
    protected _wrapModeMap: Map<AnimationState, number> = new Map();

    protected start() {
        if (!this.PlayOnStart || this._hasInit) {
            return;
        }
        this._hasInit = true;

        this._animation = this.getComponent(Animation)!;
        this._animation.on(Animation.EventType.FINISHED, this.onAnimFinished, this);
        this._animation.on(Animation.EventType.LASTFRAME, this.onAnimFinished, this);

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

        this._animation = this.getComponent(Animation)!;
        this._animation.on(Animation.EventType.FINISHED, this.onAnimFinished, this);
        this._animation.on(Animation.EventType.LASTFRAME, this.onAnimFinished, this);

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
        if (!animName) {
            return;
        }

        this._animation.play(animName);
        this._animState = this._animation.getState(animName);
        if (!this._animState) {
            return;
        }
        if (!this._wrapModeMap.has(this._animState)) {
            this._wrapModeMap.set(this._animState, this._animState.wrapMode);
        }
        this._animState.wrapMode = loop ? 2 : this._wrapModeMap.get(this._animState)!;
    }

    /**
     * 缩放动画播放速率
     * @override
     * @param scale 缩放倍率
     */
    protected scaleTime(scale: number) {
        if (this._animState) {
            this._animState.speed = scale;
        }
    }
}
