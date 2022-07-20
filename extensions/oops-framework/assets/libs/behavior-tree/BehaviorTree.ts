import { BTreeNode } from './BTreeNode';
import { IControl } from './IControl';

var countUnnamed = 0;

/** 行为树 */
export class BehaviorTree implements IControl {
    private title: string;

    /** 根节点 */
    private _root: BTreeNode;
    /** 当前执行节点 */
    private _current!: BTreeNode;
    /** 是否已开始执行 */
    private _started: boolean = false;
    /** 外部参数对象 */
    private _blackboard: any;

    /** 是否已开始执行 */
    public get started(): boolean {
        return this._started;
    }

    /**
     * 构造函数
     * @param node          根节点
     * @param blackboard    外部参数对象
     */
    public constructor(node: BTreeNode, blackboard?: any) {
        countUnnamed += 1;
        this.title = node.constructor.name + '(btree_' + (countUnnamed) + ')';
        this._root = node;
        this._blackboard = blackboard;
    }

    /** 设置行为逻辑中的共享数据 */
    public setObject(blackboard: any) {
        this._blackboard = blackboard;
    }

    /** 执行行为树逻辑 */
    public run() {
        if (this._started) {
            console.error(`行为树【${this.title}】未调用步骤，在最后一次调用步骤时有一个任务未完成`);
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
            throw new Error(`无法找到节点【${name}】，可能它没有注册过`);
        }
        return node;
    }
}
