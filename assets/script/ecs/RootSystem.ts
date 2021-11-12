/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2021-11-12 10:41:50
 */
import { ecs } from "../core/libs/ECS";
import { EcsDemoSystem } from "./system/EcsDemoSystem";

export class RootSystem extends ecs.RootSystem {
    constructor() {
        super();

        this.add(new EcsDemoSystem());
    }
}
