import { _decorator, Component, Node } from 'cc';
import { Dog } from '../Dog';
import { oops } from '../../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { EventTouch } from 'cc';
import { Vec2 } from 'cc';
import { Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DogViewController')
export class DogViewController extends Component {

    entity: Dog = null!;


    touchLocation: Vec2 = new Vec2
    w_targetPos: Vec3 = new Vec3

    protected onLoad(): void {
        // this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
    }

    start() {

    }

    onTouchMove(event: EventTouch) {
        this.touchLocation = event.getUILocation(this.touchLocation)
        this.w_targetPos.x = this.touchLocation.x
        this.w_targetPos.y = this.touchLocation.y
        this.entity.followFinger(this.w_targetPos);
    }

    protected onDestroy(): void {
        // this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }
}


