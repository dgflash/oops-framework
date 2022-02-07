/*
 * @Date: 2021-08-12 09:33:37
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-25 14:40:08
 */

import { LayerType, UIConfig } from '../../../core/gui/layer/LayerManager';

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
    Demo_Role_Info
}

/** 打开界面方式的配置数据 */
export var UIConfigData: { [key: number]: UIConfig } = {
    [UIID.Loading]: { layer: LayerType.UI, prefab: "loading/prefab/loading" },
    [UIID.Netinstable]: { layer: LayerType.PopUp, prefab: "common/prefab/netinstable" },
    [UIID.Window]: { layer: LayerType.Dialog, prefab: "common/prefab/window" },
    [UIID.Demo]: { layer: LayerType.UI, prefab: "gui/prefab/demo" },
    [UIID.Demo_Role_Info]: { layer: LayerType.UI, prefab: "gui/prefab/role_info" },
}