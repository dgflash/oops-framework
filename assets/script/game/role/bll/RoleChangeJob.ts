/*
 * @Author: dgflash
 * @Date: 2022-01-25 17:49:26
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-26 16:45:09
 */

import { ecs } from "../../../core/libs/ECS";
import { RoleEntity } from "../Role";

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

    entityEnter(entities: RoleEntity[]): void {
        for (let e of entities) {
            // 数值更新
            e.RoleJobModel.id = e.RoleChangeJob.jobId;

            e.remove(RoleChangeJobComp);
        }
    }
}