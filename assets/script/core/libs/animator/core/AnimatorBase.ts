import { Component, JsonAsset, _decorator } from 'cc';
import AnimatorController from "./AnimatorController";
import AnimatorState from "./AnimatorState";
import { AnimatorStateLogic } from './AnimatorStateLogic';

const { ccclass, property, executionOrder, menu } = _decorator;

/**
 * 自定义控制动画播放的接口
 */
export interface AnimationPlayer {
    /** 设置动画播放结束的回调 */
    onFinishedCallback(target: AnimatorBase): void;
    /** 设置动画帧事件的回调 */
    onFrameEventCallback(type: string, target: AnimatorBase): void
    /** 播放动画 */
    playAnimation(animName: string, loop: boolean): void;
    /** 缩放动画播放速率 */
    scaleTime(scale: number): void;
}

/**
 * 状态机组件基类 优先执行生命周期
 */
@ccclass
@executionOrder(-1000)
@menu('animator/AnimatorBase')
export default class AnimatorBase extends Component {
    /** ---------- 后续扩展代码 开始 ---------- */

    /** 三维骨骼动画动画帧自定义事件 */
    private onFrameEvent(param: string) {
        this._animationPlayer?.onFrameEventCallback(param, this);
    }

    /** ---------- 后续扩展代码 结束 ---------- */

    @property({ type: JsonAsset, tooltip: '状态机json文件' })
    protected AssetRawUrl: JsonAsset = null!;

    @property({ tooltip: '是否在start中自动启动状态机' })
    protected PlayOnStart: boolean = true;

    @property({ tooltip: '是否在update中自动触发状态机逻辑更新' })
    protected AutoUpdate: boolean = true;

    /** 是否初始化 */
    protected _hasInit: boolean = false;
    /** 状态机控制 */
    protected _ac: AnimatorController = null!;

    /** 各个状态逻辑控制，key为状态名 */
    protected _stateLogicMap: Map<string, AnimatorStateLogic> = null!;
    /** 状态切换时的回调 */
    protected _onStateChangeCall: (fromState: string, toState: string) => void = null!;
    /** 自定义的动画播放控制器 */
    protected _animationPlayer: AnimationPlayer = null!;

    /** 当前状态名 */
    public get curStateName(): string {
        return this._ac.curState.name;
    }
    /** 当前动画名 */
    public get curStateMotion(): string {
        return this._ac.curState.motion;
    }

    /** 获取指定状态 */
    public getState(name: string): AnimatorState | undefined {
        return this._ac.states.get(name);
    }

    /**
     * 手动初始化状态机，可传入0-3个参数，类型如下
     * - onStateChangeCall 状态切换时的回调
     * - stateLogicMap 各个状态逻辑控制
     * - animationPlayer 自定义动画控制
     * @virtual
     */
    public onInit(...args: Array<Map<string, AnimatorStateLogic> | ((fromState: string, toState: string) => void) | AnimationPlayer>) {
    }

    /**
     * 处理初始化参数
     */
    protected initArgs(...args: Array<Map<string, AnimatorStateLogic> | ((fromState: string, toState: string) => void) | AnimationPlayer>) {
        args.forEach((arg) => {
            if (!arg) {
                return;
            }
            if (typeof arg === 'function') {
                this._onStateChangeCall = arg;
            }
            else if (typeof arg === 'object') {
                if (arg instanceof Map) {
                    this._stateLogicMap = arg;
                }
                else {
                    this._animationPlayer = arg;
                }
            }
        });
    }

    private updateAnimator() {
        // 混合当前动画播放速度
        let playSpeed = this._ac.curState.speed;
        if (this._ac.curState.multi) {
            playSpeed *= this._ac.params.getNumber(this._ac.curState.multi) || 1;
        }
        this.scaleTime(playSpeed);

        // 更新AnimatorStateLogic
        if (this._stateLogicMap) {
            let curLogic = this._stateLogicMap.get(this._ac.curState.name);
            curLogic && curLogic.onUpdate();
        }

        // 更新状态机逻辑
        this._ac.updateAnimator();
    }

    protected update() {
        if (this._hasInit && this.AutoUpdate) {
            this.updateAnimator();
        }
    }

    /**
     * 手动调用更新
     */
    public manualUpdate() {
        if (this._hasInit && !this.AutoUpdate) {
            this.updateAnimator();
        }
    }

    /**
     * 解析状态机json文件
     */
    protected initJson(json: any) {
        this._ac = new AnimatorController(this, json);
    }

    /**
     * 动画结束的回调
     */
    protected onAnimFinished() {
        this._ac.onAnimationComplete();
        this._animationPlayer?.onFinishedCallback(this);
    }

    /**
     * 播放动画
     * @virtual
     * @param animName 动画名
     * @param loop 是否循环播放
     */
    protected playAnimation(animName: string, loop: boolean) {
    }

    /**
     * 缩放动画播放速率
     * @virtual
     * @param scale 缩放倍率
     */
    protected scaleTime(scale: number) {
    }

    /** 
     * 状态切换时的逻辑（状态机内部方法，不能由外部直接调用）
     */
    public onStateChange(fromState: AnimatorState, toState: AnimatorState) {
        this.playAnimation(toState.motion, toState.loop);

        let fromStateName = fromState ? fromState.name : '';

        if (this._stateLogicMap) {
            let fromLogic = this._stateLogicMap.get(fromStateName);
            fromLogic && fromLogic.onExit();
            let toLogic = this._stateLogicMap.get(toState.name);
            toLogic && toLogic.onEntry();
        }

        this._onStateChangeCall && this._onStateChangeCall(fromStateName, toState.name);
    }

    /**
     * 设置boolean类型参数的值
     */
    public setBool(key: string, value: boolean) {
        this._ac.params.setBool(key, value);
    }

    /**
     * 获取boolean类型参数的值
     */
    public getBool(key: string): boolean {
        return this._ac.params.getBool(key) !== 0;
    }

    /**
     * 设置number类型参数的值
     */
    public setNumber(key: string, value: number) {
        this._ac.params.setNumber(key, value);
    }

    /**
     * 获取number类型参数的值
     */
    public getNumber(key: string): number {
        return this._ac.params.getNumber(key);
    }

    /**
     * 设置trigger类型参数的值
     */
    public setTrigger(key: string) {
        this._ac.params.setTrigger(key);
    }

    /**
     * 重置trigger类型参数的值
     */
    public resetTrigger(key: string) {
        this._ac.params.resetTrigger(key);
    }

    /**
     * 设置autoTrigger类型参数的值（autoTrigger类型参数不需要主动reset，每次状态机更新结束后会自动reset）
     */
    public autoTrigger(key: string) {
        this._ac.params.autoTrigger(key);
    }

    /**
     * 无视条件直接跳转状态
     * @param 状态名
     */
    public play(stateName: string) {
        if (!this._hasInit) {
            return;
        }
        this._ac.play(stateName);
    }
}
