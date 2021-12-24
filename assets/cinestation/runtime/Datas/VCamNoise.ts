import { Enum, Vec3, _decorator } from "cc";
import { NoiseProfile } from "../NoiseGenerator";
const { ccclass, property } = _decorator;

export enum NoiseType {
    None,
    Perlin,
}

@ccclass("VCamNoise")
export class VCamNoise {

    @property({ type: Enum(NoiseType) })
    type: NoiseType = NoiseType.None;

    @property({ 
        tooltip: "多种预置噪声参数",
        type: Enum(NoiseProfile), visible() { return this.type !== NoiseType.None } 
    })
    profile: NoiseProfile = NoiseProfile.Noise_CM_4;

    @property({ 
        tooltip: "幅度增益。数值越大相机晃动幅度越明显",
        visible() { return this.type !== NoiseType.None }
     })
    amplitudeGain: number = 1;

    @property({ 
        tooltip: "频率增益。数值越大相机晃动频率越高",
        visible() { return this.type !== NoiseType.None } 
    })
    frequncyGain: number = 1;
}
