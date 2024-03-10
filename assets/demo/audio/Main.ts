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
        oops.res.loadDir("common");

        this.sliderMusicHandle.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.sliderMusicHandle.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.sliderMusicHandle.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart() {
        this.enabled = false;
    }

    onTouchEnd() {
        this.enabled = true;

        // 设置背景音乐进度
        oops.audio.progressMusic = this.sliderMusic.progress;
    }

    update(deltaTime: number) {
        var p = oops.audio.progressMusic;
        if (p > 0)
            this.sliderMusic.progress = p;
    }

    /** 播放背景音乐 */
    onBtnMusic() {
        // 监听音乐播放完成事件（正常播放完、音乐强制停止时触发）
        oops.audio.setMusicComplete(() => {
            oops.gui.toast("音乐播放完成");
            oops.audio.music.release();             // 释放背景音乐资源
            oops.audio.effect.releaseAll();         // 释放背景音乐资源
            // oops.audio.effect.release("");
        });

        // 播放背景音乐（只需要传递音乐资源地址，框架会自动加载完音乐资源后开始播放音乐）
        oops.audio.playMusic("audios/nocturne");
    }

    /** 暂停当前音乐与音效的播放 */
    onPauseAll() {
        oops.audio.pauseAll();
    }

    /** 恢复当前暂停的音乐与音效播放 */
    onResumeAll() {
        oops.audio.resumeAll();
    }

    /** 停止当前音乐与音效的播放 */
    onStopAll() {
        oops.audio.stopAll();
    }

    /** 调解背景音乐音量 */
    onSliderMusicVolume(slider: Slider, customEventData: string) {
        // 设置背景音乐音量
        oops.audio.volumeMusic = slider.progress;
        // 设置音效音量
        oops.audio.volumeEffect = slider.progress;
    }

    /** 播放音效 */
    onBtnEffect() {
        oops.audio.playEffect("audios/Gravel");
    }

    /** 保存音乐音效的音量、开关配置数据到本地 */
    onBtnSave() {
        oops.audio.save();
    }

    /** 本地加载音乐音效的音量、开关配置数据并设置到游戏中 */
    onBtnLoad() {
        oops.audio.load();
    }
}