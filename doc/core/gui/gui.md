### 功能说明
Oops Framework－界面管理模块，主要实现游戏中不同类型的窗口管理，例如常住主界面窗口、弹出窗口、模式窗口，系统提示窗口等。

### 使用说明
##### 窗口配置字段
| 字段   | 介绍     |
| ------ | -------- |
| layer  | 窗口层级 |
| prefab | 预制资源相对路径 |
| bundle | 远程包名 |

##### 窗口配置数据
```
/** 界面唯一标识 */
export enum UIID {
    /** 资源加载界面 */
    Loading = 1,
    /** 弹窗界面 */
    Window,
    /** 加载与延时提示界面 */
    Netinstable
}

/** 打开界面方式的配置数据 */
export var UIConfigData: { [key: number]: UIConfig } = {
    [UIID.Loading]: { layer: LayerType.UI, prefab: "loading/prefab/loading", bundle: "resources" },
    [UIID.Netinstable]: { layer: LayerType.PopUp, prefab: "common/prefab/netinstable" },
    [UIID.Window]: { layer: LayerType.Dialog, prefab: "common/prefab/window" }
}
```

##### 打开一个窗口
```
var uic: UICallbacks = {
    // 窗口添加到界面完成事件
    onAdded: (node: Node, params: any) => {
        var comp = node.getComponent(LoadingViewComp) as ecs.Comp;
    }
    
    // 窗口节点 destroy 之后回调
    onRemoved:(node: Node | null, params: any) => {
        
    }
};
oops.gui.open(UIID.Loading, null, uic);
```

##### 异步函数打开一个窗口
```
var node = await oops.gui.openAsync(UIID.Loading);
```

##### 关闭一个窗口
```
oops.gui.remove(UIID.Loading);
```

##### 指定一个节点来删除窗口
```
oops.gui.removeByNode(cc.Node);
```
注：这里的Node必须是通过oops.gui.open或openAsync打开的才会执行关闭

##### 缓存中是否存在指定标识的窗口
```
oops.gui.has(UIID.Loading);
```

##### 渐隐飘过提示
```
oops.gui.toast("提示内容");
```

##### 清除所有窗口
```
oops.gui.clear();
```
