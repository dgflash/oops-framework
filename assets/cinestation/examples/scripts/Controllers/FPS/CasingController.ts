
import { _decorator, Component, Node, RigidBody, Vec3, randomRange, Quat, game } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CasingController')
export class CasingController extends Component {

    @property
    minXForce: number = 25;

    @property
    maxXForce: number = 40;

    @property
    minYForce: number = 10;

    @property
    maxYForce: number = 20;

    @property
    minZForce: number = -12;

    @property
    maxZForce: number = 12;

    @property
    minRotation: number = -360;

    @property
    maxRotation: number = 360;

    @property
    despawnTime: number = 1;

    private _euler: Vec3 = new Vec3(randomRange(-180, 180), randomRange(-180, 180), 0);

    public start() {
        let rigidBody = this.getComponent(RigidBody);
        if (rigidBody) {
            rigidBody.applyLocalTorque(new Vec3(
                randomRange(this.minRotation, this.maxRotation),
                randomRange(this.minRotation, this.maxRotation),
                randomRange(this.minRotation, this.maxRotation),
            ));
            rigidBody.applyLocalForce(new Vec3(
                randomRange(this.minXForce, this.maxXForce),
                randomRange(this.minYForce, this.maxYForce),
                randomRange(this.minZForce, this.maxZForce)
            ));
        }
        this.scheduleOnce(() => {
            this.node.destroy();
            game.emit("__playCasingSound");
        }, this.despawnTime);
    }

    public update(dt: number) {
        this._euler.x += dt * 2500;
        this._euler.y += dt * 2500;
        this.node.rotation = Quat.fromEuler(this.node.rotation, this._euler.x, this._euler.y, this._euler.z);
    }
}