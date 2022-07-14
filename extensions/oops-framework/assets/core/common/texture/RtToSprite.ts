import { Camera, Component, EventTouch, gfx, Node, RenderTexture, Sprite, SpriteFrame, UITransform, Vec3, _decorator } from 'cc';
const { ccclass, property } = _decorator;

/** 三维模型显示到二维精灵上 */
@ccclass('RtToSprite')
export class RtToSprite extends Component {
    @property({
        type: Camera,
        tooltip: "渲染模型的三维摄像机"
    })
    camera: Camera | null = null;

    @property({
        type: Sprite,
        tooltip: "显示模型的二维精灵组件"
    })
    sprite: Sprite | null = null;

    @property({
        tooltip: "是否触摸控制旋转"
    })
    rotation: boolean = false;

    @property({
        type: Node,
        tooltip: "三维模型",
        visible: function () {
            //@ts-ignore
            return this.rotation === true;
        },
    })
    model: Node | null = null;

    private rt: RenderTexture = new RenderTexture();
    private touched = false;                             // 是否触摸节点

    start() {
        let size = this.sprite!.getComponent(UITransform)!;
        this.refreshRenderTexture(size.width, size.height);

        if (this.rotation) {
            this.sprite!.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
            this.sprite!.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
            this.sprite!.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
            this.sprite!.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        }
    }

    protected onTouchStart(event: EventTouch) {
        this.touched = true;
    }

    protected onTouchMove(event: EventTouch) {
        if (this.touched) {
            let eulerAngles: Vec3 = this.model!.eulerAngles;
            let deltaX = event.touch!.getDelta().x!;
            eulerAngles.y += -deltaX;
            this.model!.eulerAngles = eulerAngles;
        }
    }

    protected onTouchEnd(event: EventTouch) {
        this.touched = false;
    }

    /** 刷新纹理内容 */
    refreshRenderTexture(w: number, h: number): void {
        const colorAttachment = new gfx.ColorAttachment();
        const depthStencilAttachment = new gfx.DepthStencilAttachment();
        const pi = new gfx.RenderPassInfo([colorAttachment], depthStencilAttachment, []);

        this.rt.reset({
            width: w,
            height: h,
            passInfo: pi
        });

        let spriteframe: SpriteFrame = this.sprite!.spriteFrame!;
        let sp: SpriteFrame = new SpriteFrame();
        sp.reset({
            originalSize: spriteframe.originalSize,
            rect: spriteframe.rect,
            offset: spriteframe.offset,
            isRotate: spriteframe.rotated,
            borderTop: spriteframe.insetTop,
            borderLeft: spriteframe.insetLeft,
            borderBottom: spriteframe.insetBottom,
            borderRight: spriteframe.insetRight,
        });

        this.camera!.targetTexture = this.rt;
        sp.texture = this.rt;
        this.sprite!.spriteFrame = sp;
    }

    onDestroy() {
        if (this.rotation) {
            this.sprite!.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
            this.sprite!.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
            this.sprite!.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
            this.sprite!.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        }
        this.rt.destroy();
    }
}
