import { IVCam } from "../Datas/IVCam";
import { CameraHandler } from "../Handlers/CameraHandler";
import { ComposerHandler } from "../Handlers/ComposerHandler";
import { HardLookAtHandler } from "../Handlers/HardLookAtHandler";
import { BaseStage } from "./BaseStage";

export class AimStage extends BaseStage<IVCam> {
    private _handlers: CameraHandler[] = [
        new CameraHandler(this._vcam),
        new ComposerHandler(this._vcam),
        new HardLookAtHandler(this._vcam),
    ]

    public onEnable() {
        this._handlers.forEach(v => v.enable = true);
    }

    public onDisable() {
        this._handlers.forEach(v => v.enable = false);
    }

    public updateStage(deltaTime: number) {
        let aim = this._vcam.aim;
        let handler = this._handlers[aim.type];
        if (handler) {
            handler.updateCamera(deltaTime);
        }
    }
}