import { Animation, AnimationClip, EventTouch, _decorator } from "cc";
import { resLoader } from "../../common/loader/ResLoader";
import ButtonSimple from "./ButtonSimple";

const { ccclass, property, menu } = _decorator;

@ccclass("ButtonEffect")
@menu('ui/button/ButtonEffect')
export default class ButtonEffect extends ButtonSimple {
    @property({
        tooltip: "是否开启"
    })
    disabledEffect: boolean = false;

    private anim!: Animation;

    onLoad() {
        this.anim = this.node.addComponent(Animation);

        var ac_start = resLoader.get("common/anim/button_scale_start", AnimationClip)!;
        var ac_end = resLoader.get("common/anim/button_scale_end", AnimationClip)!;
        this.anim.defaultClip = ac_start;
        this.anim.createState(ac_start, ac_start?.name);
        this.anim.createState(ac_end, ac_end?.name);

        super.onLoad();
    }

    protected onTouchtStart(event: EventTouch) {
        if (!this.disabledEffect) {
            this.anim.play("button_scale_start");
        }
    }

    protected onTouchEnd(event: EventTouch) {
        if (!this.disabledEffect) {
            this.anim.play("button_scale_end");
        }

        super.onTouchEnd(event);
    }
}