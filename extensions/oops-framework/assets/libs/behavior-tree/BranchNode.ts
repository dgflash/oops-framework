/*
 * @Author: dgflash
 * @Date: 2022-06-21 12:05:14
 * @LastEditors: dgflash
 * @LastEditTime: 2022-07-20 13:58:32
 */
import { BehaviorTree } from './BehaviorTree';
import { BTreeNode } from './BTreeNode';

/** 复合节点 */
export abstract class BranchNode extends BTreeNode {
    /** 子节点数组 */
    public children: Array<BTreeNode>;
    /** 当前任务索引 */
    protected _actualTask!: number;
    /** 正在运行的节点 */
    protected _runningNode!: BTreeNode;
    protected _nodeRunning!: BTreeNode | null;
    /** 外部参数对象 */
    protected _blackboard: any;

    public constructor(nodes: Array<BTreeNode>) {
        super();
        this.children = nodes || [];
    }

    public start() {
        this._actualTask = 0;
        super.start();
    }

    public run(blackboard?: any) {
        if (this.children.length == 0) {                        // 没有子任务直接视为执行失败
            this._control.fail();
        }
        else {
            this._blackboard = blackboard;
            this.start();
            if (this._actualTask < this.children.length) {
                this._run();
            }
        }

        this.end();
    }

    /** 执行当前节点逻辑 */
    protected _run(blackboard?: any) {
        var node = BehaviorTree.getNode(this.children[this._actualTask]);
        this._runningNode = node;
        node.setControl(this);
        node.start(this._blackboard);
        node.run(this._blackboard);
    }

    public running(node: BTreeNode) {
        this._nodeRunning = node;
        this._control.running(node);
    }

    public success() {
        this._nodeRunning = null;
        this._runningNode.end(this._blackboard);
    }

    public fail() {
        this._nodeRunning = null;
        this._runningNode.end(this._blackboard);
    }
}
