// import { sp, _decorator } from "cc";
// import AnimatorSpineSecondary from "./AnimatorSpineSecondary";
// import AnimatorBase, { AnimationPlayer } from "./core/AnimatorBase";
// import AnimatorStateLogic from "./core/AnimatorStateLogic";

// const { ccclass, property, requireComponent, disallowMultiple } = _decorator;

// /** 
//  * Spine状态机组件（主状态机），trackIndex为0
//  */
// @ccclass
// @disallowMultiple
// @requireComponent(sp.Skeleton)
// export default class AnimatorSpine extends AnimatorBase {
//     /** spine组件 */
//     private _spine: sp.Skeleton = null!;
//     /** 动画完成的回调 */
//     private _completeListenerMap: Map<(entry?: any) => void, any> = new Map();
//     /** 次状态机注册的回调 */
//     private _secondaryListenerMap: Map<(entry?: any) => void, AnimatorSpineSecondary> = new Map();

//     protected start() {
//         if (!this.PlayOnStart || this._hasInit) {
//             return;
//         }
//         this._hasInit = true;

//         this._spine = this.getComponent(sp.Skeleton)!;
//         this._spine.setCompleteListener(this.onSpineComplete.bind(this));

//         if (this.AssetRawUrl !== null) {
//             this.initJson(this.AssetRawUrl.json);
//         }
//     }

//     /**
//      * 手动初始化状态机，可传入0-3个参数，类型如下
//      * - onStateChangeCall 状态切换时的回调
//      * - stateLogicMap 各个状态逻辑控制
//      * - animationPlayer 自定义动画控制
//      * @override
//      */
//     public onInit(...args: Array<Map<string, AnimatorStateLogic> | ((fromState: string, toState: string) => void) | AnimationPlayer>) {
//         if (this.PlayOnStart || this._hasInit) {
//             return;
//         }
//         this._hasInit = true;

//         this.initArgs(...args);

//         this._spine = this.getComponent(sp.Skeleton)!;
//         this._spine.setCompleteListener(this.onSpineComplete.bind(this));

//         if (this.AssetRawUrl !== null) {
//             this.initJson(this.AssetRawUrl.json);
//         }
//     }

//     private onSpineComplete(entry: any) {
//         entry.trackIndex === 0 && this.onAnimFinished();
//         this._completeListenerMap.forEach((target, cb) => { target ? cb.call(target, entry) : cb(entry); });
//         this._secondaryListenerMap.forEach((target, cb) => { entry.trackIndex === target.TrackIndex && cb.call(target, entry); });
//     }

//     /**
//      * 播放动画
//      * @override
//      * @param animName 动画名
//      * @param loop 是否循环播放
//      */
//     protected playAnimation(animName: string, loop: boolean) {
//         if (animName) {
//             this._spine.setAnimation(0, animName, loop);
//         } else {
//             this._spine.clearTrack(0);
//         }
//     }

//     /**
//      * 缩放动画播放速率
//      * @override
//      * @param scale 缩放倍率
//      */
//     protected scaleTime(scale: number) {
//         if (scale > 0)
//             this._spine.timeScale = scale;
//     }

//     /**
//      * 注册次状态机动画结束的回调（状态机内部方法，不能由外部直接调用）
//      */
//     public addSecondaryListener(cb: (entry?: any) => void, target: AnimatorSpineSecondary) {
//         this._secondaryListenerMap.set(cb, target);
//     }

//     /**
//      * 注册动画完成时的监听
//      * @param cb 回调
//      * @param target 调用回调的this对象
//      */
//     public addCompleteListener(cb: (entry?: any) => void, target: any = null) {
//         if (this._completeListenerMap.has(cb)) {
//             return;
//         }
//         this._completeListenerMap.set(cb, target);
//     }

//     /**
//      * 注销动画完成的监听
//      * @param cb 回调
//      */
//     public removeCompleteListener(cb: (entry?: any) => void) {
//         this._completeListenerMap.delete(cb);
//     }

//     /**
//      * 清空动画完成的监听
//      */
//     public clearCompleteListener() {
//         this._completeListenerMap.clear;
//     }
// }
