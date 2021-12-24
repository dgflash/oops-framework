import { Camera, director, Vec2, Vec3 } from "cc";
import { CinestaionImpulseSource } from "./CinestaionImpulseSource";
import { Nullable } from "./Common/Types";
import { VirtualCamera } from "./VirtualCamera";

let __ndc = new Vec3();

class CinestationData {
    private _vcam: Nullable<VirtualCamera> = null;
    private _vcamSolo: Nullable<VirtualCamera> = null;
    private _virtualCameras: VirtualCamera[] = [];
    private _impulseSources: CinestaionImpulseSource[] = [];

    public lerpTime: number = 0;
    public blendTime: number = -1;
    public mainCamera: Nullable<Camera> = null;

    public get vcam(): Nullable<VirtualCamera> {
        if (this._vcam === null) {
            this._vcam = this.getPriorCamera();
        }
        return this._vcam;
    }

    public set vcam(v: Nullable<VirtualCamera>) {
        if (this._vcam !== v) {
            this._vcam = v;
            for (let vcam of this._virtualCameras) {
                if (vcam === v) vcam.onActive();
                else vcam.onDeActive();
            }
        }
    }

    public get vcams() {
        return this._virtualCameras;
    }

    public get impulseSources() {
        return this._impulseSources;
    }

    public activeCamera(vcam: Nullable<VirtualCamera>, blendTime: number = -1) {
        if (this._vcamSolo !== vcam) {
            this._vcamSolo = vcam;
            this.lerpTime = 0;
            this.blendTime = blendTime;
        }
    }

    public addCamera(vcam: VirtualCamera) {
        let index = this._virtualCameras.indexOf(vcam);
        if (index === -1) {
            this._virtualCameras.push(vcam);
        }
    }

    public removeCamera(vcam: VirtualCamera) {
        let index = this._virtualCameras.indexOf(vcam);
        if (index !== -1) {
            this._virtualCameras.splice(index, 1);
        }
    }

    public addImpulseSource(source: CinestaionImpulseSource) {
        let index = this._impulseSources.indexOf(source);
        if (index === -1) {
            this._impulseSources.push(source);
        }
    }

    public removeImpulseSource(source: CinestaionImpulseSource) {
        let index = this._impulseSources.indexOf(source);
        if (index !== -1) {
            this._impulseSources.splice(index, 1);
        }
    }

    public getPriorCamera() {
        return this._vcamSolo || this._virtualCameras.filter(v => v.enabled).sort((a, b) => b.priority - a.priority)[0];
    }

    public worldToScreen(out: Vec2, wpos: Vec3) {
        if (this.mainCamera) {
            let camera = CC_EDITOR ? cce.Camera.camera.camera : this.mainCamera.camera;
            let ndc = Vec3.transformMat4(__ndc, wpos, camera.matViewProj);
            let uv = ndc.add(Vec3.ONE).multiplyScalar(0.5);
            out.set(uv.x, uv.y);
        }
        return out;
    }
}

export const cinestation = new CinestationData();