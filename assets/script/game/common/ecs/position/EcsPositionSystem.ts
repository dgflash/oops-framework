/*
 * @Author: dgflash
 * @Date: 2021-08-11 16:41:12
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-14 19:52:35
 */
import { ecs } from "../../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import { MoveToSystem } from "./MoveTo";

export class EcsPositionSystem extends ecs.System {
    constructor() {
        super();
        this.add(new MoveToSystem());
    }
}
