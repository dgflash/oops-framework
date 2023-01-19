/*
 * @Author: dgflash
 * @Date: 2022-07-14 10:57:43
 * @LastEditors: dgflash
 * @LastEditTime: 2023-01-19 15:27:17
 */
import { _decorator } from 'cc';
import { Root } from '../../../extensions/oops-plugin-framework/assets/core/Root';
import { BehaviorTree, BTreeNode, Decorator, Sequence, Task } from '../../../extensions/oops-plugin-framework/assets/libs/behavior-tree';
import { Timer } from '../../../extensions/oops-plugin-framework/assets/core/common/timer/Timer';

const { ccclass, property } = _decorator;

/** 
 * 行为演示
 * 功能说明：一个角色向前移动，如果碰到敌人就停下，如果没有则继续移动
 */
@ccclass('Main')
export class Main extends Root {
    /** 角色位置 */
    role_pos: number = 0;
    /** 敌人位置 */
    enemy_pos: number = 3;

    private bt: BehaviorTree = null!;
    private timer: Timer = new Timer(1);

    start() {
        var btns: Array<BTreeNode> = [];
        btns.push(new RoleMoveTask());
        btns.push(new IsSeeEnemy(new RoleMoveStopTask()));

        // 这里表达，RoleMoveTask节点先处理角色移动一步，IsSeeEnemy节点验证是否碰到敌人，如果碰到，IsSeeEnemy下面挂的任务节点就处理碰到敌人的提示。
        this.bt = new BehaviorTree(new Sequence(btns));
    }

    update(dt: number) {
        if (this.timer.update(dt)) {
            this.bt.setObject(this)
            this.bt.run();
        }
    }
}

/** 演示控制移动，通过行为树黑板的概念把需要处理的Main对象传递到行为树中,每过一秒先移动一步 */
class RoleMoveTask extends Task {
    run(obj?: Main): void {
        if (obj) {
            obj.role_pos++;
            console.log(`角色当前移动了【${obj.role_pos}】步`);
        }
        this.success();
    }
}

/** 装饰器是条件语句只能附加在其他节点上并且定义所附加的节点是否执行，这里验证比如敌人位置与之相等后，表示条件验证成功,继续执行后续任务，失败结束行为树的处理流程 */
class IsSeeEnemy extends Decorator {
    run(blackboard: Main) {
        if (blackboard.role_pos >= blackboard.enemy_pos) {
            super.run(blackboard);
            this.success();         // 调用此方法，代表此节点表达验证逻辑为true的结果，可以执行后续节点
        }
        else {
            this.fail();            // 调用此方法，代表此节点表达验证逻辑为false的结果，不能执行后续节点
        }
    }
}

/** 玩家自己停止动作逻辑，这类逻辑一般只会成本，属于确定的流程 */
class RoleMoveStopTask extends Task {
    run(blackboard: Main): void {
        console.log(`角色当前停止移动`);
        blackboard.enabled = false;             // 不在触发行为树处理逻辑
        this.success();
    }
}