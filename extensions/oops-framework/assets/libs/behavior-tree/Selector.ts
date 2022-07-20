/*
 * @Author: dgflash
 * @Date: 2022-06-21 12:05:14
 * @LastEditors: dgflash
 * @LastEditTime: 2022-07-20 14:05:40
 */
import { BranchNode } from './BranchNode';

/** 
 * 逻辑或关系
 * 只要子节点有一个返回true，则停止执行其它子节点，并且Selector返回true。如果所有子节点都返回false，则Selector返回false。
 */
export class Selector extends BranchNode {
    public success() {
        super.success()
        this._control.success();
    }

    public fail() {
        super.fail()

        this._actualTask += 1;
        if (this._actualTask < this.children.length) {
            this._run(this._blackboard);
        }
        else {
            this._control.fail();
        }
    }

    protected _run(blackboard?: any) {
        if (this._nodeRunning) {
            this._nodeRunning.run(this._blackboard);
        }
        else {
            super._run();
        }
    }
}
