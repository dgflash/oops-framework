/*
 * @Author: dgflash
 * @Date: 2022-04-14 17:08:01
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-16 10:05:54
 */
import { Animation, Component, Label, _decorator } from "cc";
import { LanguageLabel } from "../language/LanguageLabel";

const { ccclass, property } = _decorator;

@ccclass('Notify')
export class Notify extends Component {
    @property(Label)
    private lab_content: Label | null = null;

    @property(Animation)
    private animation: Animation | null = null;

    onLoad() {
        if (this.animation)
            this.animation.on(Animation.EventType.FINISHED, this.onFinished, this);
    }

    private onFinished() {
        this.node.destroy();
    }

    /**
     * 显示提示
     * @param msg       文本
     * @param useI18n   设置为 true 时，使用多语言功能 msg 参数为多语言 key
     */
    toast(msg: string, useI18n: boolean) {
        let label = this.lab_content?.getComponent(LanguageLabel)!;
        if (useI18n) {
            label.dataID = msg;
        }
        else {
            if (label)
                label.dataID = "";
            this.lab_content!.string = msg;
        }
    }
}