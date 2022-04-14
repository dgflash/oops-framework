/**
 * 自由飞行摄像机
 * 使用方式：
 * 1、组件绑定到任意一设想机上
 * 2、通过W(上）、S(下)、A(左）、D(右）、Q(Y轴向下）、E(Y轴向上）来操作摄像机移动
 * 3、按住SHIFT键会加速飞行
 * 4、鼠标左或右键按下滑动控制摄像机视角原地旋转
 * 5、鼠标滚轮键滑动摄像机拉近或拉远
 * 6、只支持PC上使用
 */

import { CCFloat, Component, EventKeyboard, EventMouse, EventTouch, game, Input, input, KeyCode, math, _decorator } from 'cc';
const { ccclass, property, menu } = _decorator;

const { Vec2, Vec3, Quat } = math;
const v2_1 = new Vec2();
const v2_2 = new Vec2();
const v3_1 = new Vec3();
const qt_1 = new Quat();

const KEYCODE = {
    W: 'W'.charCodeAt(0),
    S: 'S'.charCodeAt(0),
    A: 'A'.charCodeAt(0),
    D: 'D'.charCodeAt(0),
    Q: 'Q'.charCodeAt(0),
    E: 'E'.charCodeAt(0),
    SHIFT: KeyCode.SHIFT_LEFT
};

@ccclass("FreeFlightCamera")
@menu('oops/camera/FreeFlightCamera')
export class FreeFlightCamera extends Component {
    @property({
        type: CCFloat,
        tooltip: "移动速度"
    })
    public moveSpeed: number = 1;

    @property({
        type: CCFloat,
        tooltip: "按Shift键后的速度"
    })
    public moveSpeedShiftScale: number = 5;

    @property({
        type: CCFloat,
        slide: true,
        range: [0.05, 0.5, 0.01],
        tooltip: "移动后惯性效果"
    })
    public damp: number = 0.2;

    @property({
        type: CCFloat,
        tooltip: "旋转速度"
    })
    public rotateSpeed: number = 1;

    public _euler = new Vec3();
    public _velocity = new Vec3();
    public _position = new Vec3();
    public _speedScale = 1;

    public onLoad() {
        input.on(Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);

        Vec3.copy(this._euler, this.node.eulerAngles);
        Vec3.copy(this._position, this.node.position);
    }

    public onDestroy() {
        input.off(Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    public update(dt: number) {
        // position
        Vec3.transformQuat(v3_1, this._velocity, this.node.rotation);
        Vec3.scaleAndAdd(this._position, this._position, v3_1, this.moveSpeed * this._speedScale);
        Vec3.lerp(v3_1, this.node.position, this._position, dt / this.damp);        // 向量线性插值产生位移惯性效果
        this.node.setPosition(v3_1);

        // rotation
        Quat.fromEuler(qt_1, this._euler.x, this._euler.y, this._euler.z);
        Quat.slerp(qt_1, this.node.rotation, qt_1, dt / this.damp);                 // 四元素线性插值产生旋转惯性效果
        this.node.setRotation(qt_1);
    }

    public onMouseWheel(event: EventMouse) {
        const delta = -event.getScrollY() * this.moveSpeed * 0.1;                       // 向下滚动时增量为正
        Vec3.transformQuat(v3_1, Vec3.UNIT_Z, this.node.rotation);
        Vec3.scaleAndAdd(this._position, this.node.position, v3_1, delta);
    }

    public onKeyDown(event: EventKeyboard) {
        const v = this._velocity;
        if (event.keyCode === KEYCODE.SHIFT) { this._speedScale = this.moveSpeedShiftScale; }
        else if (event.keyCode === KEYCODE.W) { if (v.z === 0) { v.z = -1; } }
        else if (event.keyCode === KEYCODE.S) { if (v.z === 0) { v.z = 1; } }
        else if (event.keyCode === KEYCODE.A) { if (v.x === 0) { v.x = -1; } }
        else if (event.keyCode === KEYCODE.D) { if (v.x === 0) { v.x = 1; } }
        else if (event.keyCode === KEYCODE.Q) { if (v.y === 0) { v.y = -1; } }
        else if (event.keyCode === KEYCODE.E) { if (v.y === 0) { v.y = 1; } }
    }

    public onKeyUp(event: EventKeyboard) {
        const v = this._velocity;
        if (event.keyCode === KEYCODE.SHIFT) { this._speedScale = 1; }
        else if (event.keyCode === KEYCODE.W) { if (v.z < 0) { v.z = 0; } }
        else if (event.keyCode === KEYCODE.S) { if (v.z > 0) { v.z = 0; } }
        else if (event.keyCode === KEYCODE.A) { if (v.x < 0) { v.x = 0; } }
        else if (event.keyCode === KEYCODE.D) { if (v.x > 0) { v.x = 0; } }
        else if (event.keyCode === KEYCODE.Q) { if (v.y < 0) { v.y = 0; } }
        else if (event.keyCode === KEYCODE.E) { if (v.y > 0) { v.y = 0; } }
    }

    private onTouchStart(e: EventTouch) {
        game.canvas!.requestPointerLock();
    }

    private onTouchMove(e: EventTouch) {
        e.getStartLocation(v2_1);
        if (v2_1.x > game.canvas!.width * 0.4) {                     // rotation
            e.getDelta(v2_2);
            this._euler.y -= v2_2.x * this.rotateSpeed * 0.1;       // 上下旋转
            this._euler.x += v2_2.y * this.rotateSpeed * 0.1;       // 左右旋转
        }
        else {                                                      // position
            e.getLocation(v2_2);
            Vec2.subtract(v2_2, v2_2, v2_1);
            this._velocity.x = v2_2.x * 0.01;
            this._velocity.z = -v2_2.y * 0.01;
        }
    }

    private onTouchEnd(e: EventTouch) {
        if (document.exitPointerLock) {
            document.exitPointerLock();
        }

        e.getStartLocation(v2_1);
        if (v2_1.x < game.canvas!.width * 0.4) {                      // position
            this._velocity.x = 0;
            this._velocity.z = 0;
        }
    }
}