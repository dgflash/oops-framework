/*
 * @Author: dgflash
 * @Date: 2022-07-14 10:57:43
 * @LastEditors: dgflash
 * @LastEditTime: 2022-07-18 14:24:55
 */
import { Node, Slider, _decorator } from 'cc';
import { oops } from '../../../extensions/oops-plugin-framework/assets/core/Oops';
import { Root } from '../../../extensions/oops-plugin-framework/assets/core/Root';

const { ccclass, property } = _decorator;

/** 音乐管理模块功能演示 oops-framework/assets/core/common/audio  */
@ccclass('Main')
export class Main extends Root {
    @property({ type: Slider })
    sliderMusic: Slider = null!;

    @property({ type: Slider })
    sliderMusicVolume: Slider = null!;

    @property({ type: Node })
    sliderMusicHandle: Node = null!;

    start() {
        oops.audio.volumeMusic = this.sliderMusicVolume.progress;

        this.sliderMusicHandle.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.sliderMusicHandle.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.sliderMusicHandle.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart() {
        this.enabled = false;
    }

    onTouchEnd() {
        this.enabled = true;
        oops.audio.progressMusic = this.sliderMusic.progress;
    }

    update(deltaTime: number) {
        var p = oops.audio.progressMusic;
        if (p > 0)
            this.sliderMusic.progress = p;
    }

    /** 播放背景音乐 */
    onBtnMusic() {
        oops.audio.setMusicComplete(() => {
            oops.gui.toast("音乐播放完成");
        });
        oops.audio.playMusic("audios/nocturne");
    }

    /** 调解背景音乐音量 */
    onSliderMusicVolume(slider: Slider, customEventData: string) {
        oops.audio.volumeMusic = slider.progress;
    }

    /** 播放背景音效 */
    onBtnEffect() {
        oops.audio.playEffect("audios/Gravel");
    }

    onBtnSave() {
        oops.audio.save();
    }

    onBtnLoad() {
        oops.audio.load();
    }
}