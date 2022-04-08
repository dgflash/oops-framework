/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2022-02-10 10:04:37
 */
import { ecs } from "../../../core/libs/ECS";
import { EcsAccountSystem } from "../../account/Account";
import { EcsRoleSystem } from "../../role/Role";
import { EcsPositionSystem } from "./position/EcsPositionSystem";

export class RootSystem extends ecs.RootSystem {
    constructor() {
        super();

        this.add(new EcsPositionSystem());
        this.add(new EcsAccountSystem());
        this.add(new EcsRoleSystem());
    }
}
