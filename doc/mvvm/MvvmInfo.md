### 原创作者上有2.x的DEMO
Github 地址: https://github.com/wsssheep/cocos_creator_mvvm_tools

### 项目结构

核心脚本文件存放在 assets\Script\modelView 路径,要使用必须全部引入

- **JsonOb.ts** -  实现基础的 观察者模式, 改变绑定的数据会自动调用回调函数。你可以随时替换成自己写的观察者。
- **ViewModel.ts** - VM的核心模块，动态管理ViewModel，使用 cc.director.emit 通知 游戏内的节点组件改变状态。
- **VMBase.ts** - VM监听核心组件，用于接收ViewModel 的数值变动消息。VMCustom /VMEvent 之类的衍生组件都是继承自VMBase
- **VMParent.ts** - VM父组件，适合 多实例的 prefab 弹窗使用， 它将数据绑定在继承 VMparent 的组件上，只属于此次创建的实例。 需要以特殊方式继承使用。

****

### 组件简介

- `VMCustom` — 挂载VMCustom，然后会自动识别当前节点的组件(也可以自行设置)。填上你的数值路径，大功告成。
- `VMLabel` —  挂在VMLabel ，不用担心你的数值是整是零，使用模板语法 {{0:int}}自动格式化，解决文本数据显示的问题
- `VMState` — 解决节点状态的切换问题
- `VMProgress` — 解决进度条显示问题
- `VMEvent `—挂载VMEventCall, 触发事件。在值变化时调用其他组件方法(结合其他组件使用事半功倍)
- `VMParent` — 定义局部范围使用 的 ViewModel数据

定义数据模型: `VM.add(data,"tag")`

一直被 cc.find、getChildByName，getComponent， 所以一直想要整理个好的方案。部分参考了Vue(OS:假装参考了)， 以适合 Creator 组件化的方式引入 MVVM。你甚至可以不写一行代码就完成大部分的复杂的UI逻辑，非常适合高强度的细节修改 (os:让策划自己改去)。
这套工具核心在于提供的组件集合，而不是Mvvm本身。使用的是低耦合度的组件脚本来控制数值监听的绑定，侵入性较低。

****

### 用法说明

- **导入框架** -  导入 assets\Script\modelView 中的所有脚本

- **建立数据模型**  -  任意位置新建一个数据脚本，定义自己的数据模型，使用`VM.add(data,'tag')` 添加viewModel。 可以通过VM直接管理该数据，或者自己全局管理 data 数据模型。

-  **挂脚本**  -  编辑器中直接添加组件 VMCustom ，它会自动识别绑定到需要设置值的组件和组件的属性，比如cc.Label、cc.Progress等。 你只要填写对应的watchPath, 就会自动赋值到组件的属性上。比如填写 global.play.hp ，就会在游戏运行时赋值给绑定的组件属性。

- **改数据**  -  在游戏中任意改变 global.play.hp的值，对应的label 就会自动改变数值。

- **全局注册VM**:    (全局自由使用路径) VM.add(data,'tag'); //

- **局部组件使用VM**:   (只在组件内使用的相对路径) 

  1.继承VMParent 组件

  2.在组件内设置 data 数据（data属性） 

  3.相对路径 使用  *.name 的方式设置 watchPath,VMParent 会在 onLoad 的时候自动将 * 替换成 实际的 ViewModel 标签，以便监听数据变化。

****
