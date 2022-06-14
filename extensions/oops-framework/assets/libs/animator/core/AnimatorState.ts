import AnimatorController from "./AnimatorController";
import AnimatorTransition from "./AnimatorTransition";

/**
 * 状态管理类
 */
export default class AnimatorState {
    private _name: string = "";
    private _motion: string = "";
    private _loop: boolean = false;
    private _speed: number = 1;
    private _multi: string = "";

    private _transitions: AnimatorTransition[] = [];
    private _ac: AnimatorController = null!;

    /** 状态名 */
    public get name() { return this._name; }
    /** 动画名 */
    public get motion() { return this._motion; }
    /** 动画是否循环播放 */
    public get loop() { return this._loop; }
    /** 动画播放速度的混合参数 */
    public get multi() { return this._multi; }
    /** 动画播放速度 */
    public get speed() { return this._speed; }
    public set speed(value: number) { this._speed = value; }

    constructor(data: any, ac: AnimatorController) {
        this._name = data.state;
        this._motion = data.motion || '';
        this._loop = data.loop || false;
        this._speed = data.speed || 1;
        this._multi = data.multiplier || '';

        this._ac = ac;

        for (let i = 0; i < data.transitions.length; i++) {
            let transition: AnimatorTransition = new AnimatorTransition(data.transitions[i], ac);
            transition.isValid() && this._transitions.push(transition);
        }
    }

    /**
     * 判断各个分支是否满足条件，满足则转换状态
     */
    public checkAndTrans() {
        for (let i = 0; i < this._transitions.length; i++) {
            let transition: AnimatorTransition = this._transitions[i];
            if (transition && transition.check()) {
                transition.doTrans();
                return;
            }
        }
    }
}
