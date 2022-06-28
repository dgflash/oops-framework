## View Model Script

### 介绍 

View Model 的脚本用法

### 方法

VM是 VMManager 的实例, 用于管理所有的 ViewModel 实例。ViewModel实例 主要用于实现数据的双向绑定，内部使用了 cc.director.emit 方法  来发送数据变动的消息,在使用时你可以不用关注于这些细节。

我们可以通过 import  VM（VMManager） 对象 来管理 所有的 ViewModel ，**不建议**直接去使用 ViewModel 实例。

```typescript
//TS 使用 import 引入
import { VM } from './ViewModel';

//JS 可以使用 require 的方式引入,其他用法没有区别
const { VM } = require('./ViewModel'); 
```

- `add` - 创建并且添加一个 ViewModel 对象

  ``` typescript
  VM.add(data,tag);
  //data  - 你想要进行 绑定 的数据对象
  //tag  - 该数据对象的索引标签，用于之后获取该 ViewModel 对象
  ```

- `get` - 获取

  ```typescript
  let vm =  VM.get(tag);//获取的结果是一个 ViewModel 对象
  let data =  vm.$data; //获取 vm 绑定的 data 对象
  vm.active = false; // 关闭 vm 的数据通知功能
  ```

- `remove` - 移除

  ```typescript
  VM.remove(tag);//移除一个指定 tag 的 ViewModel 对象
  ```
- `setValue` - 设置一个值（以tag开头的全局路径）

    ```typescript
    VM.setValue('global.player.name','wss');
    //注意 global 是 ViewModel 的标签，player.name 是 ViewModel 内部的取值路径
    //使用 VM 全局管理，必须按这种全局路径的方式设置值
    ```
- `addValue` - 累加一个值（以tag开头的全局路径）

  ```typescript
  VM.addValue('global.player.hp',10);
  ```

- `getValue` -  获取一个值（以tag开头的全局路径）

  ```typescript
  VM.getValue('global.player.name',default);//default 是 默认值
  ```

- `setObjValue`  - 以路径的形式 设置 一个 对象的值
- `getObjValue` - 以路径的形式 获取 一个 对象的值
- `bindPath` - 绑定需要监听的路径
- `unbindPath` - 取消绑定需要监听的路径
- `active` - 激活 数值变动的事件通知
- `inactive` - 关闭 数值变动的事件通知

### 例子

```typescript
import { VM } from './ViewModel';

//构建数据对象
let data = {
    name:'user',
    gold:12200,
    info:{
        id:0
    }
}
//创建 VM 对象，并且添加到 VMManager 来进行管理, 标记为 'user'  标签
VM.add(data,'user');

 //通过 'user' 标签获取一个 ViewModel 的实例
let vm =  VM.get('user');
vm.$data; // vm.$data === data;

 //设置新的属性值
vm.setValue('name','new Name');

//获取属性
vm.getValue('gold'); 

 //通过相对路径获取属性
vm.getValue('info.id');

//一旦修改值，将会通知 cc.director, 使用emit 发送消息 
data.name = 'my_name'; 

//关闭激活状态后，就不会通知 cc.director 传递信息了
vm.active = false; 

//移除ViewModel，并且释放 data 的引用
VM.remove('user');
data = null；
```

