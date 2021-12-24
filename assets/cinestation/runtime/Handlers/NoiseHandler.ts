import { IVCam } from "../Datas/IVCam";
import { NoiseGenerator } from "../NoiseGenerator";
import { CameraHandler } from "./CameraHandler";

export class NoiseHandler extends CameraHandler<IVCam> {
    private _generator: NoiseGenerator = new NoiseGenerator();

    public onEnable() {
        this._generator.reset();
    }

    public updateCamera(deltaTime: number) {
        let vcam = this._vcam;
        let values = this._generator.fractalNoise(vcam.noise, deltaTime);
        NoiseGenerator.ApplyNoise(values, vcam);
    }
}