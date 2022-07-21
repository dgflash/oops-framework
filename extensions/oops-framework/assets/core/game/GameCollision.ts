/*
 * @Author: dgflash
 * @Date: 2022-03-29 17:08:08
 * @LastEditors: dgflash
 * @LastEditTime: 2022-07-21 17:18:09
 */
import { ccenum, Collider, Component, ICollisionEvent, ITriggerEvent, _decorator } from "cc";

const { ccclass, property } = _decorator;

/** 碰撞物体类型 */
export enum CollisionType {
    /** 角色 */
    Role,
    /** 弹道*/
    Ballistic,
    /** 墙 */
    Wall
}
ccenum(CollisionType);

/** 碰撞器与触发器 */
@ccclass('GameCollision')
export class GameCollision extends Component {
    private Event_TriggerEnter: any = "onTriggerEnter";
    private Event_TriggerStay: any = "onTriggerStay";
    private Event_TriggerExit: any = "onTriggerExit";
    private Event_CollisionEnter: any = "onCollisionEnter";
    private Event_CollisionStay: any = "onCollisionStay";
    private Event_CollisionExit: any = "onCollisionExit";

    protected collider: Collider = null!;

    @property({ type: CollisionType, tooltip: '碰撞物体类型' })
    type: CollisionType = CollisionType.Ballistic;

    onLoad() {
        this.collider = this.getComponent(Collider)!;
        if (this.collider.isTrigger) {
            this.collider.on(this.Event_TriggerEnter, this.onTrigger, this);
            this.collider.on(this.Event_TriggerStay, this.onTrigger, this);
            this.collider.on(this.Event_TriggerExit, this.onTrigger, this);
        }
        else {
            this.collider.on(this.Event_CollisionEnter, this.onCollision, this);
            this.collider.on(this.Event_CollisionStay, this.onCollision, this);
            this.collider.on(this.Event_CollisionExit, this.onCollision, this);
        }
    }

    private onTrigger(event: ITriggerEvent) {
        switch (event.type) {
            case this.Event_TriggerEnter:
                this.onTriggerEnter(event);
                break;
            case this.Event_TriggerStay:
                this.onTriggerStay(event);
                break;
            case this.Event_TriggerExit:
                this.onTriggerExit(event);
                break;
        }
    }

    protected onTriggerEnter(event: ITriggerEvent) { }
    protected onTriggerStay(event: ITriggerEvent) { }
    protected onTriggerExit(event: ITriggerEvent) { }

    private onCollision(event: ICollisionEvent) {
        switch (event.type) {
            case this.Event_CollisionEnter:
                this.onCollisionEnter(event);
                break;
            case this.Event_CollisionStay:
                this.onCollisionStay(event);
                break;
            case this.Event_CollisionExit:
                this.onCollisionExit(event);
                break;
        }
    }

    protected onCollisionEnter(event: ICollisionEvent) { }
    protected onCollisionStay(event: ICollisionEvent) { }
    protected onCollisionExit(event: ICollisionEvent) { }
}
