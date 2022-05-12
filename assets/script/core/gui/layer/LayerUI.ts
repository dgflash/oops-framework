/*
 * UI基础层，允许添加多个预制件节点
 * add          : 添加一个预制件节点到层容器中，该方法将返回一个唯一uuid来标识该操作Node节点。
 * delete       : 根据uuid删除Node节点，如果节点还在队列中也会被删除, 删除节点可以用gui.delete(node)或this.node.destroy()
 * deleteByUuid : 根据预制件路径删除，预制件如在队列中也会被删除，如果该预制件存在多个也会一起删除。
 * get          : 根据uuid获取Node节点，如果节点不存在或者预制件还在队列中，则返回null 。
 * getByUuid    : 根据预制件路径获取当前显示的该预制件的所有Node节点数组。
 * has          : 判断当前层是否包含 uuid或预制件路径对应的Node节点。
 * find         : 判断当前层是否包含 uuid或预制件路径对应的Node节点。
 * size         : 当前层上显示的所有Node节点数。
 * clear        : 清除所有Node节点，队列当中未创建的任务也会被清除。
 */
import { error, instantiate, isValid, Node, Prefab, warn, Widget } from "cc";
import { resLoader } from "../../common/loader/ResLoader";
import { UICallbacks, ViewParams } from "./Defines";
import { DelegateComponent } from "./DelegateComponent";
import { UIConfig } from "./LayerManager";

export class LayerUI extends Node {
    protected ui_nodes: Map<string, ViewParams> = new Map<string, ViewParams>();

    /**
     * UI基础层，允许添加多个预制件节点
     * @param name 该层名
     * @param container 容器Node
     */
    constructor(name: string) {
        super(name);

        var widget: Widget = this.addComponent(Widget);
        widget.isAlignLeft = widget.isAlignRight = widget.isAlignTop = widget.isAlignBottom = true;
        widget.left = widget.right = widget.top = widget.bottom = 0;
        widget.alignMode = 2;
        widget.enabled = true;
    }

    /** 构造一个唯一标识UUID */
    protected getUuid(prefabPath: string): string {
        var uuid = `${this.name}_${prefabPath}`;
        return uuid.replace(/\//g, "_");
    }

    /**
     * 添加一个预制件节点到层容器中，该方法将返回一个唯一`uuid`来标识该操作节点
     * @param prefabPath 预制件路径
     * @param params     自定义参数
     * @param callbacks  回调函数对象，可选
     */
    add(config: UIConfig, params?: any, callbacks?: UICallbacks): string {
        let prefabPath = config.prefab;
        var uuid = this.getUuid(prefabPath);
        var viewParams = this.ui_nodes.get(uuid);

        if (viewParams && viewParams.valid) {
            warn(`路径为【${prefabPath}】的预制重复加载`);
            return "";
        }

        if (viewParams == null) {
            viewParams = new ViewParams();
            viewParams.uuid = uuid;
            viewParams.prefabPath = prefabPath;
            viewParams.params = params || {};
            viewParams.callbacks = callbacks || {};
            viewParams.valid = true;
            this.ui_nodes.set(viewParams.uuid, viewParams);
        }

        this.load(viewParams, config.bundle)

        return uuid;
    }

    /**
     * 加载界面资源
     * @param viewParams 显示参数
     * @param bundle     远程资源包名，如果为空就是默认本地资源包
     */
    protected load(viewParams: ViewParams, bundle?: string) {
        var vp: ViewParams = this.ui_nodes.get(viewParams.uuid)!;
        if (vp && vp.node) {
            this.createNode(null, vp);
        }
        else {
            // 获取预制件资源
            bundle = bundle || "resources";
            resLoader.load(bundle, viewParams.prefabPath, (err: Error | null, res: Prefab) => {
                if (err) {
                    error(err);
                }

                let childNode: Node = instantiate(res);
                viewParams.node = childNode;

                let comp: DelegateComponent = childNode.addComponent(DelegateComponent);
                comp.viewParams = viewParams;

                this.createNode(res, viewParams);
            });
        }
    }

    /**
     * 创建节点界面，可覆盖重写
     * @param prefab 
     * @param viewParams 
     */
    protected createNode(prefab: Prefab | null, viewParams: ViewParams) {
        viewParams.valid = true;
        let childNode: Node | null = viewParams!.node!;
        let comp: DelegateComponent | null = childNode.getComponent(DelegateComponent);
        childNode.parent = this;
        comp!.add();

        return childNode;
    }

    /**
     * 根据uuid删除节点，如果节点还在队列中也会被删除
     * 注意。删除节点请直接调用 `this.node.destroy()`或 `gui.delete(node)`;
     * @param uuid 
     */
    removeByUuid(uuid: string, isDestroy: boolean): void {
        var viewParams = this.ui_nodes.get(uuid);
        if (viewParams) {
            if (isDestroy)
                this.ui_nodes.delete(viewParams.uuid);

            var childNode = viewParams.node;
            var comp = childNode?.getComponent(DelegateComponent)!;
            comp.remove(isDestroy);
        }
    }

    /**
     * 根据预制件路径删除，预制件如在队列中也会被删除，如果该预制件存在多个也会一起删除。
     * @param prefabPath 
     */
    remove(prefabPath: string, isDestroy: boolean): void {
        let children = this.__nodes();
        for (let i = 0; i < children.length; i++) {
            let viewParams = children[i].viewParams!;
            if (viewParams.prefabPath === prefabPath) {
                if (isDestroy)
                    this.ui_nodes.delete(viewParams.uuid);

                this.ui_nodes.delete(viewParams.uuid);
                children[i].remove(isDestroy);
                viewParams.valid = false;
            }
        }
    }

    /**
     * 根据uuid获取节点，如果节点不存在或者还在队列中，则返回null 
     * @param uuid 
     */
    getByUuid(uuid: string): Node | null {
        let children = this.__nodes();
        for (let comp of children) {
            if (comp.viewParams && comp.viewParams.uuid === uuid) {
                return comp.node;
            }
        }
        return null;
    }

    /**
     * 根据预制件路径获取当前显示的该预制件的所有Node节点数组。
     * @param prefabPath 
     */
    get(prefabPath: string): Array<Node> {
        let arr: Array<Node> = [];
        let children = this.__nodes();
        for (let comp of children) {
            if (comp.viewParams!.prefabPath === prefabPath) {
                arr.push(comp.node);
            }
        }
        return arr;
    }

    /**
     * 判断当前层是否包含 uuid或预制件路径对应的Node节点。
     * @param prefabPathOrUUID 预制件路径或者UUID
     */
    has(prefabPathOrUUID: string): boolean {
        let children = this.__nodes();
        for (let comp of children) {
            if (comp.viewParams!.uuid === prefabPathOrUUID || comp.viewParams!.prefabPath === prefabPathOrUUID) {
                return true;
            }
        }
        return false;
    }

    /**
     * 获取当前层包含指定正则匹配的Node节点。
     * @param prefabPathReg 匹配预制件路径的正则表达式对象
     */
    find(prefabPathReg: RegExp): Node[] {
        let arr: Node[] = [];
        let children = this.__nodes();
        for (let comp of children) {
            if (prefabPathReg.test(comp.viewParams!.prefabPath)) {
                arr.push(comp.node);
            }
        }
        return arr;
    }

    protected __nodes(): Array<DelegateComponent> {
        let result: Array<DelegateComponent> = [];
        let children = this.children;
        for (let i = 0; i < children.length; i++) {
            let comp = children[i].getComponent(DelegateComponent);
            if (comp && comp.viewParams && comp.viewParams.valid && isValid(comp)) {
                result.push(comp);
            }
        }
        return result;
    }

    /** 层节点数量 */
    size(): number {
        return this.children.length;
    }

    /** 清除所有节点，队列当中的也删除 */
    clear(isDestroy: boolean): void {
        this.ui_nodes.forEach((value: ViewParams, key: string) => {
            this.removeByUuid(value.uuid, isDestroy);
            value.valid = false;
        });
        this.ui_nodes.clear();
    }
}