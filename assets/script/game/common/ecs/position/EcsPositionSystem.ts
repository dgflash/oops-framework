/*
 * @Author: dgflash
 * @Date: 2021-08-11 16:41:12
 * @LastEditors: dgflash
 * @LastEditTime: 2022-07-25 17:05:02
 */
import { ecs } from "../../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { MoveToSystem } from "./MoveTo";

export class EcsPositionSystem extends ecs.System {
    constructor() {
        super();
        this.add(new MoveToSystem());
    }
}
