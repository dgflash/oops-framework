/*
 * @Author: dgflash
 * @Date: 2022-01-24 14:56:01
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-26 16:45:13
 */
import { ecs } from "../../../core/libs/ECS";
import { RoleChangeJobSystem } from "./RoleChangeJob";
import { RoleUpgradeSystem } from "./RoleUpgrade";

export class EcsRoleSystem extends ecs.System {
    constructor() {
        super();

        this.add(new RoleChangeJobSystem());
        this.add(new RoleUpgradeSystem());
    }
}
