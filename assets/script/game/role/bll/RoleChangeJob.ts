/*
 * @Author: dgflash
 * @Date: 2022-01-25 17:49:26
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-29 11:46:38
 */

import { ecs } from "../../../core/libs/ECS";
import { Role } from "../Role";

/** 角色转职 */
@ecs.register('RoleChangeJob')
export class RoleChangeJobComp extends ecs.Comp {
    /** 职业编号 */
    jobId: number = -1;

    reset() {
        this.jobId = -1;
    }
}

export class RoleChangeJobSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(RoleChangeJobComp);
    }

    entityEnter(entities: Role[]): void {
        for (let e of entities) {
            // console.log("【转职前】角色属性");
            // e.RoleModel.toString();

            // 数值更新
            e.RoleJobModel.id = e.RoleChangeJob.jobId;

            // console.log("【转职后】角色属性");
            // e.RoleModel.toString();

            // 切换职业动画
            e.RoleView.animator.changeJob();
            e.remove(RoleChangeJobComp);
        }
    }
}