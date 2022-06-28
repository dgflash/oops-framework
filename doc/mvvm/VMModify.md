## VM Modify

### 介绍 

VM组件 修改数据，修改指定 路径 watchPath 的 数据。一般配合 cc.Button 组件使用，可以点击按钮后直接修改指定路径的值。

### 编辑器属性

- `Watch Path ` - 绑定数值监听路径
- `Value Clamp` - 是否限制数字的修改范围
- `Value Min` - 限制最小值不低于 
- `Value Min` - 限制最大值不高于 

### 使用方式

类似 Click Events 的设置调用节点上组件的方法， 去调用VMModify 组件上的对应函数，就可以修改 watch Path 监听的 路径的值。

- `vAddInt` - 增加整数
- `vSubInt` - 减少整数
- `vMulInt` - 乘以整数
- `vDivInt` - 除以整数
- `vAdd` - 增加浮点数
- `vSub` - 减少浮点数
- `vMul` - 乘以浮点数
- `vDiv` - 除以浮点数
- `vString` - 设置字符串
- `vNumberInt` - 设置 整数
- `vNumber` - 设置 浮点数

