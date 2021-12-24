import { game, _decorator } from "cc";
import { CinestationSmoothPath } from "../CinestationSmoothPath";
import { CinestationEvent } from "../Common/Events";
import { Nullable } from "../Common/Types";
import { VCamAutoDoly } from "./VCamAutoDolly";
const { ccclass, property } = _decorator;

@ccclass("VCamTracked")
export class VCamTracked {
    @property({ visible: false })
    private _progress: number = 0;

    @property({
        tooltip: "相机移动的路径。\n此属性必须是CinestationSmoothPath",
        animatable: false, type: CinestationSmoothPath
    })
    path: Nullable<CinestationSmoothPath> = null;

    @property({
        tooltip: "移动进度。\n数值0表示第一个位置点，数值1表示第二个位置点，以此类推。",
    })
    get progress() {
        return this._progress;
    }
    set progress(v: number) {
        if (this._progress !== v) {
            this._progress = v;
            if (CC_EDITOR) game.emit(CinestationEvent.EDITOR_CHANGED );
        }
    }

    @property({
        tooltip: "跟随阻尼系数。\n数字越小相机越灵敏，越大越迟顿",
        animatable: false, range: [0.1, 5], step: 0.1, slide: true
    })
    damping: number = 1;

    @property({
        animatable: false, type: VCamAutoDoly
    })
    autoDolly: VCamAutoDoly = new VCamAutoDoly();
}