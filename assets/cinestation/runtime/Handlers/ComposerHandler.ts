import { Quat, Vec2, Vec3, Vec4 } from "cc";
import { cinestation } from "../CinestationData";
import { Quat_quarticDamp, SmoothDamper, Vec4_closeTo } from "../Common/Math";
import { IVCam } from "../Datas/IVCam";
import { Predictor } from "../Predictor";
import { CameraHandler } from "./CameraHandler";

let __ndc = new Vec3();
let __worldPos = new Vec3();
let __rotation = new Quat();

export class ComposerHandler extends CameraHandler<IVCam> {
    private _predictor: Predictor = new Predictor();
    private _rotation: Quat = new Quat();
    private _smoothDamper: SmoothDamper = new SmoothDamper();

    public updateCamera(deltaTime: number) {
        let vcam = this._vcam;
        if (vcam.lookAt) {
            let composer = vcam.aim.composer;
            Vec3.add(__worldPos, vcam.lookAt.position, composer.trackedObjectOffset);
            if (vcam.lookAt.parent) {
                __worldPos.add(vcam.lookAt.parent.worldPosition);
            }
            this._predictor.predictPosition(vcam.lookaheadPosition, __worldPos, composer.lookaheadDamping, composer.lookaheadTime, deltaTime);
            this._clampWithDeadZone(__worldPos, vcam.lookaheadPosition);

            Quat.fromViewUp(this._rotation, Vec3.subtract(__worldPos, vcam.node.worldPosition, __worldPos).normalize());
            this._smoothDamper.Quat_smoothDamp(__rotation, vcam.node.worldRotation, this._rotation, composer.lookatDamping, deltaTime);

            if (!Vec4_closeTo(__rotation, vcam.node.worldRotation)) {
                vcam.node.worldRotation = __rotation;
            }
        }
    }

    private _clampWithDeadZone(out: Vec3, wpos: Vec3) {
        let composer = this._vcam.aim.composer;
        let mainCamera = cinestation.mainCamera;
        if (mainCamera) {
            let camera = mainCamera.camera;
            let ndc = Vec3.transformMat4(__ndc, wpos, camera.matViewProj);
            let uv = ndc.add(Vec3.ONE).multiplyScalar(0.5);
            let hw = composer.deadZoneWidth / 2;
            let hh = composer.deadZoneHeight / 2;

            out.set(0.5, 0.5, uv.z);
            if (uv.x < 0.5 - hw) {
                out.x += uv.x - 0.5 + hw;
            }
            if (uv.x > 0.5 + hw) {
                out.x += uv.x - 0.5 - hw;
            }
            if (uv.y < 0.5 - hh) {
                out.y += uv.y - 0.5 + hh;
            }
            if (uv.y > 0.5 + hh) {
                out.y += uv.y - 0.5 - hh;
            }

            out.multiplyScalar(2).subtract(Vec3.ONE);
            out.transformMat4(camera.matViewProjInv);
        }
        return out;
    }
}