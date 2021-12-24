import { cinestation } from "../CinestationData";
import { IVCam } from "../Datas/IVCam";
import { NoiseGenerator } from "../NoiseGenerator";
import { BaseStage } from "./BaseStage";

export class ImpulseStage extends BaseStage<IVCam> {

    public updateStage(deltaTime: number) {
        let vcam = this._vcam;
        let impulse = vcam.impulse;
        for (let source of cinestation.impulseSources) {
            if (source.node.layer & impulse.source) {
                let values = source.generateImpulse(deltaTime);
                if (values) {
                    NoiseGenerator.ApplyNoise(values, vcam);
                }
            }
        }
    }
}