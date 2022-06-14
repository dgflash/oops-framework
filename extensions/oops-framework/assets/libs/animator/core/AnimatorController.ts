import { error } from "cc";
import AnimatorBase from "./AnimatorBase";
import AnimatorParams from "./AnimatorParams";
import AnimatorState from "./AnimatorState";

/**
 * 状态机控制类
 */
export default class AnimatorController {
    private _jsonData: any = null;
    private _animator: AnimatorBase = null!;

    private _params: AnimatorParams = null!;
    private _states: Map<string, AnimatorState> = null!;
    private _anyState: AnimatorState = null!;
    private _curState: AnimatorState = null!;

    /** 状态切换次数 */
    private _changeCount: number = 0;
    /** 对应animComplete的状态 */
    public animCompleteState: AnimatorState = null!;
    /** 动画播放完毕的标记 */
    public animComplete: boolean = false;
    /** 当前运行的状态 */
    public get curState(): AnimatorState { return this._curState; }
    public get params(): AnimatorParams { return this._params; }
    public get states(): Map<string, AnimatorState> { return this._states }

    constructor(player: AnimatorBase, json: any) {
        this._animator = player;
        this._jsonData = json;
        this._states = new Map<string, AnimatorState>();
        this._params = new AnimatorParams(json.parameters);
        this.init(json);
    }

    /**
     * 初始化状态机所有动画状态
     */
    private init(json: any) {
        if (json.states.length <= 0) {
            error(`[AnimatorController.init] 状态机json错误`);
            return;
        }

        let defaultState: string = json.defaultState;
        this._anyState = new AnimatorState(json.anyState, this);
        for (let i = 0; i < json.states.length; i++) {
            let state: AnimatorState = new AnimatorState(json.states[i], this);
            this._states.set(state.name, state);
        }
        this.changeState(defaultState);
    }

    private updateState() {
        this._curState.checkAndTrans();
        if (this._curState !== this._anyState && this._anyState !== null) {
            this._anyState.checkAndTrans();
        }
    }

    /**
     * 更新状态机逻辑
     */
    public updateAnimator() {
        // 重置计数
        this._changeCount = 0;

        this.updateState();

        // 重置动画完成标记
        if (this.animComplete && this.animCompleteState.loop) {
            this.animComplete = false;
        }
        // 重置autoTrigger
        this.params.resetAllAutoTrigger();
    }

    public onAnimationComplete() {
        this.animComplete = true;
        this.animCompleteState = this._curState;
        // cc.log(`animation complete: ${this._curState.name}`);
    }

    /**
     * 无视条件直接跳转状态
     * @param 状态名
     */
    public play(stateName: string) {
        if (!this._states.has(stateName) || this._curState.name === stateName) {
            return;
        }

        // 重置动画完成标记
        this.animComplete = false;
        this.changeState(stateName);
    }

    /**
     * 切换动画状态
     */
    public changeState(stateName: string) {
        this._changeCount++;
        if (this._changeCount > 1000) {
            error('[AnimatorController.changeState] error: 状态切换递归调用超过1000次，transition设置可能出错!');
            return;
        }

        if (this._states.has(stateName) && (this._curState === null || this._curState.name !== stateName)) {
            let oldState = this._curState;
            this._curState = this._states.get(stateName)!;

            this._animator.onStateChange(oldState, this._curState);

            this.updateState();
        }
        else {
            error(`[AnimatorController.changeState] error state: ${stateName}`);
        }
    }
}
