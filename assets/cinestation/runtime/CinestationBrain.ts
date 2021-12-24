import { _decorator, Component, Node, Camera, lerp, clamp01, Enum, primitives, utils, Mesh, Material, Vec2, Vec3 } from 'cc';
import { cinestation } from './CinestationData';
import { cinestationShareAssets } from './CinestationShareAssets';
import { Nullable } from './Common/Types';
import { Visualization } from './Common/Visualization';
import { VirtualCamera } from './VirtualCamera';
const { ccclass, property, executionOrder, executeInEditMode } = _decorator;

export enum CinestationBlendStyle {
    Linear
}

@ccclass('CinestationBlendDefinition')
export class CinestationBlendDefinition {
    @property({
        tooltip: "混合插值类型。\n目前仅支持线行插值，后续会支持更多",
        type: Enum(CinestationBlendStyle)
    })
    public style: CinestationBlendStyle = CinestationBlendStyle.Linear;

    @property({
        tooltip: "切换时间。数值为0时，为直接切换"
    })
    public time: number = 4;
}

let __point = new Vec2();

@ccclass('CinestationBrain')
@executeInEditMode
@executionOrder(-1)
export class CinestationBrain extends Visualization {
    protected __selectedCamera: Nullable<VirtualCamera> = null;
    protected _material: Material = cinestationShareAssets.viewMaterial;
    protected _brainBlend: CinestationBlendDefinition = new CinestationBlendDefinition;
    protected _visibleInRuntime: boolean = true;

    @property(CinestationBlendDefinition)
    public get brainBlend() {
        return this._brainBlend;
    }

    public onLoad() {
        cinestation.mainCamera = this.getComponent(Camera);
        cinestation.lerpTime = this._brainBlend.time;
    }

    protected _updateMesh(mesh: Mesh) {
        return utils.createMesh(primitives.quad(), mesh);
    }

    public update(dt: number) {
        super.update(dt);

        let vcam = this._getActiveCamera();
        if (vcam == null) return;

        vcam.updateCamera(dt);

        let blendTime = cinestation.blendTime > -1 ? cinestation.blendTime : this.brainBlend.time;
        if (cinestation.lerpTime < blendTime) {
            cinestation.lerpTime += dt;
            this._lerpToMainCamera(vcam, clamp01(cinestation.lerpTime / this._brainBlend.time));
        }
        else {
            this._applyToMainCamera(vcam);
        }
    }

    private _getActiveCamera() {
        let vcam = cinestation.vcam = cinestation.getPriorCamera();
        this.visible = CC_EDITOR ? !!this.__selectedCamera : vcam && vcam.debug;
        this._setDebugProperties(CC_EDITOR ? this.__selectedCamera : vcam);
        return vcam;
    }

    private _setDebugProperties(vcam: Nullable<VirtualCamera>) {
        if (vcam && (CC_EDITOR || vcam.debug)) {
            if (vcam._composerChanged) {
                vcam._composerChanged = false;
                let composer = vcam.aim.composer;
                cinestationShareAssets.__setDebugProperty("deadZoneWidth", composer.deadZoneWidth);
                cinestationShareAssets.__setDebugProperty("deadZoneHeight", composer.deadZoneHeight);
                cinestationShareAssets.__setDebugProperty("softZoneWidth", composer.softZoneWidth);
                cinestationShareAssets.__setDebugProperty("softZoneHeight", composer.softZoneHeight);
            }
            if (vcam.lookAt) {
                cinestationShareAssets.__setDebugProperty("lookatPoint", cinestation.worldToScreen(__point, vcam.lookaheadPosition));
            }
        }
    }

    private _lerpToMainCamera(vcam: VirtualCamera, t: number) {
        if (CC_EDITOR) return;
        if (!cinestation.mainCamera) return;

        let from = cinestation.mainCamera, to = vcam;
        switch (this._brainBlend.style) {
            case CinestationBlendStyle.Linear: {
                from.node.worldPosition = from.node.worldPosition.lerp(to.finalPosition, t);
                from.node.worldRotation = from.node.worldRotation.lerp(to.finalRotation, t);
                from.fov = lerp(from.fov, to.lens.fov, t);
                from.near = lerp(from.near, to.lens.near, t);
                from.far = lerp(from.far, to.lens.far, t);
                break;
            }
        }
    }

    private _applyToMainCamera(vcam: VirtualCamera) {
        if (CC_EDITOR) return;
        if (!cinestation.mainCamera) return;

        let from = cinestation.mainCamera, to = vcam;
        from.node.worldPosition = to.finalPosition;
        from.node.worldRotation = to.finalRotation;
        from.fov = to.lens.fov;
        from.near = to.lens.near;
        from.far = to.lens.far;
    }
}