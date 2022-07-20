/*
 * @Author: dgflash
 * @Date: 2022-06-21 12:05:14
 * @LastEditors: dgflash
 * @LastEditTime: 2022-07-20 14:08:10
 */
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
