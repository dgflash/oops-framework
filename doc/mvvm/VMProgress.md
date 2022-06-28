## VM Progress

### 介绍 

VM组件 进度条设置，适合任意的进度条组件，比如 ProgressBar，cc.Slider 等。接受两个watchPath 的值，最后会将变动结果反映在 progress 属性上。使用方式和 VM Custom 组件一致。

### 编辑器属性

- `Controller` -   激活controller,以开启双向绑定，否则只能接收消息
- `Watch Path Arr` - 绑定数值监听路径数组，注意你必须设置一个 长度为 2 的数组，第一个值是最小值，第二个值是最大值，这样才会正确的计算出 progres 属性
- `Component Name`  -  绑定组件的名字 (会根据脚本配置自动识别)
- `Component Property`  -  绑定组件上需要监听的属性  (会根据脚本配置自动识别)
- `refreshRate` - 刷新间隔频率 (只影响脏检查的频率) ，controller开启后生效

