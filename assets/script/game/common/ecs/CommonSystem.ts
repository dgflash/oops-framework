/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2022-07-22 17:12:05
 */
import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import { EcsAccountSystem } from "../../account/Account";
import { EcsInitializeSystem } from "../../initialize/Initialize";
import { EcsRoleSystem } from "../../role/Role";
import { EcsPositionSystem } from "./position/EcsPositionSystem";

/** 多模块系统组件注册 */
export class CommonSystem extends ecs.System {
    constructor() {
        super();

        this.add(new EcsPositionSystem());
        this.add(new EcsAccountSystem());
        this.add(new EcsRoleSystem());
        this.add(new EcsInitializeSystem());
    }
}
