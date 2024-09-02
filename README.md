# oops-framework

#### 介绍
Oops Framework 基于 Cocos Creator 3.x 开发的一款游戏框架。
1. 提供游戏常用功能库，提高开发效率
2. 提供业务模块代码模板，降低程序设计难度
3. 框架内置模块低耦合，可自行删减不需要的模块，以适应不同类型的游戏
4. 框架提供游戏常用插件工具
    - 热更新配置生成插件([传送门](https://gitee.com/dgflash/oops-plugin-hot-update))
    - 策划Excel配置表生成Json格式与配套ts代码插件([传送门](https://gitee.com/dgflash/oops-plugin-excel-to-json))

注：
1. 项目下载后执行update-oops-plugin-framework.bat下载最新版本框架插件，在启动Cocos Creator运行项目
1. master分支一般会与 Cocos Creator 引擎最新版本保持同步，需要其它版本可选其它分支下载

#### 框架介绍与文档
- [传送门](https://gitee.com/dgflash/oops-framework/wikis/pages?sort_id=12008674&doc_id=2873565)

### QQ群
- 798575969（1群） 
- 621415300（2群）
- 628575875（3群）
- 226524184（4群）

### QQ频道提供教程，持续更新（频道号：q366856bf5）

#### 技术分类
1. 基础类
    - 资源管理
    - 时间管理
    - 音效管理
    - 消息管理
    - 屏幕适应
    - 本地存储
    - 随机数库
    - 日志管理
1. 界面类 
    - 界面管理
    - 界面组件库
        - 标签类组件
        - 按钮类组件
        - 多语言组件
    - MVVM组件库
1. 框架类
    - ECS
    - 行为树
1. 动画类
    - 动画状态机
    - 动画特效组件
    - 动画移动组件
1. 摄像机
    - 自由飞行摄像机
    - 轨道摄像机
1. 网络类
    - Http
    - WebSocket
1. 工具类
    - 数据集合
    - 加密工具
    - 辅助方法库
1. 渲染纹理 
    - 三维摄像机内容显示到模型上
    - 三维模型显示到二维精灵上
1. 热更新

8. 业务框架模板
    ![](https://gitee.com/dgflash/oops-framework/raw/master/doc/img/module.png)

9. 框架以插件方式提供，与项目代码分离，方便不同版本平滑升级
    ![](https://gitee.com/dgflash/oops-framework/raw/master/doc/img/oops-plug-in1.jpg)
    ![](https://gitee.com/dgflash/oops-framework/raw/master/doc/img/oops-plug-in2.jpg)
10. 框架辅助插件
    ![](https://gitee.com/dgflash/oops-framework/raw/master/doc/img/tools.jpg)

#### 插件分类
1. 静态配置表Excel转Json数据与对应的数据结构TS脚本插件[【教程传送门】](https://blog.csdn.net/weixin_39324642/article/details/124484273?spm=1001.2014.3001.5502)
    - 执行工程根目录下update-oops-plugin-excel-to-json.bat文件更新最新版本
2. 热更新组件配套生成热更数据插件 [【教程传送门】](https://blog.csdn.net/weixin_39324642/article/details/124483993?spm=1001.2014.3001.5502)
    - 执行工程根目录下update-oops-plugin-hot-update.bat文件更新最新版本

#### 引用到的第三方源码库
| 库名       | 介绍                                                                | 原创                                                         |
| ---------- | ------------------------------------------------------------------- | ------------------------------------------------------------ |
| WebSocket  | 原创者设计灵活，易扩展自定义协议                                    | [原创](https://github.com/wyb10a10/cocos_creator_framework)  |
| animator   | 可视化动画状态机，与Untiy的Animator使用体验类似，扩展3D骨骼动画支持 | [原创](https://github.com/LeeYip/cocos-animator)             |
| model-view | MVVM组件库，原创为cc2.x版本，本人升级到cc3.x                        | [原创](https://github.com/wsssheep/cocos_creator_mvvm_tools) |
| ECS        | Entity-Component-System，升级优化过                                 | [原创](https://github.com/shangdibaozi/ECS)                  |

#### 在线演示
[网络游戏全栈解决方案](https://store.cocos.com/app/detail/3814)

[角色扮演游戏解决方案 - 2D角色](https://store.cocos.com/app/detail/3675)

[角色扮演游戏解决方案 - 3D角色](https://store.cocos.com/app/detail/4139)

[新手引导解决方案](https://store.cocos.com/app/detail/3653)

[Tiledmap地图类游戏解决方案](https://store.cocos.com/app/detail/4428)

[开源框架 oops-framework gitee](https://gitee.com/dgflash/oops-framework)

[开源框架 oops-framework github](https://github.com/dgflash/oops-framework)

