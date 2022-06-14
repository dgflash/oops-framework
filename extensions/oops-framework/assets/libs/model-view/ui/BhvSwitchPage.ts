import { CCInteger, Component, Node, _decorator } from "cc";
import { EDITOR } from "cc/env";

const { ccclass, property, executeInEditMode, menu } = _decorator;

@ccclass
@executeInEditMode
@menu("添加特殊行为/UI/Switch Page (切换页面)")
export default class BhvSwitchPage extends Component {
    @property
    isLoopPage: boolean = false;

    @property
    private _index: number = 0;
    public get index(): number {
        return this._index;
    }
    @property({
        type: CCInteger
    })
    public set index(v: number) {
        if (this.isChanging) return;
        v = Math.round(v);
        let count = this.node.children.length - 1;

        if (this.isLoopPage) {
            if (v > count) v = 0;
            if (v < 0) v = count;
        }
        else {
            if (v > count) v = count;
            if (v < 0) v = 0;
        }
        this.preIndex = this._index;//标记之前的页面
        this._index = v;

        if (EDITOR) {
            this._updateEditorPage(v);
        }
        else {
            this._updatePage(v);
        }
    }

    private preIndex: number = 0;

    //判断是否在 changing 页面状态

    private _isChanging: boolean = false;
    /**只读，是否在changing 的状态 */
    public get isChanging(): boolean {
        return this._isChanging;
    }

    onLoad() {
        this.preIndex = this.index;
    }

    private _updateEditorPage(page: number) {
        if (!EDITOR) return;
        let children = this.node.children;
        for (let i = 0; i < children.length; i++) {
            const node = children[i];
            if (i == page) {
                node.active = true;
            }
            else {
                node.active = false;
            }
        }
    }

    private _updatePage(page: number) {
        let children = this.node.children;
        let preIndex = this.preIndex;
        let curIndex = this.index;
        if (preIndex === curIndex) return;//没有改变就不进行操作

        let preNode: Node = children[preIndex];//旧节点
        let showNode: Node = children[curIndex];//新节点

        preNode.active = false;
        showNode.active = true;
    }

    public next(): boolean {
        if (this.isChanging) {
            return false;
        }
        else {
            this.index++;
            return true;
        }
    }

    public previous(): boolean {
        if (this.isChanging) {
            return false;
        }
        else {
            this.index--;
            return true;
        }
    }

    public setEventIndex(e: any, index: any): boolean {
        if (this.index >= 0 && this.index != null && this.isChanging === false) {
            this.index = index;
            return true;
        }
        else {
            return false;
        }
    }
}
