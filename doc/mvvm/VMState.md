## VM State

### 介绍 

VM组件 状态条件，根据watchPath 路径，判断值是不是符合条件，再设置对应节点的状态。 可以根据数据改变节点的颜色，节点的激活与关闭等等情况。

### 编辑器属性

- `Watch Path ` - 绑定数值监听路径
- `Foreach Child Mode` - 特殊的比较值的方式，它会拿当前节点下的所有子节点的名字作为值的比较，来控制所有子节点的显示状态。
- `Foreach Child Type` - `NODE_INDEX` 比较节点的index 值 或者 `NODE_NAME` 比较节点的名字
- `Condition` - 判断条件，判断值的的大小是否符合条件
- `Value Action`-  效果行为，当状态满足时候执行的条件
- `Watch Nodes` - 需要变化状态的节点,如果不设置，默认就会改变本节点以及子节点的所有状态。

### 效果行为

- `NODE_ACTIVE` - 改变节点的激活状态（挂载到本节点无效）

- `NODE_VISIBLE` - 改变节点的显示状态(不透明度切换) ，挂载到本节点有效，只影响显示。

-  `NODE_OPACITY` - 改变节点的不透明度

  `Action Opacity` - 设置 不透明的值

- `NODE_COLOR` - 改变节点的颜色

  `Action Color` - 设置颜色的值

- `COMPONENT_CUSTOM` - 完全自定义改变组件属性

  `Component Name` - 组件名 

  `Component Property` - 组件上的属性

  `Default Value` - 默认值

  `Action Value` - 满足条件改变的值

### 注意事项

NODE_ACTIVE  条件  不会改变自身节点的 激活状态