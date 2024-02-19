
/*
 * @Author: dgflash
 * @Date: 2021-11-18 17:47:56
 * @LastEditors: dgflash
 * @LastEditTime: 2022-08-01 13:49:32
 */
import { Node, Vec3 } from "cc";
import { ViewUtil } from "../../../../extensions/oops-plugin-framework/assets/core/utils/ViewUtil";
import { ecs } from "../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { MoveToComp } from "../common/ecs/position/MoveTo";
import { RoleChangeJobComp, RoleChangeJobSystem } from "./bll/RoleChangeJob";
import { RoleUpgradeComp, RoleUpgradeSystem } from "./bll/RoleUpgrade";
import { RoleAnimatorType } from "./model/RoleEnum";
import { RoleModelBaseComp } from "./model/RoleModelBaseComp";
import { RoleModelComp } from "./model/RoleModelComp";
import { RoleModelJobComp } from "./model/RoleModelJobComp";
import { RoleModelLevelComp } from "./model/RoleModelLevelComp";
import { RoleViewComp } from "./view/RoleViewComp";
import { RoleViewInfoComp } from "./view/RoleViewInfoComp";

/** 
 * 角色实体 
 * 需求
 * 1、角色基础属性的数据结构（唯一标识、名字、等级、经验、角色属性等）
 * 2、角色基础属性信息（力量、敏捷、生命等）
 * 3、角色职业信息（职业名、职业属性附加属性）
 * 4、角色需要有一个动画模型
 * 5、与玩家互动的玩法（升级、转职、攻击等）
 */
@ecs.register('Role')
export class Role extends ecs.Entity {
    // 数据层
    RoleModel!: RoleModelComp;
    RoleModelBase!: RoleModelBaseComp;          // 角色初始资质
    RoleModelJob!: RoleModelJobComp;
    RoleModelLevel!: RoleModelLevelComp;

    // 业务层
    RoleChangeJob!: RoleChangeJobComp;          // 转职
    RoleUpgrade!: RoleUpgradeComp;              // 升级
    RoleMoveTo!: MoveToComp;                    // 移动

    // 视图层
    RoleView!: RoleViewComp;                    // 动画
    RoleViewInfo!: RoleViewInfoComp;            // 属性界面

    protected init() {
        // 初始化实体常住 ECS 组件，定义实体特性
        this.addComponents<ecs.Comp>(
            RoleModelComp,
            RoleModelBaseComp,
            RoleModelJobComp,
            RoleModelLevelComp);
    }

    /** 转职（ECS System处理逻辑，分享功能独立的业务代码） */
    changeJob(jobId: number) {
        var rcj = this.add(RoleChangeJobComp);
        rcj.jobId = jobId;
    }

    /** 角色升级（升级只修改数据，通过MVVM级件自动绑定等级变化后的界面角色生命属性刷新） */
    upgrade(lv: number = 0) {
        var ru = this.add(RoleUpgradeComp);
        ru.lv = lv;
    }

    /** 移动（ECS System处理逻辑，分享功能独立的业务代码）  */
    move(target: Vec3) {
        var move = this.get(MoveToComp) || this.add(MoveToComp);
        move.target = target;
        move.node = this.RoleView.node;
        move.speed = 100;
    }

    destroy(): void {
        // 如果该组件对象是由ecs系统外部创建的，则不可回收，需要用户自己手动进行回收。
        this.remove(RoleViewComp);
        super.destroy();
    }

    /** 加载角色显示对象（cc.Component在创建后，添加到ECS框架中，使实体上任何一个ECS组件都可以通过 ECS API 获取到视图层对象 */
    load(parent: Node, pos: Vec3 = Vec3.ZERO) {
        var node = ViewUtil.createPrefabNode("game/battle/role");
        var mv = node.getComponent(RoleViewComp)!;
        this.add(mv);

        node.parent = parent;
        node.setPosition(pos);
    }

    /** 攻击（DEMO没有战斗逻辑，所以只播放一个动画） */
    attack() {
        this.RoleView.animator.setTrigger(RoleAnimatorType.Attack);
    }
}

// export class EcsRoleSystem extends ecs.System {
//     constructor() {
//         super();

//         this.add(new RoleChangeJobSystem());
//         this.add(new RoleUpgradeSystem());
//     }
// }