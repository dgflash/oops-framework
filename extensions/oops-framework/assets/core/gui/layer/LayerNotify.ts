import { error, instantiate, Node, Prefab } from "cc";
import { resLoader } from "../../common/loader/ResLoader";
import { ViewParams } from "./Defines";
import { DelegateComponent } from "./DelegateComponent";
import { LayerUI } from "./LayerUI";
import { Notify } from "../prompt/Notify";

const ToastPrefabPath: string = 'common/prefab/notify';

/*
 * 消息提示层
 * 1、直接调用 show 方法来显示提示
 */
export class LayerNotify extends LayerUI {
    /**
     * 显示toast
     * @param content 文本表示
     * @param useI18n 是否使用多语言
     */
    show(content: string, useI18n: boolean): void {
        var viewParams = new ViewParams();
        viewParams.uuid = this.getUuid(ToastPrefabPath);
        viewParams.prefabPath = ToastPrefabPath;
        viewParams.params = { content: content, useI18n: useI18n };
        viewParams.callbacks = {};
        viewParams.valid = true;

        this.ui_nodes.set(viewParams.uuid, viewParams);
        this.load(viewParams);
    }

    protected load(viewParams: ViewParams) {
        // 获取预制件资源
        resLoader.load(viewParams.prefabPath, (err: Error | null, res: Prefab) => {
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

    protected createNode(prefab: Prefab, viewParams: ViewParams) {
        let childNode: Node = super.createNode(prefab, viewParams);
        let toastCom = childNode.getComponent(Notify)!;
        childNode.active = true;
        toastCom.toast(viewParams.params.content, viewParams.params.useI18n);
        return childNode;
    }
}