/*
 * @Author: dgflash
 * @Date: 2021-08-11 16:41:12
 * @LastEditors: dgflash
 * @LastEditTime: 2022-04-07 17:25:04
 */

import { Component, _decorator } from 'cc';
import { EffectSingleCase } from './EffectSingleCase';
const { ccclass, property } = _decorator;

/**
 * 延时释放特效
 * 注：场景中频繁有特效添加和释放时，可考虑使用对象池优化创建对象的性能开销
 */
@ccclass('EffectDelayRelease')
export class EffectDelayRelease extends Component {
    /** 延时释放时间(单位秒) */
    @property
    public delay: number = 1;

    start() {
        this.scheduleOnce(this.onDelay, this.delay);
    }

    private onDelay() {
        EffectSingleCase.instance.put(this.node);
    }
}
