import { Component, EPSILON, RigidBody, Vec3, _decorator } from 'cc';

const { ccclass, property } = _decorator;
const v3_0 = new Vec3();
const v3_1 = new Vec3();

/** 
 * 物理方式移动
 * 1. 施加线性数度
 * 2. 施加阻尼
 * 3. 施加重力
 * 4. 控制移动速度或速度比率
 */
@ccclass('MoveRigidBody')
export class MoveRigidBody extends Component {
    @property({ tooltip: '阻尼' })
    damping: number = 0.5;

    @property({ tooltip: '重力' })
    gravity: number = -10;

    @property
    private _speed: number = 5;
    @property({ tooltip: '移动速度' })
    public get speed(): number {
        return this._speed;
    }
    public set speed(value: number) {
        this._speed = value;
        this._curMaxSpeed = value * this.ratio;
    }

    @property
    private _ratio: number = 1;
    @property({ tooltip: '速度比率' })
    public get ratio(): number {
        return this._ratio;
    }
    public set ratio(value: number) {
        this._ratio = value;
        this._curMaxSpeed = this.speed * value;
    }

    private _rigidBody: RigidBody = null!;
    private _grounded = true;                               // 是否着地
    private _curMaxSpeed: number = 0;                       // 当前最大速度
    private _prevAngleY: number = 0;                        // 之前的Y角度值
    private _stateX: number = 0;
    private _stateZ: number = 0;

    /** 是否着地 */
    get grounded() { return this._grounded; }

    private _velocity: Vec3 = new Vec3();
    /** 移动方向 */
    public get velocity(): Vec3 {
        return this._velocity;
    }
    public set velocity(value: Vec3) {
        this._velocity = value;

        var x = value.x;
        var z = value.z;
        if ((x > 0 && this._stateX < 0) ||
            (x < 0 && this._stateX > 0) ||
            (z > 0 && this._stateZ < 0) ||
            (z < 0 && this._stateZ > 0)) {
            this._rigidBody.clearVelocity();            // 当前跟之前方向不一致则清除速度,避免惯性太大
        }

        this._stateX = x;
        this._stateZ = z;
    }

    start() {
        this._rigidBody = this.getComponent(RigidBody)!;
        this._prevAngleY = this.node.eulerAngles.y;
    }

    /** 刚体停止移动 */
    stop() {
        this._stateX = 0;
        this._stateZ = 0;
        this._rigidBody.clearVelocity();                // 清除移动速度
    }

    update(dt: number) {
        // 施加重力
        this.applyGravity();

        // 施加阻尼
        this.applyDamping(dt);

        // 未落地无法移动
        if (!this.grounded) return;

        // 施加移动
        this.applyLinearVelocity(v3_0, 1);
    }

    /** 施加重力 */
    private applyGravity() {
        const g = this.gravity;
        const m = this._rigidBody.mass;
        v3_1.set(0, m * g, 0);
        this._rigidBody.applyForce(v3_1);
    }

    /** 施加阻尼 */
    private applyDamping(dt: number) {
        // 获取线性速度
        this._rigidBody.getLinearVelocity(v3_1);

        if (v3_1.lengthSqr() > EPSILON) {
            v3_1.multiplyScalar(Math.pow(1.0 - this.damping, dt));
            this._rigidBody.setLinearVelocity(v3_1);
        }
    }

    /**
     * 施加移动
     * @param {Vec3} dir        方向
     * @param {number} speed    移动数度
     */
    private applyLinearVelocity(dir: Vec3, speed: number) {
        if (this._stateX || this._stateZ) {
            v3_0.set(this._stateX, 0, this._stateZ);
            v3_0.normalize();
            // 获取线性速度
            this._rigidBody.getLinearVelocity(v3_1);

            Vec3.scaleAndAdd(v3_1, v3_1, dir, speed);

            const ms = this._curMaxSpeed;
            const len = v3_1.lengthSqr();
            let ratio = 1;
            if (len > ms) {
                if (Math.abs(this.node.eulerAngles.y - this._prevAngleY) >= 10) {
                    ratio = 2;
                }
                this._prevAngleY = this.node.eulerAngles.y;
                v3_1.normalize();
                v3_1.multiplyScalar(ms / ratio);
            }
            this._rigidBody.setLinearVelocity(v3_1);
        }
    }
}