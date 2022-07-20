/*
 * @Author: dgflash
 * @Date: 2022-06-21 12:05:14
 * @LastEditors: dgflash
 * @LastEditTime: 2022-07-20 14:05:22
 */
import { BranchNode } from './BranchNode';
import { BTreeNode } from './BTreeNode';

/** 
 * 逻辑与关系
 * 只要有一个子节点返回false，则停止执行其它子节点，并且Sequence返回false。如果所有子节点都返回true，则Sequence返回true。
 */
export class Sequence extends BranchNode {
    constructor(nodes: Array<BTreeNode>) {
        super(nodes);
    }

    public success() {
        super.success();

        this._actualTask += 1;
        if (this._actualTask < this.children.length) {
            this._run(this._blackboard);
        }
        else {
            this._control.success();
        }
    }

    public fail() {
        super.fail();
        this._control.fail();
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
