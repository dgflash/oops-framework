import { BranchNode } from './BranchNode';

/** 优先 */
export class Priority extends BranchNode {
    success() {
        super.success();
        this._control.success();
    }

    fail() {
        super.fail();
        this._actualTask += 1;
        if (this._actualTask < this.children.length) {
            this._run(this._blackboard);
        }
        else {
            this._control.fail();
        }
    }
}
