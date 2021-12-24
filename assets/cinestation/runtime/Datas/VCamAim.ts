import { Enum, _decorator } from "cc";
import { VCamComposer } from "./VCamComposer";
import { VCamHardLook } from "./VCamHardLook";
const { ccclass, property } = _decorator;

export enum AimType {
    None = 0,
    Composer = 1,
    HardLookAt = 2,
}

@ccclass("VCamAim")
export class VCamAim {

    @property({ type: Enum(AimType) })
    type: AimType = AimType.Composer;

    @property({ type: VCamComposer, visible() { return this.type === AimType.Composer } })
    composer: VCamComposer = new VCamComposer();

    @property({ type: VCamHardLook, visible() { return this.type === AimType.HardLookAt } })
    hardLookat: VCamHardLook = new VCamHardLook();
}