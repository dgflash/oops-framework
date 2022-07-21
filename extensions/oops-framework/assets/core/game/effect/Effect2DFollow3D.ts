/*
 * @Author: dgflash
 * @Date: 2022-03-31 18:03:50
 * @LastEditors: dgflash
 * @LastEditTime: 2022-07-21 18:00:14
 */

import { Camera, Component, Node, Vec3, _decorator } from "cc";
import { oops } from "../../Oops";

const { ccclass, property } = _decorator;

/** 2D节点跟随3D节点 */
@ccclass("Effect2DFollow3D")
export class Effect2DFollow3D extends Component {
    @property({ type: Node })
    public node3d: Node = null!;

    @property({ type: Node })
    public nodeUi: Node = null!;

    @property
    distance: number = 10;

    /** 三维摄像机 */
    camera: Camera = null!;

    private pos = new Vec3();

    setTarget(value: Node) {
        this.node3d = value;
        this.lateUpdate(0);
    }

    lateUpdate(dt: number) {
        const wpos = this.node3d.worldPosition;

        this.camera.convertToUINode(wpos, oops.gui.game, this.pos);
        this.nodeUi.setPosition(this.pos);

        // @ts-ignore
        Vec3.transformMat4(this.pos, wpos, this.camera._camera!.matView);
        const ratio = this.distance / Math.abs(this.pos.z);
        const value = Math.floor(ratio * 100) / 100;
        this.node.setScale(value, value, 1);
    }
}

