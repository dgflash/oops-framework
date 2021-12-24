
import { _decorator, Component, Node, Vec3, clamp, Camera, lerp, instantiate, Prefab, RigidBody } from 'cc';
import { Nullable } from '../../../../runtime/Common/Types';
import { customInput } from '../../Datas/CustomInput';
import { StateController } from './StateController';
const { ccclass, property } = _decorator;

@ccclass('WeaponController')
export class WeaponController extends Component {
    private _swaySmoothness: number = 4;
    private _swayMovement: Vec3 = new Vec3();
    private _state: Nullable<StateController> = null;
    private _fireInterval: number = 0;

    @property(Camera)
    gunCamera: Nullable<Camera> = null;

    @property
    fireRate: number = 16;

    @property(Node)
    casingSpawnPoint: Nullable<Node> = null;

    @property(Prefab)
    casingPrefab: Nullable<Prefab> = null;

    public onLoad() {
        this._state = this.getComponent(StateController);
    }

    public update(dt: number) {
        if (this.gunCamera) {
            let fov = customInput.mouseRight ? 20 : 40;
            this.gunCamera.fov = lerp(this.gunCamera.fov, fov, dt * 10);
        }

        this._swayMovement.set(customInput.mouseX, customInput.mouseY).multiplyScalar(0.0005);
        this._swayMovement.x = clamp(this._swayMovement.x, -0.06, 0.06);
        this._swayMovement.y = clamp(this._swayMovement.y, -0.06, 0.06);
        this.node.position = this.node.position.lerp(this._swayMovement, dt * this._swaySmoothness);

        if (this._state && customInput.mouseLeft) {
            this._fireInterval += dt;
            if (this._fireInterval >= 1 / this.fireRate) {
                this._fireInterval = 0;
                this._state.setState(customInput.mouseRight ? StateController.AIM_FIRE : StateController.FIRE, true, 0);

                if (this.casingPrefab && this.casingSpawnPoint) {
                    let bullet = instantiate(this.casingPrefab);
                    bullet.parent = this.node.scene as any;
                    bullet.worldPosition = this.casingSpawnPoint.worldPosition;
                    bullet.worldRotation = this.casingSpawnPoint.worldRotation;
                }
            }
        }
    }
}