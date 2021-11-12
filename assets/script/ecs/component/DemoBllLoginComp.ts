/*
 * @Author: dgflash
 * @Date: 2021-11-12 10:47:04
 * @LastEditors: dgflash
 * @LastEditTime: 2021-11-12 11:18:56
 */
import { ecs } from "../../core/libs/ECS";

/** 登录组件 */
@ecs.register('DemoBllLogin')
export class DemoBllLoginComp extends ecs.Comp {
    playerId: number = -1;

    reset() {
        this.playerId = -1;
    }
}