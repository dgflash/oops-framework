import { Vec3, _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass("VCamHardLook")
export class VCamHardLook {
    @property({
        tooltip: "从LookAt目标的中心作局部空间的位置偏移。 \n所需区域不是跟踪目标的中心时，微调跟踪目标的位置",
    })
    trackedObjectOffset: Vec3 = new Vec3();
}