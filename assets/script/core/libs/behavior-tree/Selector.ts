import { BranchNode } from './BranchNode';

/** 
 * 逻辑或关系
 * 只要子节点有一个返回true，则停止执行其它子节点，并且Selector返回true。如果所有子节点都返回false，则Selector返回false。
 */
export class Selector extends BranchNode {
    public _run(obj?: any) {
        if (this._nodeRunning) {
            this._nodeRunning.run(this._blackboard);
        }
        else {
            super._run();
        }
    }

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
}
