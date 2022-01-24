/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-24 14:56:17
 */
import { ecs } from "../core/libs/ECS";
import { EcsAccountSystem } from "./system/account/EcsAccountSystem";

export class RootSystem extends ecs.RootSystem {
    constructor() {
        super();

        this.add(new EcsAccountSystem());
    }
}
