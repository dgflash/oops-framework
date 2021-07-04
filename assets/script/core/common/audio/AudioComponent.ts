// import { AudioSourceComponent, _decorator } from 'cc';
// const { ccclass, menu } = _decorator;

// /**
//  * 3D声音，通过发音对象与玩家对象之间的距离来动态调整音乐的音量
//  * 注：
//  * 组件自动加到音乐管理器中统一管理状态
//  */

// @ccclass('AudioComponent')
// @menu('game/audio/AudioComponent')
// export class AudioComponent extends AudioSourceComponent {
//     private speed: number = 10;              // 数值越大越慢
//     private startTime: number = 0;           // 开始时间

//     start() {
//         this.startTime = performance.now();
//         this.clip!.once('started', () => {

//         });
//     }

//     /**
//      * 设置音乐当前播放进度
//      * @param progress 进度百分比
//      */
//     public setCurrentTime(progress: number) {
//         this.currentTime = progress * this.duration;
//     }

//     /**
//      * 正玄线性插值
//      * @param start 音量初始值
//      * @param end 音量结束值
//      * @param t 时间变量
//      */
//     private sineLerp(start: number, end: number) {
//         var t = (performance.now() - this.startTime) / (this.speed * 1000);
//         return start + (end - start) * (Math.sin((t - 0.5) * Math.PI) + 1) * 0.5;
//     }

//     update(dt: number) {
//         this.volume = this.sineLerp(1, 0.1);
//     }
// }
