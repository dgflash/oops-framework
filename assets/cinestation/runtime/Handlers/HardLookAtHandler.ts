import { Quat, Vec3 } from "cc";
import { Vec4_closeTo } from "../Common/Math";
import { IVCam } from "../Datas/IVCam";
import { CameraHandler } from "./CameraHandler";

let __worldPos = new Vec3();
let __worldDir = new Vec3();
let __rotation = new Quat();

export class HardLookAtHandler extends CameraHandler<IVCam> {

    public updateCamera(deltaTime: number) {
        let vcam = this._vcam;
        if (vcam.lookAt) {
            let hardLookat = vcam.aim.hardLookat;
            Vec3.add(__worldPos, vcam.lookAt.position, hardLookat.trackedObjectOffset);
            if (vcam.lookAt.parent) {
                __worldPos.add(vcam.lookAt.parent.worldPosition);
            }
            vcam.lookaheadPosition.set(__worldPos);
            Vec3.subtract(__worldDir, vcam.node.worldPosition, __worldPos).normalize();
            Quat.fromViewUp(__rotation, __worldDir);
            if (!Vec4_closeTo(__rotation, vcam.node.worldRotation)) {
                vcam.node.worldRotation = __rotation;
            }
        }
    }
}