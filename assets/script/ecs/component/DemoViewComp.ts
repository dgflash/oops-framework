/*
 * @Author: dgflash
 * @Date: 2021-11-11 17:52:54
 * @LastEditors: dgflash
 * @LastEditTime: 2021-11-12 11:29:20
 */

import { _decorator } from "cc";
import { ecs } from "../../core/libs/ECS";
import { CCComp } from "./CCComp";
import { DemoViewMovementComp } from "./DemoViewMovementComp";

const { ccclass, property } = _decorator;

/** 
 * 视图层外观组件 
 * 组件自身即是ECS组件，也是ECS实体，实体上可添加实现界面逻辑的ECS组件代码
 */
@ccclass('DemoViewComp')
@ecs.register('DemoViewComp', false)
export class DemoViewComp extends CCComp {
    @property({
        type: DemoViewMovementComp
    })
    movement: DemoViewMovementComp = null!;

    onLoad() {
        super.onLoad();

        this.ent.add(this.movement);
    }

    update(dt: number): void {
        this.movement.update(dt);
        this.node.position = this.movement.pos;
    }

    reset(): void {
        this.movement = null!;
    }
}