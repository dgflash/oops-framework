/*
 * @Author: dgflash
 * @Date: 2021-12-29 11:33:59
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-14 19:56:45
 */
import { sp, _decorator } from "cc";
import AnimatorSpine from "../../../../../extensions/oops-plugin-framework/assets/libs/animator/AnimatorSpine";
import { AnimatorStateLogic } from "../../../../../extensions/oops-plugin-framework/assets/libs/animator/core/AnimatorStateLogic";
import { RoleAnimatorType, WeaponName } from "../model/RoleEnum";
import { Role } from "../Role";
import { AnimationEventHandler } from "./animator/AnimationEventHandler";
import { RoleStateAttack } from "./animator/RoleStateAttack";
import { RoleStateDead } from "./animator/RoleStateDead";
import { RoleStateHit } from "./animator/RoleStateHit";

const { ccclass, property, requireComponent, disallowMultiple } = _decorator;

/** 
 * 角色SPINE动画控制
 * 
 * 实现功能
 * 1、控制动作变化
 * 2、控制武器变化
 * 3、控制脸的朝向
 */
@ccclass("RoleViewAnimator")
@disallowMultiple
@requireComponent(sp.Skeleton)
export class RoleViewAnimator extends AnimatorSpine {
    /** 攻击行为完成 */
    onAttackComplete: Function = null!;
    /** 受击动作完成 */
    onHitActionComplete: Function = null!;
    /** 角色对象 */
    role: Role = null!;

    /** 武器动画名 */
    private weaponAnimName: string = null!;

    start() {
        super.start();

        // 动画状态机
        let anim = new AnimationEventHandler();
        let asl: Map<string, AnimatorStateLogic> = new Map();
        asl.set(RoleAnimatorType.Attack, new RoleStateAttack(this.role, anim));
        asl.set(RoleAnimatorType.Hurt, new RoleStateHit(this.role, anim));
        asl.set(RoleAnimatorType.Dead, new RoleStateDead(this.role, anim));
        this.initArgs(asl, anim);
    }

    /** 面象朝左 */
    left() {
        this.node.parent!.setScale(1, 1, 1);
    }

    /** 面象朝右 */
    right() {
        this.node.parent!.setScale(-1, 1, 1);
    }

    /** 当前动作换职业动画 */
    refresh() {
        // 状态机状态值未变时，不会触发状态变化事件，所以这里直接触发状态变化事件来触发后续流程
        this.onStateChange(this._ac.curState, this._ac.curState);
    }

    /**
     * 播放动画
     * @override
     * @param animName 动画名
     * @param loop 是否循环播放
     */
    protected playAnimation(animName: string, loop: boolean) {
        if (animName) {
            this.weaponAnimName = this.getWeaponAnimName();
            var name = `${animName}_${this.weaponAnimName}`;
            this._spine.setAnimation(0, name, loop);
        }
        else {
            this._spine.clearTrack(0);
        }
    }

    /** 武器动画剪辑名 */
    private getWeaponAnimName() {
        var job = this.role.RoleModelJob;
        var weaponAnimName = WeaponName[job.weaponType[0]];
        return weaponAnimName;
    }
}