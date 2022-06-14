import { LayerManager } from "./LayerManager";

/** 界面关系树节点 */
class TreeNode {
    public id!: number;
    /** 父节点编号 */
    public pid!: number;
    /** 父节点 */
    public parent: TreeNode | null = null;
    /** 子节点 */
    public child: Array<TreeNode> = [];
    /** 界面名 */
    public name!: string;
    /** 界面代号（用于同一界面有多条路径时） */
    public panel!: string;
}

/** 用于树形结构两节点之间的寻路功能 */
export class UIMap {
    private manager!: LayerManager;

    private nodes: Map<number, TreeNode> = new Map<number, TreeNode>();

    /** 创建UI关系树 */
    init(manager: LayerManager, data: any) {
        this.manager = manager;

        // 解析数据
        for (var key in data) {
            var d = data[key];
            var n = new TreeNode();
            n.id = parseInt(key);
            n.pid = d.parent;
            n.name = d.name;
            n.panel = d.panel;
            this.nodes.set(n.id, n);
        }

        // 设置节点关系
        this.nodes.forEach((value: TreeNode, key: number) => {
            value.parent = this.nodes.get(value.pid)!;
            if (value.parent)
                value.parent.child.push(value);
        });
    }

    /** 树节点寻路 */
    pathFinding(startId: number, endId: number) {
        var start: TreeNode = this.nodes.get(startId)!;
        var end: TreeNode = this.nodes.get(endId)!;

        var close: Array<TreeNode> = this.findUp(start);
        var open: Array<TreeNode> = this.findUp(end);

        close.forEach(value => {
            this.manager.remove(value.id, true);
        });

        open.forEach(value => {
            this.manager.open(value.id);
        });

        return { paths_close: close, paths_open: open };
    }

    /** 向上寻找子节点直到根节点停止，并返回节点路径数组 */
    private findUp(start: TreeNode): TreeNode[] {
        var paths = [];
        var current: TreeNode = start;
        while (current.parent != null) {        // 父级为空时为根节点
            paths.push(current);
            current = current.parent!;
        }
        return paths;
    }

    release() {
        this.nodes.clear();
    }
}
