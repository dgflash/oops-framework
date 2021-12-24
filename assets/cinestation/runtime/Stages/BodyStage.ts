import { IVCam } from "../Datas/IVCam";
import { CameraHandler } from "../Handlers/CameraHandler";
import { FreeLookHandler } from "../Handlers/FreeLookHandler";
import { TrackedHandler } from "../Handlers/TrackedHandler";
import { BaseStage } from "./BaseStage";

export class BodyStage extends BaseStage<IVCam> {
    private _handlers: CameraHandler[] = [
        new CameraHandler(this._vcam),
        new FreeLookHandler(this._vcam),
        new TrackedHandler(this._vcam),
    ]
    public onEnable() {
        this._handlers.forEach(v => v.enable = true);
    }
    public onDisable() {
        this._handlers.forEach(v => v.enable = false);
    }
    public updateStage(deltaTime: number) {
        let body = this._vcam.body;
        let handler = this._handlers[body.type];
        if (handler) {
            handler.updateCamera(deltaTime);
        }
    }
}