import { Vec3, _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass("VCamFreeLook")
export class VCamFreeLook {
    @property({
        tooltip: "禁止水平方向旋转",
        animatable: false
    })
    forbidX: boolean = false;

    @property({
        tooltip: "禁止垂直方向旋转",
        animatable: false
    })
    forbidY: boolean = false;

    @property({
        tooltip: "禁止相机推移",
        animatable: false
    })
    forbidZ: boolean = false;

    @property({
        tooltip: "禁止相机平移",
        animatable: false
    })
    forbidPan: boolean = false;

    @property({
        tooltip: "旋转速度",
        animatable: false, range: [0.1, 5], step: 0.1, slide: true
    })
    rotateSpeed: number = 1;

    @property({
        tooltip: "旋转平滑系数。\n数值越大旋转惯性越大",
        animatable: false, range: [0.1, 5], step: 0.1, slide: true
    })
    rotateSmoothing: number = 0.5;

    @property({
        tooltip: "平移速度",
        animatable: false, range: [0.1, 5], step: 0.1, slide: true
    })
    panSpeed: number = 1;

    @property({
        tooltip: "平移平滑系数。\n数值越大平移惯性越大",
        animatable: false, range: [0.1, 5], step: 0.1, slide: true
    })
    panSmoothing: number = 0.5;

    @property({
        tooltip: "与Follow目标之间的位移，初始值为(0,0,-10)",
    })
    followOffset: Vec3 = new Vec3(0, 0, -10);

    @property({
        tooltip: "跟随阻尼系数。\n数字越小相机越灵敏，越大越迟顿",
        animatable: false, range: [0, 5], step: 0.1, slide: true
    })
    followDamping: number = 1;
}
