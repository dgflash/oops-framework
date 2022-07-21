import { Component, EventMouse, EventTouch, input, Input, lerp, Node, Quat, Vec2, Vec3, _decorator } from 'cc';
import { EDITOR } from 'cc/env';
const { ccclass, property } = _decorator;

let tempVec3 = new Vec3;
let tempVec3_2 = new Vec3;
let tempQuat = new Quat;
const DeltaFactor = 1 / 200;

/** 
 * 轨道摄影机
 * 1、触摸自由旋转
 * 2、镜头远近鼠标滚轮调节
 * 3、固定为第三人称摄像机
 */
@ccclass('OrbitCamera')
export class OrbitCamera extends Component {
    @property({
        tooltip: "是否启动触摸控制"
    })
    enableTouch = true;

    @property({
        tooltip: "是否开启启用缩放半径（鼠标滚轮控制摄像机与目标距离）"
    })
    enableScaleRadius = false;
    @property({
        tooltip: "摄像机与目标的半径缩放速度",
        visible: function () {
            //@ts-ignore
            return this.enableScaleRadius === true;
        }
    })
    radiusScaleSpeed = 1;
    @property({
        tooltip: "摄像机与目标的半径最小值",
        visible: function () {
            //@ts-ignore
            return this.enableScaleRadius === true;
        }
    })
    minRadius = 5;
    @property({
        tooltip: "摄像机与目标的半径最大值",
        visible: function () {
            //@ts-ignore
            return this.enableScaleRadius === true;
        }
    })
    maxRadius = 10;

    @property({
        tooltip: "自动旋转是否开启"
    })
    autoRotate = false;
    @property({
        tooltip: "自动旋转速度",
        visible: function () {
            //@ts-ignore
            return this.autoRotate === true;
        }
    })
    autoRotateSpeed = 90;

    @property({
        tooltip: "旋转速度"
    })

    rotateSpeed = 1;
    @property({
        tooltip: "跟随速度"
    })

    followSpeed = 1;
    @property({
        tooltip: "X轴旋转范围（人物上下看的角度控制）"
    })
    xRotationRange = new Vec2(5, 70);

    @property
    private _targetRadius = 10;
    @property({
        tooltip: "摄像机与目标的距离（以玩家为中心环绕球半径）"
    })
    get radius(): number {
        return this._targetRadius;
    }
    set radius(v: number) {
        this._targetRadius = v;
    }

    @property
    _target: Node = null!;
    @property({
        type: Node,
        tooltip: "跟随目标"
    })
    get target(): Node {
        return this._target;
    }
    set target(v: Node) {
        this._target = v;
        this._targetRotation.set(this._startRotation);
        this._targetCenter.set(v.worldPosition);
    }

    @property
    private _startRotation = new Vec3;
    @property({
        type: Vec3,
        tooltip: "目标旋转偏移量（初始旋转向量）"
    })
    get targetRotation(): Vec3 {
        if (!EDITOR) {
            this._startRotation.set(this._targetRotation);
        }
        return this._startRotation;
    }
    set targetRotation(v: Vec3) {
        this._targetRotation.set(v);
        this._startRotation.set(v);
    }

    @property({
        tooltip: "是否跟随目标 Y 轴旋转"
    })
    followTargetRotationY = false;

    private _center = new Vec3;              // 摄像机视口方向量
    private _targetCenter = new Vec3;        // 摄像机中心点位置（目标位置）
    private _touched = false;                // 是否触摸屏幕
    private _targetRotation = new Vec3;      // 目标旋转向量
    private _rotation = new Quat;            // 摄像机旋转四元素
    private _radius = 10;                    // 当前玩家与目标半径距离

    start() {
        if (this.enableTouch) {
            input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
            input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
            input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        }

        if (this.enableScaleRadius) {
            input.on(Input.EventType.MOUSE_WHEEL, this.onMouseWhee, this);
        }

        this.resetTargetRotation();

        // 根据欧拉角信息计算摄像机四元数，旋转顺序为 YZX
        Quat.fromEuler(this._rotation, this._targetRotation.x, this._targetRotation.y, this._targetRotation.z);

        if (this.target) {
            this._targetCenter.set(this.target.worldPosition);
            this._center.set(this._targetCenter);
        }

        this._radius = this.radius;

        this.limitRotation()
    }

    /** 重置摄像机到初始位置 */
    resetTargetRotation() {
        let targetRotation: Vec3 = this._targetRotation.set(this._startRotation);
        if (this.followTargetRotationY) {
            targetRotation = tempVec3_2.set(targetRotation);
            Quat.toEuler(tempVec3, this.target!.worldRotation);
            targetRotation.add(tempVec3);
        }
    }

    /** 限制 X 轴旋转（上下看） */
    private limitRotation() {
        let rotation = this._targetRotation;

        if (rotation.x < this.xRotationRange.x) {
            rotation.x = this.xRotationRange.x
        }
        else if (rotation.x > this.xRotationRange.y) {
            rotation.x = this.xRotationRange.y
        }

        rotation.z = 0;
    }

    //#region Touch
    private onTouchStart() {
        this._touched = true;
    }

    private onTouchMove(event: EventTouch) {
        if (!this._touched) return;

        let delta = event.touch!.getDelta()

        Quat.fromEuler(tempQuat, this._targetRotation.x, this._targetRotation.y, this._targetRotation.z);
        Quat.rotateX(tempQuat, tempQuat, -delta.y * DeltaFactor);
        Quat.rotateY(tempQuat, tempQuat, -delta.x * DeltaFactor);
        Quat.toEuler(this._targetRotation, tempQuat);

        this.limitRotation();
    }

    private onTouchEnd() {
        this._touched = false;
    }

    private onMouseWhee(event: EventMouse) {
        let scrollY = event.getScrollY();
        this._targetRadius += this.radiusScaleSpeed * -Math.sign(scrollY);          // 滚轮向前为负，滚轮向后为正
        this._targetRadius = Math.min(this.maxRadius, Math.max(this.minRadius, this._targetRadius));
    }
    //#endregion

    update(dt: number) {
        let targetRotation = this._targetRotation;
        // 是否摄像机围绕 Y 轴自动旋转
        if (this.autoRotate && !this._touched) {
            targetRotation.y += this.autoRotateSpeed * dt;
        }

        if (this.target) {
            // 重置摄像机中心点
            this._targetCenter.set(this.target.worldPosition);

            // 是否跟随 Y 轴目标旋转
            if (this.followTargetRotationY) {
                targetRotation = tempVec3_2.set(targetRotation);
                Quat.toEuler(tempVec3, this.target.worldRotation);
                targetRotation.y += tempVec3.y;                                                     // 运行时，只变化 Y 旋转
            }
        }

        Quat.fromEuler(tempQuat, targetRotation.x, targetRotation.y, targetRotation.z);             // 获取目标对象的旋转四元素（人物面向与摄像机一至）

        Quat.slerp(this._rotation, this._rotation, tempQuat, dt * 7 * this.rotateSpeed);            // 旋转线性插值（平滑摄像机视口旋转）
        Vec3.lerp(this._center, this._center, this._targetCenter, dt * 5 * this.followSpeed);       // 摄像机跟随位移线性插值（平滑摄像机节点位置移动）

        this._radius = lerp(this._radius, this._targetRadius, dt * 5);                              // 摄像机与目标距离半径线性插值（镜头平滑前后移动)

        Vec3.transformQuat(tempVec3, Vec3.FORWARD, this._rotation);                                 // 计算摄像机旋转后的方向量
        Vec3.multiplyScalar(tempVec3, tempVec3, this._radius);                                      // 计算摄像机与目标半径向量
        tempVec3.add(this._center);                                                                 // 计算摄像机与目标偏移后的位置

        this.node.position = tempVec3;                                                              // 设置摄像机位置
        this.node.lookAt(this._center);                                                             // 设置摄像机视口方向
    }

    /** 摄像机立即跟随到制定目标的位置 */
    follow() {
        let targetRotation = this._targetRotation;

        if (this.target) {
            // 重置摄像机中心点
            this._targetCenter.set(this.target.worldPosition);

            // 是否跟随 Y 轴目标旋转
            if (this.followTargetRotationY) {
                targetRotation = tempVec3_2.set(targetRotation);
                Quat.toEuler(tempVec3, this.target.worldRotation);
                targetRotation.y += tempVec3.y;                                                     // 运行时，只变化 Y 旋转
            }
        }

        Quat.fromEuler(tempQuat, targetRotation.x, targetRotation.y, targetRotation.z);             // 获取目标对象的旋转四元素（人物面向与摄像机一至）

        this._rotation = tempQuat;
        this._center = this._targetCenter;
        this._radius = this._targetRadius;

        Vec3.transformQuat(tempVec3, Vec3.FORWARD, this._rotation);                                 // 计算摄像机旋转后的方向量
        Vec3.multiplyScalar(tempVec3, tempVec3, this._radius);                                      // 计算摄像机与目标半径向量
        tempVec3.add(this._center);                                                                 // 计算摄像机与目标偏移后的位置

        this.node.position = tempVec3;                                                              // 设置摄像机位置
        this.node.lookAt(this._center);                                                             // 设置摄像机视口方向
    }
}