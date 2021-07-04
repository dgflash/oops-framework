// import { sp, _decorator } from "cc";
// import AnimatorSpine from "./AnimatorSpine";
// import AnimatorBase, { AnimationPlayer } from "./core/AnimatorBase";
// import AnimatorStateLogic from "./core/AnimatorStateLogic";

// const { ccclass, property, requireComponent } = _decorator;

// /** 
//  * Spine状态机组件（次状态机），同一节点可添加多个，用于在不同track中播放动画，trackIndex必须大于0
//  */
// @ccclass
// @requireComponent(sp.Skeleton)
// export default class AnimatorSpineSecondary extends AnimatorBase {
//     @property({ tooltip: '动画播放的trackIndex，必须大于0' }) TrackIndex: number = 1;

//     /** 主状态机 */
//     private _main: AnimatorSpine = null!;
//     /** spine组件 */
//     private _spine: sp.Skeleton = null!;

//     protected start() {
//         if (!this.PlayOnStart || this._hasInit) {
//             return;
//         }
//         this._hasInit = true;

//         this._spine = this.getComponent(sp.Skeleton)!;
//         this._main = this.getComponent(AnimatorSpine)!;
//         this._main.addSecondaryListener(this.onAnimFinished, this);

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
//         this._main = this.getComponent(AnimatorSpine)!;
//         this._main.addSecondaryListener(this.onAnimFinished, this);

//         if (this.AssetRawUrl !== null) {
//             this.initJson(this.AssetRawUrl.json);
//         }
//     }

//     /**
//      * 播放动画
//      * @override
//      * @param animName 动画名
//      * @param loop 是否循环播放
//      */
//     protected playAnimation(animName: string, loop: boolean) {
//         if (animName) {
//             this._spine.setAnimation(this.TrackIndex, animName, loop);
//         } else {
//             this._spine.clearTrack(this.TrackIndex);
//         }
//     }
// }
