/*
 * @Author: dgflash
 * @Date: 2022-06-21 12:05:14
 * @LastEditors: dgflash
 * @LastEditTime: 2022-07-20 14:05:02
 */
import { BehaviorTree } from './BehaviorTree';
import { BTreeNode } from './BTreeNode';

/** 
 * 装饰器是条件语句只能附加在其他节点上并且定义所附加的节点是否执行 
 * 如果装饰器是true 它所在的子树会被执行，如果是false 所在的子树不会被执行
 */
export class Decorator extends BTreeNode {
    public node!: BTreeNode;

    constructor(node?: string | BTreeNode) {
        super()

        if (node)
            this.node = BehaviorTree.getNode(node);
    }

    protected setNode(node: string | BTreeNode) {
        this.node = BehaviorTree.getNode(node);
    }

    public start() {
        this.node.setControl(this);
        this.node.start();
        super.start();
    }

    public end() {
        this.node.end();
    }

    public run(blackboard: any) {
        this.node.run(blackboard);
    }
}
