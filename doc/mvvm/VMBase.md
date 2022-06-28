## VM Base

### 介绍 

VM基础组件，只实现了数据绑定, 需要被继承使用。你可以通过继承VM Base来实现自己的VM组件。当然一般情况下使用这个工具所提供的其他组件脚本就够用了。

### 脚本属性

- `watchPath` - 需要监听的路径,，你在VM怎么定义的结构，就在这里写上取值的路径。

   比如global 标签的 viewModel 要取值player.atk, 就是gloabl.player.atk。

- `watchPathArr` - 需要监听的多路径 数组, 和上面一样，不过需要监听的是一个路径的数组。

- `templateMode` - 模板模式（多路径模式），启用后才能监听 watchPathArr 数组中的所有路径

- `templateValueArr` -  缓存监听路径的值，当监听某个路径的值发生变动时，会自动更新该数组中缓存的值。一般不需要考虑使用。

- `VM` - VMManager 对象的引用，参考ViewModel 的说明

- `onLoad()` -   提前拆分、并且解析 监听的路径,可以捕获一些错误

   **如果需要重写onLoad 方法**，请根据顺序调用 **super.onLoad()**，执行默认方法。直接覆盖将会导致函数的功能丢失。

- `onEnable()` - 激活节点时，更新对象初始值，同时开启对 watchPath 的监听。

  **可重写**，重写时需要调用 super.onEnable() 处理父方法

- `onDisable()`- 关闭节点时，关闭对 watchPath 的监听。

  **可重写**，重写时需要调用 super.onDisable() 处理父方法

- `onValueInit()`- 初始化值时调用函数

  虚方法，可以直接被重写。

- `onValueChanged(newValue,oldValue,pathArray)` -  当值改变时调用函数

  虚方法，可以直接被重写。