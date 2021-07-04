import { log } from 'cc';
import { BTreeNode } from './BTreeNode';
import { IControl } from './IControl';

var countUnnamed = 0;

/** 行为树 */
export class BehaviorTree implements IControl {
    private title: string;

    // 根节点
    private _root: BTreeNode;
    // 当前执行节点
    private _current!: BTreeNode;
    // 是否已开始执行
    private _started: boolean = false;
    // 外部参数对象
    private _blackboard: any;

    public get started(): boolean {
        return this._started;
    }

    public constructor(node: BTreeNode, blackboard?: any) {
        countUnnamed += 1;
        this.title = node.constructor.name + '(btree_' + (countUnnamed) + ')';
        this._root = node;
        this._blackboard = blackboard;
    }

    public setObject(obj: any) {
        this._blackboard = obj;
    }

    public run() {
        if (this._started) {
            log('行为树"' + this.title + '"未调用步骤，但在最后一次调用步骤时有一个任务未完成。');
        }

        this._started = true;
        var node = BehaviorTree.getNode(this._root);
        this._current = node;
        node.setControl(this);
        node.start(this._blackboard);
        node.run(this._blackboard);
    }

    public running(node: BTreeNode) {
        this._started = false;
    }

    public success() {
        this._current.end(this._blackboard);
        this._started = false;
    }

    public fail() {
        this._current.end(this._blackboard);
        this._started = false;
    }

    /** ---------------------------------------------------------------------------------------------------- */

    static _registeredNodes: Map<string, BTreeNode> = new Map<string, BTreeNode>();

    static register(name: string, node: BTreeNode) {
        this._registeredNodes.set(name, node);
    }

    static getNode(name: string | BTreeNode): BTreeNode {
        var node = name instanceof BTreeNode ? name : this._registeredNodes.get(name);
        if (!node) {
            throw new Error('The node "' + name + '" could not be looked up. Maybe it was never registered?');
        }
        return node;
    }
}
