import { game, Vec3, _decorator } from "cc";
import { CinestationEvent } from "../Common/Events";
const { ccclass, property } = _decorator;

@ccclass("VCamComposer")
export class VCamComposer {

    @property({ visible: false })
    private _deadZoneWidth: number = 0.1;

    @property({ visible: false })
    private _deadZoneHeight: number = 0.1;

    @property({ visible: false })
    private _softZoneWidth: number = 0.8;

    @property({ visible: false })
    private _softZoneHeight: number = 0.8;

    @property({
        tooltip: "从LookAt目标的中心作局部空间的位置偏移。 \n所需区域不是跟踪目标的中心时，微调跟踪目标的位置",
    })
    trackedObjectOffset: Vec3 = new Vec3();

    @property({
        tooltip: "根据LookAt目标的运动速度，动态调整偏移量。\n预估了目标将在未来几秒内出现的位置",
        range: [0, 1], step: 0.1, slide: true,
    })
    lookaheadTime: number = 0.2;

    @property({
        tooltip: "控制预估的阻尼系数。\n数值越大阻尼越强，预测越滞后，可以消除因为预测带来的抖动",
        range: [0.1, 2], step: 0.1, slide: true,
    })
    lookaheadDamping: number = 0.5;

    @property({
        tooltip: "瞄准目标的阻尼系数。\n数值越小，可以更快的将目标保持在死区，数值越大，瞄准速度越慢。",
        range: [0.1, 2], step: 0.1, slide: true,
    })
    lookatDamping: number = 0.3;

    @property({
        tooltip: "死区宽度。\n如果目标在死区内，相机则不会旋转",
        range: [0, 1], step: 0.01, slide: true,
    })
    get deadZoneWidth() {
        return this._deadZoneWidth;
    }
    set deadZoneWidth(v: number) {
        if (this._deadZoneWidth !== v) {
            this._deadZoneWidth = v;
            if (CC_EDITOR) game.emit(CinestationEvent.COMPOSER_CHANGED);
        }
    }

    @property({
        tooltip: "死区高度。\n如果目标在死区内，相机则不会旋转",
        range: [0, 1], step: 0.01, slide: true,
    })
    get deadZoneHeight() {
        return this._deadZoneHeight;
    }
    set deadZoneHeight(v: number) {
        if (this._deadZoneHeight !== v) {
            this._deadZoneHeight = v;
            if (CC_EDITOR) game.emit(CinestationEvent.COMPOSER_CHANGED);
        }
    }

    @property({
        tooltip: "软区宽度。\n如果目标在软区内，相机将在lookatDamping指定时间内旋转到死区",
        range: [0, 1], step: 0.01, slide: true,
    })
    get softZoneWidth() {
        return this._softZoneWidth;
    }
    set softZoneWidth(v: number) {
        if (this._softZoneWidth !== v) {
            this._softZoneWidth = v;
            if (CC_EDITOR) game.emit(CinestationEvent.COMPOSER_CHANGED);
        }
    }

    @property({
        tooltip: "软区高度。\n如果目标在软区内，相机将在lookatDamping指定时间内旋转到死区",
        range: [0, 1], step: 0.01, slide: true,
    })
    get softZoneHeight() {
        return this._softZoneHeight;
    }
    set softZoneHeight(v: number) {
        if (this._softZoneHeight !== v) {
            this._softZoneHeight = v;
            if (CC_EDITOR) game.emit(CinestationEvent.COMPOSER_CHANGED);
        }
    }
}
