import { Vec3 } from "cc";
import { exponentialDamp, quarticDamp, Vec3_closeTo } from "../Common/Math";
import { IVCam } from "../Datas/IVCam";
import { CameraHandler } from "./CameraHandler";

let __worldPos = new Vec3();
export class TrackedHandler extends CameraHandler<IVCam> {

    public updateCamera(deltaTime: number) {
        let vcam = this._vcam;
        let tracked = vcam.body.tracked;
        if (tracked.path) {
            if (tracked.autoDolly.enable && vcam.follow) {
                let wpos = vcam.follow.worldPosition;
                let progress = tracked.path.findClosestPoint(wpos, tracked.progress, tracked.autoDolly.searchRadius, tracked.autoDolly.searchResolution); //TODO：startSegment
                tracked.progress = quarticDamp(tracked.progress, progress, tracked.damping, deltaTime);
            }
            tracked.path.evaluatePosition(__worldPos, tracked.progress);
        }
        if (!Vec3_closeTo(__worldPos, vcam.node.worldPosition)) {
            vcam.node.worldPosition = __worldPos;
        }
    }
}