import { CCInteger, Component, error, Sprite, SpriteFrame, _decorator } from "cc";

const { ccclass, property, executeInEditMode, requireComponent, menu } = _decorator;

@ccclass
@executeInEditMode
@requireComponent(Sprite)
@menu("添加特殊行为/UI/Frame Index(帧图改变)")
export default class BhvFrameIndex extends Component {
    @property({
        type: [SpriteFrame],
        tooltip: 'sprite将会用到帧图片'
    })
    spriteFrames: Array<SpriteFrame | null> = [null];

    @property({
        type: CCInteger,
        tooltip: '当前显示的帧图'
    })
    get index() {
        return this._index;
    }
    set index(value: number) {
        if (value < 0) return;
        this._index = value % this.spriteFrames.length;
        let sprite = this.node.getComponent(Sprite)!;
        //设置 Sprite 组件的spriteFrame属性，变换图片               
        sprite.spriteFrame = this.spriteFrames[this._index];
    }

    @property
    private _index: number = 0;

    /** 通过设置帧名字来设置对象 */
    setName(name: string) {
        let index = this.spriteFrames.findIndex(v => { return v!.name == name });
        if (index < 0) { error('frameIndex 设置了不存在的name:', name) }
        this.index = index || 0;
    }

    /** 随机范围设置帧图片 */
    random(min?: number, max?: number) {
        if (!this.spriteFrames) return;
        let frameMax = this.spriteFrames.length;
        if (min == null || min < 0) min = 0;
        if (max == null || max > frameMax) max = frameMax;

        this.index = Math.floor(Math.random() * (max - min) + min);
    }

    next() {
        this.index++;
    }

    previous() {
        this.index--;
    }
}
