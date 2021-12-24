import { IVCam } from "../Datas/IVCam";
import { CameraHandler } from "../Handlers/CameraHandler";
import { NoiseHandler } from "../Handlers/NoiseHandler";
import { BaseStage } from "./BaseStage";

export class NoiseStage extends BaseStage<IVCam> {
    private _handlers: CameraHandler[] = [
        new CameraHandler(this._vcam),
        new NoiseHandler(this._vcam)
    ]

    public onEnable() {
        this._handlers.forEach(v => v.enable = true);
    }

    public updateStage(deltaTime: number) {
        let noise = this._vcam.noise;
        let handler = this._handlers[noise.type];
        if (handler) {
            handler.updateCamera(deltaTime);
        }
    }
}