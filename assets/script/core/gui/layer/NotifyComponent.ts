import { Animation, Label, _decorator } from "cc";
import { GameComponent } from "../../common/component/GameComponent";
import { LanguageLabel } from "../language/LanguageLabel";

const { ccclass, property } = _decorator;

@ccclass('NotifyComponent')
export class NotifyComponent extends GameComponent {
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
     * @param useI18n   多语言标签
     * @param callback  提示动画播放完成回调
     */
    public toast(msg: string, useI18n: boolean) {
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