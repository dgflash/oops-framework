/*
 * @Author: dgflash
 * @Date: 2021-11-11 19:12:25
 * @LastEditors: dgflash
 * @LastEditTime: 2021-11-12 10:47:52
 */
import { toDegree, v3, Vec3, _decorator } from "cc";
import { ecs } from "../../core/libs/ECS";
const { ccclass, property } = _decorator;

/** 视图逻辑组件 */
@ccclass('DemoViewMovementComp')
@ecs.register('DemoViewMovementComp')
export class DemoViewMovementComp extends ecs.Comp {
    pos: Vec3 = v3();
    angle: number = 0;
    speed: number = 0;

    @property
    acceleration: number = 0;

    @property
    private _maxSpeed: number = 0;
    @property
    set maxSpeed(val: number) {
        this._maxSpeed = val;
    }
    get maxSpeed() {
        return this._maxSpeed;
    }

    @property
    heading: Vec3 = v3();

    @property
    targetHeading: Vec3 = v3();

    reset() {

    }

    /** 只处理数据逻辑的直接写在ECS组件里 */
    update(dt: number) {
        if (!Vec3.equals(this.heading, this.targetHeading, 0.01)) {
            let outV3 = v3();
            Vec3.subtract(outV3, this.targetHeading, this.heading);
            outV3.multiplyScalar(0.025);
            this.heading.add(outV3);
            this.heading.normalize();
            this.angle = toDegree(Math.atan2(this.heading.y, this.heading.x)) - 90;
        }

        this.speed = Math.min(this.speed + this.acceleration * dt, this._maxSpeed);

        this.pos.add3f(this.heading.x * this.speed * dt, this.heading.y * this.speed * dt, 0);
    }
}