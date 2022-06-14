import { Component, Node, _decorator } from "cc";
import { ViewParams } from "./Defines";

const { ccclass } = _decorator;

/** 窗口事件触发组件 */
@ccclass('DelegateComponent')
export class DelegateComponent extends Component {
    viewParams: ViewParams | null = null;

    add() {
        let viewParams = this.viewParams!;

        // 触发窗口组件上添加到父节点后的事件
        this.applyComponentsFunction(this.node, "onAdded", viewParams.params);
        if (typeof viewParams.callbacks!.onAdded === "function") {
            viewParams.callbacks!.onAdded(this.node, viewParams.params);
        }
    }

    /** 删除节点，该方法只能调用一次，将会触发onBeforeRemoved回调 */
    remove(isDestroy: boolean) {
        let viewParams = this.viewParams!;

        if (viewParams.valid) {
            // 触发窗口组件上移除之前的事件
            this.applyComponentsFunction(this.node, "onBeforeRemove", viewParams.params);

            //  通知外部对象窗口组件上移除之前的事件（关闭窗口前的关闭动画处理）
            if (typeof viewParams.callbacks!.onBeforeRemove === "function") {
                viewParams.callbacks!.onBeforeRemove(
                    this.node,
                    () => {
                        this.removed(viewParams, isDestroy);
                    });
            }
            else {
                this.removed(viewParams, isDestroy);
            }
        }
    }

    /** 窗口组件中触发移除事件与释放窗口对象 */
    private removed(viewParams: ViewParams, isDestroy: boolean) {
        viewParams.valid = false;

        if (typeof viewParams.callbacks!.onRemoved === "function") {
            viewParams.callbacks!.onRemoved(this.node, viewParams.params);
        }

        if (isDestroy)
            this.node.destroy();
        else
            this.node.removeFromParent();
    }

    onDestroy() {
        let viewParams = this.viewParams!;

        // 触发窗口组件上窗口移除之后的事件
        this.applyComponentsFunction(this.node, "onRemoved", viewParams.params);

        // 通知外部对象窗口移除之后的事件
        if (typeof viewParams.callbacks!.onRemoved === "function") {
            viewParams.callbacks!.onRemoved(this.node, viewParams.params);
        }

        this.viewParams = null;
    }

    protected applyComponentsFunction(node: Node, funName: string, params: any) {
        for (let i = 0; i < node.components.length; i++) {
            let component: any = node.components[i];
            let func = component[funName];
            if (func) {
                func.call(component, params);
            }
        }
    }
}