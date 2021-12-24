import { Enum, game, Vec3, _decorator } from "cc";
import { CinestationEvent } from "../Common/Events";
import { VCamFreeLook } from "./VCamFreeLook";
import { VCamTracked } from "./VCamTracked";
const { ccclass, property } = _decorator;

export enum BodyType {
    None = 0,
    FreeLook = 1,
    Tracked = 2,
}

@ccclass("VCamBody")
export class VCamBody {

    @property({ visible: false })
    private _type: BodyType = BodyType.None;

    @property({ animatable: false, type: Enum(BodyType) })
    get type() {
        return this._type;
    }
    set type(v: BodyType) {
        if (this._type !== v) {
            this._type = v;
            if (CC_EDITOR) game.emit(CinestationEvent.EDITOR_CHANGED );
        }
    }

    @property({ animatable: false, type: VCamFreeLook, visible() { return this.type === BodyType.FreeLook } })
    freelook: VCamFreeLook = new VCamFreeLook();

    @property({ type: VCamTracked, visible() { return this.type === BodyType.Tracked } })
    tracked: VCamTracked = new VCamTracked();
}