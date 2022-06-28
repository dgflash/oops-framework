## VM Component Edit

### 介绍 

VM组件编辑，提供一些基础的功能。可以搜索当前节点下的 组件内容，便于查询出被绑定的节点，方便调试信息。

### 编辑器属性

- `Find List`  - 需要查询的组件名称

- `Action Type` - 操作行为 

     `SEARCH_COMPONENT`  - 查询组件

     `ENABLE_COMPONENT` - 激活关闭组件

     `REPLACE_WATCH_PATH` -  替换组件路径

     `DELETE_COMPONENT` - 删除所有匹配组件

- `Trigger` - 勾选框就会立刻执行对应的命令, 不同模式下Trigger名称不同

- `Can Collect Nodes` - 将节点收集起来 放在 Collect Nodes 中，Action Type 为 SEARCH_COMPONENT 类型时 才能使用

- `Target Path` -  准备搜索的目标路径，Action Type 为 REPLACE_WATCH_PATH  时可用

- `Replace Path` -  准备替换的路径值，Action Type 为 REPLACE_WATCH_PATH  时可用

### 手动编辑器

在层级管理器中 搜索  t:VMBase， 也可以查询到所有VM组件的节点，然后你可以进行手动的管理操作