/*
 * @Author: dgflash
 * @Date: 2022-01-25 17:49:26
 * @LastEditors: dgflash
 * @LastEditTime: 2022-07-21 16:49:00
 */

import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { RoleModelJobComp } from "../model/RoleModelJobComp";
import { Role } from "../Role";
import { RoleEvent } from "../RoleEvent";

/**
 * 角色转职
 * 
 * 实现功能
 * 1、修改角色职业子模块的职业数据
 * 2、自动通过战斗属性框架更新角色战斗属性多模块的叠加值
 * 3、切换角色动画的职业武器
 * 
 * 技术分析
 * 1、使用ecs.Comp做为业务输入参数的接口，可理解为一个对象成员方法接收了方法参数，通过ecs框架的特点，ecs.System 系统会监控自己关注的数据组件变化后，做对应的业务处理
 * 2、在角色实体上添加职业切换组件时触发业务逻辑的处理，完成后从角色实体上移除业务组件完成业务的生命周期。
 */
@ecs.register('RoleChangeJob')
export class RoleChangeJobComp extends ecs.Comp {
    /** 职业编号 */
    jobId: number = -1;

    reset() {
        this.jobId = -1;
    }
}

@ecs.register('Role')
export class RoleChangeJobSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(RoleChangeJobComp, RoleModelJobComp);
    }

    entityEnter(e: Role): void {
        // 数值更新
        e.RoleModelJob.id = e.RoleChangeJob.jobId;

        // 转职事件，通知视图层逻辑刷新界面效果，实现两层逻辑分离
        oops.message.dispatchEvent(RoleEvent.ChangeJob);

        e.remove(RoleChangeJobComp);
    }
}