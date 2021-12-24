import { Enum, Layers, _decorator, } from "cc";
const { ccclass, property } = _decorator;

@ccclass("VCamImpulse")
export class VCamImpulse {
    @property({ type: Enum(Layers.Enum) })
    source: number = Layers.Enum.DEFAULT;
}
