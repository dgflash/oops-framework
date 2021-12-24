
import { _decorator, Component, Node, systemEvent, SystemEvent, EventKeyboard, SkeletalAnimation, Vec3, KeyCode, Quat, lerp, Vec4 } from 'cc';
import { EPSILON } from '../../../runtime/Common/Math';
import { Nullable } from '../../../runtime/Common/Types';
const { ccclass, property } = _decorator;

enum Direction {
    UP = 1 << 0,
    DOWN = 1 << 1,
    LEFT = 1 << 2,
    RIGHT = 1 << 3
}

let v3_1 = new Vec3();
@ccclass('CharactorController')
export class CharactorController extends Component {
    @property(Node)
    cameraNode: Nullable<Node> = null;

    private _animation: Nullable<SkeletalAnimation> = null;
    private _state: string = "Idle";
    private _rotation: Quat = new Quat();
    private _movingSpeed: number = 0;
    private _rotateSpeed: number = 0;
    private _movingSpeedTo: number = 0;
    private _rotationSpeedTo: number = 0;
    private _direction: number = 0;

    public start() {
        if (this.cameraNode === null) {
            this.cameraNode = this._getRenderScene().cameras[0].node;
        }
    }

    public onEnable() {
        this._animation = this.getComponent(SkeletalAnimation);
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, this._onKeyDown, this);
        systemEvent.on(SystemEvent.EventType.KEY_UP, this._onKeyUp, this);
    }

    public onDisable() {
        systemEvent.off(SystemEvent.EventType.KEY_DOWN, this._onKeyDown, this);
        systemEvent.off(SystemEvent.EventType.KEY_UP, this._onKeyUp, this);
    }

    public update(dt: number) {
        this._rotateSpeed = lerp(this._rotateSpeed, this._rotationSpeedTo, 10 * dt);
        this._movingSpeed = lerp(this._movingSpeed, this._movingSpeedTo, 5 * dt);
        this.node.rotation = this.node.rotation.lerp(this._rotation, this._rotateSpeed * dt);
        this.node.position = this.node.position.add(Vec3.multiplyScalar(v3_1, this.node.forward.negative(), this._movingSpeed * dt));
    }

    private _onKeyDown(e: EventKeyboard) {
        let direction = this._direction;
        switch (e.keyCode) {
            case KeyCode.KEY_W:
                direction |= Direction.UP;
                break;
            case KeyCode.KEY_S:
                direction |= Direction.DOWN;
                break;
            case KeyCode.KEY_A:
                direction |= Direction.LEFT;
                break;
            case KeyCode.KEY_D:
                direction |= Direction.RIGHT;
                break;
        }
        this._updateDirection(direction);
    }

    private _onKeyUp(e: EventKeyboard) {
        let direction = this._direction;
        switch (e.keyCode) {
            case KeyCode.KEY_W:
                direction &= ~Direction.UP;
                break;
            case KeyCode.KEY_S:
                direction &= ~Direction.DOWN;
                break;
            case KeyCode.KEY_A:
                direction &= ~Direction.LEFT;
                break;
            case KeyCode.KEY_D:
                direction &= ~Direction.RIGHT;
                break;
        }
        this._updateDirection(direction);
    }

    private _updateDirection(direction: number) {
        if (this._direction !== direction) {
            this._direction = direction;

            if (!this.cameraNode) return;
            let forward = this.cameraNode.forward;

            v3_1.set(0, 0, 0);
            if (this._direction & Direction.UP) {
                v3_1.add3f(forward.x, 0, forward.z);
            }
            if (this._direction & Direction.DOWN) {
                v3_1.add3f(-forward.x, 0, -forward.z);
            }
            if (this._direction & Direction.LEFT) {
                v3_1.add3f(forward.z, 0, -forward.x);
            }
            if (this._direction & Direction.RIGHT) {
                v3_1.add3f(-forward.z, 0, forward.x);
            }
            if (this._direction > 0 && v3_1.lengthSqr() > EPSILON) {
                Quat.fromViewUp(this._rotation, v3_1.normalize());
                this._movingSpeedTo = 4;
                this._rotationSpeedTo = 5;
                this._setState("Running");
            }
            if (this._direction === 0) {
                this._movingSpeedTo = this._rotationSpeedTo = 0;
                this._movingSpeed = this._rotateSpeed = 0;
                this._setState("Idle");
            }
        }
    }

    private _setState(state: string) {
        if (this._state !== state) {
            this._state = state;
            this._animation && this._animation.crossFade(state);
        }
    }
}
