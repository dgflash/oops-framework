import { game, _decorator } from "cc";
import { CinestationEvent } from "../Common/Events";
const { ccclass, property } = _decorator;

@ccclass("VCamAutoDoly")
export class VCamAutoDoly {
    @property({ visible: false })
    private _enable: boolean = true;

    @property({ visible: false })
    private _searchRadius: number = 2;

    @property({ visible: false })
    private _searchResolution: number = 5;

    @property({
        tooltip: "开启自动定位"
    })
    get enable() {
        return this._enable;
    }
    set enable(v: boolean) {
        if (this._enable !== v) {
            this._enable = v;
            if (CC_EDITOR) game.emit(CinestationEvent.EDITOR_CHANGED );
        }
    }

    @property({
        tooltip: "当前位置两侧搜索的片段数量。\n数值为0时，搜索整个路径"
    })
    get searchRadius() {
        return this._searchRadius;
    }
    set searchRadius(v: number) {
        if (this._searchRadius !== v) {
            this._searchRadius = v;
            if (CC_EDITOR) game.emit(CinestationEvent.EDITOR_CHANGED );
        }
    }

    @property({
        tooltip: "将轨道分成多个片段来搜索。\n数值越大，结果越精确，性能消耗也越大"
    })
    get searchResolution() {
        return this._searchResolution;
    }
    set searchResolution(v: number) {
        if (this._searchResolution !== v) {
            this._searchResolution = v;
            if (CC_EDITOR) game.emit(CinestationEvent.EDITOR_CHANGED );
        }
    }
}
