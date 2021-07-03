import { Camera, Component, gfx, MeshRenderer, RenderTexture, view, _decorator } from 'cc';
const { ccclass, property } = _decorator;

/** 三维摄像机内容显示到模型上 */
@ccclass('RtToModel')
export class RtToModel extends Component {
    @property(Camera)
    camara: Camera = null!;

    @property(MeshRenderer)
    model: MeshRenderer = null!;

    private rt: RenderTexture = new RenderTexture();

    start() {
        const size = view.getVisibleSize();
        const colorAttachment = new gfx.ColorAttachment();
        const depthStencilAttachment = new gfx.DepthStencilAttachment();
        const pi = new gfx.RenderPassInfo([colorAttachment], depthStencilAttachment, []);

        this.rt.reset({
            width: size.width,
            height: size.height,
            passInfo: pi
        });

        this.camara.targetTexture = this.rt;
        const mat = this.model.material!;
        mat.setProperty('mainTexture', this.rt);
    }

    onDestroy() {
        this.rt.destroy();
    }
}
