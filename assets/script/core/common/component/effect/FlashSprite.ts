import { Component, Material, Sprite, _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FlashSprite')
export default class FlashSprite extends Component {
    duration: number = 0.5;
    _median: number = 0;
    _time: number = 0;

    _material: Material = null!;

    onLoad() {
        this._median = this.duration / 2;
        // 获取材质
        this._material = this.node.getComponent(Sprite)!.getMaterial(0)!;
        // 设置材质对应的属性
        this._material.setProperty("u_rate", 1);
    }

    update(dt: number) {
        if (this._time > 0) {
            this._time -= dt;

            this._time = this._time < 0 ? 0 : this._time;
            let rate = Math.abs(this._time - this._median) * 2 / this.duration;
            this._material.setProperty("u_rate", rate);
        }
    }

    clickFlash() {
        this._time = this.duration;
    }
}
