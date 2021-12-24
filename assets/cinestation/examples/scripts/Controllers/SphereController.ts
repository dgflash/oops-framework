
import { _decorator, Component, Node, tween, Vec3, easing } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SphereController')
export class SphereController extends Component {

    public onLoad() {
        let pos = this.node.position;
        let from = new Vec3(pos.x, 7, pos.z);
        let to = new Vec3(pos.x, 1.25, pos.z);
        tween(this.node)
            .to(1, { position: to }, { easing: 'quartIn' })
            .call(() => {
                this.node.emit("setImpulse");
            })
            .to(1, { position: from }, { easing: 'quadOut' })
            .union()
            .repeatForever()
            .start();
    }
}