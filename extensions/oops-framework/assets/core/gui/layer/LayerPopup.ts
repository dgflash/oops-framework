/*
 * @Date: 2021-11-24 16:08:36
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-02 10:52:52
 */

import { BlockInputEvents, Layers } from "cc";
import { PopViewParams } from "./Defines";
import { UIConfig } from "./LayerManager";
import { LayerUI } from "./LayerUI";

/*
 * Popup层，调用add显示，可以显示暗色背景，弹框参数可以查看PopViewParams
 * 允许同时弹出多个窗口
 */
export class LayerPopUp extends LayerUI {
    protected black!: BlockInputEvents;

    constructor(name: string) {
        super(name);
        this.init();
    }

    private init() {
        this.layer = Layers.Enum.UI_2D;
        this.black = this.addComponent(BlockInputEvents);
        this.black.enabled = false;
    }

    /**
     * 添加一个预制件节点到PopUp层容器中，该方法将返回一个唯一uuid来标识该操作节点
     * @param prefabPath 预制件路径
     * @param params     传给组件onAdded、onRemoved方法的参数。
     * @param popParams  弹出界面的设置定义，详情见PopViewParams
     */
    add(config: UIConfig, params: any, popParams?: PopViewParams): string {
        this.black.enabled = true;
        return super.add(config, params, popParams);
    }

    remove(prefabPath: string, isDestroy: boolean): void {
        super.remove(prefabPath, isDestroy);
        this.setBlackDisable();
    }

    protected removeByUuid(prefabPath: string, isDestroy: boolean): void {
        super.removeByUuid(prefabPath, isDestroy);
        this.setBlackDisable();
    }

    protected setBlackDisable() {
        this.black.enabled = false;
    }

    clear(isDestroy: boolean) {
        super.clear(isDestroy)
        this.black.enabled = false;
        this.active = false;
    }
}