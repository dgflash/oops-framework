/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-12 16:06:43
 */

import { Node } from "cc";
import { UICallbacks, ViewParams } from "./Defines";
import { UIConfig } from "./LayerManager";
import { LayerPopUp } from "./LayerPopup";

/*
 * Dialog 层
 * 该层的节点将一次只显示一个，删除以后会自动从队列当中取一个弹窗，直到队列为空
 */
export class LayerDialog extends LayerPopUp {
    private queue: Array<ViewParams> = [];
    private current!: ViewParams;

    add(config: UIConfig, params?: any, callbacks?: UICallbacks): string {
        this.black.enabled = true;

        let prefabPath = config.prefab
        var uuid = this.getUuid(prefabPath);
        var viewParams = this.ui_nodes.get(uuid);
        if (viewParams == null) {
            viewParams = new ViewParams();
            viewParams.uuid = this.getUuid(prefabPath);
            viewParams.prefabPath = prefabPath;
            viewParams.params = params || {};
            viewParams.callbacks = callbacks || {};

            var onRemove_Source = viewParams.callbacks.onRemoved;
            viewParams.callbacks.onRemoved = (node: Node | null, params: any) => {
                if (onRemove_Source) {
                    onRemove_Source(node, params);
                }
                setTimeout(() => {
                    this.next();
                }, 0);
            }
            viewParams.valid = true;
            this.ui_nodes.set(viewParams.uuid, viewParams);
        }

        if (this.current && this.current.valid) {
            this.queue.push(viewParams);
        }
        else {
            this.current = viewParams;
            this.load(viewParams);
        }

        return uuid;
    }

    protected setBlackDisable() {
        if (this.queue.length == 0) this.black.enabled = false;
    }

    private next() {
        if (this.queue.length > 0) {
            this.current = this.queue.shift()!;
            if (this.current.node) {
                this.createNode(null, this.current);
            }
            else {
                this.load(this.current);
            }
        }
    }
}