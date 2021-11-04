/*
 * 消息提示层，类似以前Toast
 * 请直接调用 show方法来显示提示
 */

import { error, instantiate, Node, Prefab } from "cc";
import { resLoader } from "../../common/loader/ResLoader";
import { UICallbacks, ViewParams } from "./Defines";
import { DelegateComponent } from "./DelegateComponent";
import { LayerUI } from "./LayerUI";
import { NotifyComponent } from "./NotifyComponent";

const ToastPrefabPath: string = 'common/prefab/notify';

export class LayerNotify extends LayerUI {
    /**
     * 显示toast
     * @param content 文本表示
     * @param useI18n 是否使用多语言
     */
    show(content: string, useI18n: boolean): void {
        this.add(
            ToastPrefabPath, {
            content: content,
            useI18n: useI18n
        })
    }

    add(prefabPath: string, params?: any, callbacks?: UICallbacks): string {
        var viewParams = new ViewParams();
        viewParams.uuid = this.getUuid(prefabPath);
        viewParams.prefabPath = prefabPath;
        viewParams.params = params || {};
        viewParams.callbacks = callbacks || {};
        viewParams.valid = true;
        this.ui_nodes.set(viewParams.uuid, viewParams);

        this.load(viewParams)

        return viewParams.uuid;
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
        let toastCom = childNode.getComponent(NotifyComponent)!;
        childNode.active = true;
        toastCom.toast(viewParams.params.content, viewParams.params.useI18n);
        return childNode;
    }
}