/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-27 11:13:45
 */
import { ecs } from "../../../core/libs/ECS";
import { EcsAccountSystem } from "../../account/bll/EcsAccountSystem";
import { EcsRoleSystem } from "../../role/bll/EcsRoleSystem";
import { EcsPositionSystem } from "./position/EcsPositionSystem";

export class RootSystem extends ecs.RootSystem {
    constructor() {
        super();

        this.add(new EcsPositionSystem());
        this.add(new EcsAccountSystem());
        this.add(new EcsRoleSystem());
    }
}
