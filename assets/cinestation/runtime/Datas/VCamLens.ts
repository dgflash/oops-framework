import { game, _decorator } from "cc";
import { CinestationEvent } from "../Common/Events";
const { ccclass, property } = _decorator;

@ccclass("VCamLens")
export class VCamLens {

    @property({ visible: false })
    private _fov: number = 45;

    @property({ visible: false })
    private _near: number = 1;

    @property({ visible: false })
    private _far: number = 1000;

    @property
    get fov() {
        return this._fov;
    }
    set fov(v: number) {
        if (this._fov !== v) {
            this._fov = v;
            if (CC_EDITOR) game.emit(CinestationEvent.LENS_CHANGED);
        }
    }

    @property
    get near() {
        return this._near;
    }
    set near(v: number) {
        if (this._near !== v) {
            this._near = v;
            if (CC_EDITOR) game.emit(CinestationEvent.LENS_CHANGED);
        }
    }

    @property
    get far() {
        return this._far;
    }
    set far(v: number) {
        if (this._far !== v) {
            this._far = v;
            if (CC_EDITOR) game.emit(CinestationEvent.LENS_CHANGED);
        }
    }
}
