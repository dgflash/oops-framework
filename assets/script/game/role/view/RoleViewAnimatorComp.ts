/*
 * @Author: dgflash
 * @Date: 2021-12-29 11:33:59
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-26 16:53:40
 */
import { sp, _decorator } from "cc";
import AnimatorSpine from "../../../core/libs/animator/AnimatorSpine";
import { AnimatorStateLogic } from "../../../core/libs/animator/core/AnimatorStateLogic";
import { Role } from "../Role";
import { RoleAnimatorType, WeaponName } from "../model/RoleEnum";
import { AnimationEventHandler } from "./animator/AnimationEventHandler";
import { RoleStateAttack } from "./animator/RoleStateAttack";
import { RoleStateDead } from "./animator/RoleStateDead";
import { RoleStateHit } from "./animator/RoleStateHit";

const { ccclass, property, requireComponent, disallowMultiple } = _decorator;

@ccclass("RoleViewAnimatorComp")
@disallowMultiple
@requireComponent(sp.Skeleton)
export class RoleViewAnimatorComp extends AnimatorSpine {
    /** 角色对象 */
    role: Role = null!;
    /** 攻击行为完成 */
    onAttackComplete: Function = null!;
    /** 受击动作完成 */
    onHitActionComplete: Function = null!;

    /** 武器动画名 */
    private weaponAnimName: string = null!; 

    start() {
        super.start();

        // 动画状态机
        let anim = new AnimationEventHandler();
        let asl: Map<string, AnimatorStateLogic> = new Map();
        asl.set(RoleAnimatorType.Magic, new RoleStateAttack(this.role, anim));
        asl.set(RoleAnimatorType.Attack, new RoleStateAttack(this.role, anim));
        asl.set(RoleAnimatorType.AttackSpecial, new RoleStateAttack(this.role, anim));
        asl.set(RoleAnimatorType.AttackCritical, new RoleStateAttack(this.role, anim));

        asl.set(RoleAnimatorType.Block, new RoleStateHit(this.role, anim));
        asl.set(RoleAnimatorType.Parry, new RoleStateHit(this.role, anim));
        asl.set(RoleAnimatorType.Skew, new RoleStateHit(this.role, anim));
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

    /** 设置动作 */
    setAction(type: RoleAnimatorType) {
        this.setTrigger(type);
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
        var job = this.role.entity.RoleJobModel;
        var weaponAnimName1 = WeaponName[job.weaponType[0]];
        var weaponAnimName = weaponAnimName1;

        return weaponAnimName;
    }
}