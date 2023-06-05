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

### QQ群
- 798575969（1群） 
- 621415300（2群）
- 628575875（3群）

### QQ频道扫码加入，提供教程，持续更新
![](http://dgflash.gitee.io/oops-full-stack-web/doc/img/qq.png)

#### 技术文档
- [oops-framework](https://dgflash.gitee.io/oops-plugin-framework/)
- [ecs](https://gitee.com/dgflash/oops-framework/tree/master/doc/ecs/ecs.md)
- [mvvm](https://gitee.com/dgflash/oops-framework/tree/master/doc/mvvm)
- [animator](https://github.com/LeeYip/cocos-animator/blob/master/README.md)

#### 技术分类
1. 基础类
    - 界面管理 - LayerManager.ts
    - 资源管理 - ResLoader.ts
    - 时间管理 - TimerManager.ts
    - 音效管理 - AudioManager.ts
    - 消息管理 - MessageManager.ts
    - 屏幕适应 - GUI.ts
    - 本地存储 - StorageManager.ts
2. 界面类 
    - 常用UI组件
        - 按钮类 - gui/button
        - 标签类 - gui/label
        - 语言类 - gui/language
    - MVVM组件库 - libs/model-view
    - 特效管理 - libs/animator-effect
    - 位移组件 - libs/animator-move
    - 摄像机控制 - libs/camera
3. 网络类
    - Http - libs/network/HttpRequest.ts
    - WebSocket - libs/network/NetManager.ts
4. 框架类
    - ECS - libs/ecs
    - BehaviorTree 行为树 - libs/behavior-tree
    - 可视化动画状态机 - libs/animator
5. 工具类
    - 日志管理 - Logger.ts
    - 随机数生成器 - RandomManager.ts
    - 数据集合 - libs/collection
    - 加密工具 - libs/security
    - GZip压缩 - libs/network/protocol
    - 辅助方法库 - core/utils
6. 渲染纹理 
    - 三维摄像机内容显示到模型上 - libs/render-texture/RtToModel
    - 三维模型显示到二维精灵上 - libs/render-texture/RtToSprite
7. 热更新
    - 热更控制脚本 game/initialize/view/HotUpdate.ts
    - 本地热更配置 resources/project.manifes
    - 本地热更配置 resources/version.manifes
8. 业务框架模板
    ![](http://dgflash.gitee.io/oops-full-stack-web/doc/img/module.png)

9. 框架以插件方式提供，与项目代码分离，方便不同版本平滑升级
    ![](http://dgflash.gitee.io/oops-full-stack-web/doc/img/oops-plug-in1.jpg)
    ![](http://dgflash.gitee.io/oops-full-stack-web/doc/img/oops-plug-in2.jpg)

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

#### 引用到的第三方NPM库
| 库名       | 介绍       | 安装                   | 原创                                             |
| ---------- | ---------- | ---------------------- | ------------------------------------------------ |
| seedrandom | 生成随机数 | npm install seedrandom | [原创](https://www.npmjs.com/package/seedrandom) |
| crypto-es  | 加密算法库 | yarn add crypto-es     | [原创](https://github.com/entronad/crypto-es)    |

#### 贡献榜
| 时间       | 开发者    | 贡献内容                                                                                    |
| ---------- | --------- | ------------------------------------------------------------------------------------------- |
| 2022-10-27 | 登科      | 自动生成Bundle包内资源代码智能提示插件                                                      |
| 2022-09-01 | GaGa 嘎嘎 | 自动化文档生成工具的部署指导                                                                |
| 2022-08-04 | Bz        | 修复UrlParse对象解析腾讯游戏大厅的地址查询参数数据错误问题                                  |
| 2022-06-02 | 羽毛先生  | 修复 UI 框架中界面无法不销毁移除的问题; 修复UI框架中从缓存获取界面时，传递新参数不更新问题  |
| 2022-04-15 | Hess      | 建议优化 ecs 框架所有生命周期事件在处理多实体时，将批处理逻辑移到框架层实现，减小业务代码量 |
| 2021-10-13 | laret     | 修复 Dialog 类型的 UI 不能连续触发                                                          |
| 2021-10-20 | dogegg    | 支持添加 cc.Component 到 ecs 实体对象中                                                     |
| 2022-02-18 | 匿名好友  | 修复 TimerManager 时间管理对象，在游戏最小化切到最大化时，定时间器不触发完成事件的问题      |

#### 在线演示
[网络游戏全栈解决方案](https://store.cocos.com/app/detail/3814)

[角色扮演游戏解决方案 - 2D角色](https://store.cocos.com/app/detail/3675)

[角色扮演游戏解决方案 - 3D角色](https://store.cocos.com/app/detail/4139)

[新手引导解决方案](https://store.cocos.com/app/detail/3653)

[Tiledmap地图类游戏解决方案](https://store.cocos.com/app/detail/4428)

[开源框架 oops-framework gitee](https://gitee.com/dgflash/oops-framework)

[开源框架 oops-framework github](https://github.com/dgflash/oops-framework)

