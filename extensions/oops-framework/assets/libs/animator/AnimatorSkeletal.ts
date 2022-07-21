/*
 * @Author: dgflash
 * @Date: 2021-06-30 13:56:26
 * @LastEditors: dgflash
 * @LastEditTime: 2021-11-04 10:46:00
 */

import { CCFloat, game, SkeletalAnimation, _decorator } from 'cc';
import AnimatorAnimation from './AnimatorAnimation';

const { ccclass, property, requireComponent, disallowMultiple, menu } = _decorator;

@ccclass
@disallowMultiple
@requireComponent(SkeletalAnimation)
@menu('animator/AnimatorSkeletal')
export class AnimatorSkeletal extends AnimatorAnimation {
    @property({
        type: CCFloat,
        tooltip: "动画切换过度时间"
    })
    private duration: number = 0.3;

    private cross_duration: number = 0;         // 防止切换动画时间少于间隔时间导致动画状态错乱的问题
    private current_time: number = 0;           // 上一次切换状态时间

    onLoad() {
        this.cross_duration = this.duration * 1000;
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

        if (game.totalTime - this.current_time > this.cross_duration) {
            this._animation.crossFade(animName, this.duration);
        }
        else {
            this._animation.play(animName);
        }
        this.current_time = game.totalTime;

        this._animState = this._animation.getState(animName);
        if (!this._animState) {
            return;
        }
        if (!this._wrapModeMap.has(this._animState)) {
            this._wrapModeMap.set(this._animState, this._animState.wrapMode);
        }
        // this._animState.wrapMode = loop ? 2 : this._wrapModeMap.get(this._animState)!;
        this._animState.wrapMode = loop ? 2 : 1;   // 2为循环播放，1为单次播放
    }
}
