/*
 * @Author: dgflash
 * @Date: 2021-08-11 16:41:12
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-27 11:10:44
 */
import { ecs } from "../../../../core/libs/ECS";
import { MoveToSystem } from "./MoveTo";

export class EcsPositionSystem extends ecs.System {
    constructor() {
        super();
        this.add(new MoveToSystem());
    }
}
