/*
 * @Author: dgflash
 * @Date: 2022-04-14 17:08:01
 * @LastEditors: dgflash
 * @LastEditTime: 2022-04-14 18:26:24
 */
import { _decorator } from "cc";
import LabelNumber from "./LabelNumber";

const { ccclass, property, menu } = _decorator;

/** 数值变化动画标签组件 */
@ccclass("LabelChange")
@menu('ui/label/LabelChange')
export class LabelChange extends LabelNumber {
    @property
    isInteger: boolean = false;

    private duration: number = 0;            // 持续时间
    private callback: Function | undefined;  // 完成回调
    private isBegin: boolean = false;        // 是否开始
    private speed: number = 0;               // 变化速度
    private end: number = 0;                 // 最终值

    /**
     * 变化到某值,如果从当前开始的begin传入null
     * @param {number} duration 
     * @param {number} end 
     * @param {Function} [callback]
     */
    public changeTo(duration: number, end: number, callback?: Function) {
        if (duration == 0) {
            if (callback) callback();
            return;
        }
        this.playAnim(duration, this.num, end, callback);
    }


    /**
     * 变化值,如果从当前开始的begin传入null
     * @param {number} duration 
     * @param {number} value 
     * @param {Function} [callback] 
     * @memberof LabelChange
     */
    public changeBy(duration: number, value: number, callback?: Function) {
        if (duration == 0) {
            if (callback) callback();
            return;
        }
        this.playAnim(duration, this.num, this.num + value, callback);
    }

    /** 立刻停止 */
    public stop(excCallback: boolean = true) {
        this.num = this.end;
        this.isBegin = false;
        if (excCallback && this.callback) this.callback();
    }

    /** 播放动画 */
    private playAnim(duration: number, begin: number, end: number, callback?: Function) {
        this.duration = duration;
        this.end = end;
        this.callback = callback;
        this.speed = (end - begin) / duration;

        this.num = begin;
        this.isBegin = true;
    }

    /** 是否已经结束 */
    private isEnd(num: number): boolean {
        if (this.speed > 0) {
            return num >= this.end;
        }
        else {
            return num <= this.end;
        }
    }

    update(dt: number) {
        if (this.isBegin) {
            if (this.num == this.end) {
                this.isBegin = false;
                if (this.callback) this.callback();
                return;
            }
            let num = this.num + dt * this.speed;
            if (this.isInteger) num = Math.ceil(num);

            /** 变化完成 */
            if (this.isEnd(num)) {
                num = this.end;
                this.isBegin = false;
                if (this.callback) this.callback();
            }
            this.num = num;
        }
    }
}