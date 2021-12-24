
import { _decorator, Component, Node, Vec3 } from 'cc';
import { Nullable } from '../../../runtime/Common/Types';
const { ccclass, property } = _decorator;

@ccclass('FollowController')
export class FollowController extends Component {
    private _followOffset: Vec3 = new Vec3();

    @property(Node)
    follow: Nullable<Node> = null;

    public onLoad() {
        if (this.follow) {
            Vec3.subtract(this._followOffset, this.node.worldPosition, this.follow.worldPosition);
        }
    }

    public update(dt: number) {
        if (this.follow) {
            this.node.worldPosition = Vec3.add(this.node.worldPosition, this.follow.worldPosition, this._followOffset);
        }
    }
}
