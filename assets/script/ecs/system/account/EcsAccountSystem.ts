/*
 * @Author: dgflash
 * @Date: 2022-01-24 14:56:01
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-24 14:56:10
 */
import { ecs } from "../../../core/libs/ECS";
import { AccountNetDataSystem } from "./AccountNetDataSystem";

export class EcsAccountSystem extends ecs.System {
    constructor() {
        super();

        this.add(new AccountNetDataSystem());
    }
}
