/*
 * @Date: 2021-08-12 09:33:37
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-24 15:00:21
 */

import { LayerType, UIConfig } from '../../core/gui/layer/LayerManager';

export enum UIID {
    /** 资源加载界面 */
    Loading,
    /** 弹窗界面 */
    Window,
    /** 加载与延时提示界面 */
    Netinstable = 2,
    /** DEMO */
    Demo = 3,
}

export var UICF: { [key: number]: UIConfig } = {
    [UIID.Loading]: { layer: LayerType.UI, prefab: "loading/prefab/loading" },
    [UIID.Netinstable]: { layer: LayerType.PopUp, prefab: "common/prefab/netinstable" },
    [UIID.Window]: { layer: LayerType.Dialog, prefab: "common/prefab/window" },
    [UIID.Demo]: { layer: LayerType.UI, prefab: "gui/prefab/demo" },
}