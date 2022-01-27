/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-27 11:30:18
 */
import { Component, EventTouch, _decorator } from "cc";
import { engine } from "../../core/Engine";
import { tips } from "../../core/gui/prompt/TipsManager";
import { ecs } from "../../core/libs/ECS";
import { Account } from "../account/Account";
import { SingletonModuleComp } from "../common/ecs/SingletonModuleComp";

const { ccclass, property } = _decorator;

@ccclass('Demo')
export class Demo extends Component {
    private lang: boolean = true;

    onLoad() {
        var account = new Account();
        account.requestLoadPlayer();
        ecs.getSingleton(SingletonModuleComp).account = account;
    }

    /** 多语言切换 */
    private btn_language(event: EventTouch, data: any) {
        console.log(engine.i18n.getLangByID("notify_show"));

        if (this.lang == false) {
            this.lang = true;
            engine.i18n.setLanguage("zh", () => { });
        }
        else {
            this.lang = false;
            engine.i18n.setLanguage("en", () => { });
        }
    }

    /** 弹出提示框 */
    private btn_common_prompt(event: EventTouch, data: any) {
        tips.test(() => {

        });
        tips.test(() => {

        });
    }

    /** 漂浮提示框 */
    private btn_notify_show(event: EventTouch, data: any) {
        engine.gui.toast("common_prompt_content");
    }

    /** 加载提示 */
    private netInstableOpen(event: EventTouch, data: any) {
        tips.netInstableOpen();
        setTimeout(() => {
            tips.netInstableClose();
        }, 2000);
    }

    /** 背景音乐 */
    private btn_audio_open1(event: EventTouch, data: any) {
        engine.audio.musicVolume = 0.5;
        engine.audio.playMusic("audios/nocturne");
    }

    /** 背景音效 */
    private btn_audio_open2(event: EventTouch, data: any) {
        engine.audio.playEffect("audios/Gravel");
    }
}
