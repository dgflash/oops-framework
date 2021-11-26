/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2021-11-16 15:33:25
 */
import { Component, EventTouch, _decorator } from "cc";
import { engine } from "../../core/Engine";
import { tips } from "../../core/gui/prompt/TipsManager";

const { ccclass, property } = _decorator;

@ccclass('Demo')
export class Demo extends Component {
    private lang: boolean = true;

    onLoad() {
        console.log(engine.i18n.getLangByID("notify_show"));
    }

    private btn_language(event: EventTouch, data: any) {
        if (this.lang == false) {
            this.lang = true;
            engine.i18n.setLanguage("zh", () => {

            });
        }
        else {
            this.lang = false;
            engine.i18n.setLanguage("en", () => {

            });
        }
    }

    private btn_common_prompt(event: EventTouch, data: any) {
        tips.test(() => {

        });
        tips.test(() => {

        });
    }

    private btn_notify_show(event: EventTouch, data: any) {
        engine.gui.toast("common_prompt_content");
    }

    private netInstableOpen(event: EventTouch, data: any) {
        tips.netInstableOpen();
        setTimeout(() => {
            tips.netInstableClose();
        }, 2000);
    }

    private btn_audio_open1(event: EventTouch, data: any) {
        engine.audio.musicVolume = 0.5;
        engine.audio.playMusic("audios/nocturne");
    }

    private btn_audio_open2(event: EventTouch, data: any) {
        engine.audio.playEffect("audios/Gravel");
    }
}
