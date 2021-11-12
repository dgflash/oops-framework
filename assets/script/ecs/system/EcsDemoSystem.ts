import { ecs } from "../../core/libs/ECS";
import { DemoBllLoginSystem } from "./DemoBllLoginSystem";

/*
 * @Author: dgflash
 * @Date: 2021-11-11 18:14:52
 * @LastEditors: dgflash
 * @LastEditTime: 2021-11-12 10:50:28
 */
export class EcsDemoSystem extends ecs.System {
    constructor() {
        super();
        this.add(new DemoBllLoginSystem());
    }
}
