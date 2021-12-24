
import {
    _decorator, Component,
    Camera, lerp, Vec3, Vec2, Quat, KeyCode
} from 'cc';

import { Quat_quarticDamp, SmoothDamper } from '../../../../runtime/Common/Math';
import { Nullable } from '../../../../runtime/Common/Types';
import { customInput } from '../../Datas/CustomInput';
import { StateController } from './StateController';
const { ccclass, property } = _decorator;

let __euler = new Vec3();
let __speedTo = new Vec3();
let __offset = new Vec3();
let __rotation = new Quat();

@ccclass('FPSController')
export class FPSController extends Component {
    private _euler: Vec3 = new Vec3();
    private _speedSmoothDamper: SmoothDamper = new SmoothDamper();
    private _eulerSmoothDamper: SmoothDamper = new SmoothDamper();
    private _moveSpeed: Vec3 = new Vec3();
    private _state: Nullable<StateController> = null;

    public onLoad() {
        customInput.initialize(true);
        this._state = this.getComponentInChildren(StateController);
        Quat.toEuler(this._euler, this.node.worldRotation);
    }

    public update(dt: number) {
        let state = this._state;
        if (state) {
            this._updateRotation(state, dt);
            this._updatePosition(state, dt);
            this._updateState(state, dt);
        }
    }

    private _updateRotation(state: StateController, deltaTime: number) {
        __euler.set(this._euler).subtract3f(customInput.mouseX, customInput.mouseY, 0);
        this._eulerSmoothDamper.Vec3_smoothDamp(this._euler, this._euler, __euler, customInput.mouseRight ? 1 : 0.2, deltaTime);
        Quat.fromEuler(__rotation, this._euler.y, this._euler.x, 0);
        this.node.worldRotation = __rotation;
    }

    private _updatePosition(state: StateController, deltaTime: number) {
        __speedTo.set(customInput.horizontal, 0, customInput.vertical);
        Vec3.transformQuat(__speedTo, __speedTo, this.node.worldRotation);
        __speedTo.y = 0;
        __speedTo.normalize();
        __speedTo.multiplyScalar(customInput.mouseRight ? 1.5 : 3);

        this._speedSmoothDamper.Vec3_smoothDamp(this._moveSpeed, this._moveSpeed, __speedTo, 0.1, deltaTime);
        Vec3.multiplyScalar(__offset, this._moveSpeed, deltaTime);
        this.node.worldPosition = this.node.worldPosition.add(__offset);
    }

    private _updateState(state: StateController, deltaTime: number) {
        if (customInput.getButton(KeyCode.KEY_R)) {
            state.setState(StateController.RELOAD_OUTOF_AMMO);
        }
        else {
            state.setValue("moveSpeed", this._moveSpeed.length());
            state.setValue("mouseRight", customInput.mouseRight);
            state.setValue("mouseLeft", customInput.mouseLeft);
        }
    }
}