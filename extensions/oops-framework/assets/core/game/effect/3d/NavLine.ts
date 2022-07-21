/*
 * @Author: dgflash
 * @Date: 2022-03-25 10:53:30
 * @LastEditors: dgflash
 * @LastEditTime: 2022-03-25 23:43:25
 */

import { Color, Component, macro, MeshRenderer, Node, renderer, v2, Vec2, Vec3, _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NavLine - 导航钱组件')
export class NavLine extends Component {
    @property({ type: Node, displayName: "玩家模型节点" })
    player: Node = null!;

    @property({ type: MeshRenderer, displayName: "箭头网格", tooltip: "拖MeshRenderer组件到这里" })
    mesh: MeshRenderer = null!;

    @property({ displayName: "导航线颜色" })
    color: Color = new Color(255, 0, 0, 255);

    @property({ displayName: "执行间隔", tooltip: "多少帧执行一次，数值越大动画越流程，建议3-5", min: 1 })
    interval = 5;

    @property({ displayName: "箭头速度", tooltip: "控制材质texture位移，数值越大动画播放越快", min: 0.1 })
    speed = 2;

    @property({ displayName: "箭头密度", tooltip: "控制箭头的密度，数值越大越密", min: 0.1 })
    density = 1;

    @property({ displayName: "角度变化", tooltip: "箭头是否有 x 欧拉角度变化，有高度的地形引导开启" })
    xEuler = true;

    /* 材质 */
    private mat: renderer.MaterialInstance = null!;

    /* 导航线是否启动 */
    private inited = false;

    private distance: number = 0;
    private frame: number = 0;
    private start_pos = new Vec3();
    private target_pos = new Vec3();
    private tOffset = new Vec2(1, 1);

    start() {
        this.mat = this.mesh.material!;
        this.mat.setProperty("textureMoveSpeed", v2(0, this.speed));      // 根据需求也可以是 x 轴，动画移动
        this.hide();
    }

    /** 开始提示 */
    show(pos: Vec3) {
        this.node.setRotationFromEuler(0, this.player.eulerAngles.y, 0);

        this.mesh.node.active = true;
        this.frame = 0;
        this.inited = true;
        this.mat.setProperty("mainColor", this.color);

        this.start_pos.set(this.player.worldPosition);
        this.target_pos.set(pos);
        this.setDistance();
    }

    /** 结束提示 */
    hide() {
        this.inited = false;
        this.mesh.node.active = false;
    }

    /** 距离实时计算 */
    private setDistance() {
        // 目标与
        this.distance = Vec3.distance(this.target_pos, this.player.worldPosition);
        this.node.setScale(this.node.scale.x, this.node.scale.y, this.distance);
        this.node.setWorldPosition(this.player.worldPosition);
        this.tOffset.y = this.distance * this.density;
        this.mat.setProperty("tilingOffset", this.tOffset);

        if (this.xEuler) this.rotation(this.start_pos, this.target_pos);
    }

    /** 旋转朝向 */
    private rotation(start: Vec3, end: Vec3) {
        // 角色转动的角度, 相对Z轴，逆时针为正方向
        var angle = Math.asin(Math.sin(Math.abs(end.y - start.y) / this.distance)) * macro.DEG % 360;
        var x = (end.y - start.y) > 0 ? -angle : angle;
        this.node.setRotationFromEuler(x, this.player.eulerAngles.y, 0);
    }

    update(dt: number) {
        if (this.inited) {
            this.frame++;
            if (this.frame >= this.interval) {
                this.setDistance()
                this.frame = 0;
            }
        }
    }
}