/*
 * @Date: 2021-08-12 09:33:37
 * @LastEditors: dgflash
 * @LastEditTime: 2022-11-11 17:41:53
 */

import { LayerType, UIConfig } from "../../../../../extensions/oops-plugin-framework/assets/core/gui/layer/LayerManager";

/** 界面唯一标识（方便服务器通过编号数据触发界面打开） */
export enum UIID {
    /** 资源加载界面 */
    Loading = 1,
    /** 弹窗界面 */
    Window,
    /** 加载与延时提示界面 */
    Netinstable,
    /** DEMO */
    Demo,
    /** 角色信息 */
    Demo_Role_Info,

    MainUI,
    MainUI_Switch,
    Pop1,
    Pop2,
    Dialog
}

/** 打开界面方式的配置数据 */
export var UIConfigData: { [key: number]: UIConfig } = {
    [UIID.Loading]: { layer: LayerType.UI, prefab: "loading/prefab/loading", bundle: "resources" },
    [UIID.Netinstable]: { layer: LayerType.PopUp, prefab: "common/prefab/netinstable" },
    [UIID.Window]: { layer: LayerType.Dialog, prefab: "common/prefab/window" },
    [UIID.Demo]: { layer: LayerType.UI, prefab: "gui/prefab/demo" },
    [UIID.Demo_Role_Info]: { layer: LayerType.UI, prefab: "gui/prefab/role_info" },
    [UIID.MainUI]: { layer: LayerType.UI, prefab: "demo/MainUI" },
    [UIID.MainUI_Switch]: { layer: LayerType.UI, prefab: "demo/MainUI_Switch" },
    [UIID.Pop1]: { layer: LayerType.PopUp, prefab: "demo/Pop1" },
    [UIID.Pop2]: { layer: LayerType.PopUp, prefab: "demo/Pop2" },
    [UIID.Dialog]: { layer: LayerType.Dialog, prefab: "demo/Dialog" },
}