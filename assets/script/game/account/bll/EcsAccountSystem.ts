/*
 * @Author: dgflash
 * @Date: 2022-01-24 14:56:01
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-26 16:44:09
 */
import { ecs } from "../../../core/libs/ECS";
import { AccountNetDataSystem } from "./AccountNetData";

export class EcsAccountSystem extends ecs.System {
    constructor() {
        super();

        this.add(new AccountNetDataSystem());
    }
}
