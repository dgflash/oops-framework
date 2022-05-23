# oops-framework

#### 介绍
oops-framework 基于 Cocos Creato 3.x 开发的一款游戏框架
1. 提供游戏常用功能库，提高开发效率
2. 提供业务模块开发的模板，降低程序设计难度
3. 框架内置模块低耦合，可自行删除不需要的模块
4. 框架提供游戏常用插件工具

注：
1. [源库链接更新效率更高](https://gitee.com/dgflash/oops-framework)（好用记得给作者一个Star）
2. Cocos Creato 3.x 不同版的框架在源库分支中下载，master分支为最新引擎版本
3. 学习交流 QQ 群：798575969
    ![](./doc/imgs/qq.png)

#### 框架使用说明
框架里的技术内容是较多，每项技术作者都用到项目中测试过，所以单项技术的稳定性是相对有保证的。开发者拿到框架按自己当前需求了解需要的技术即可。

1. 初次接触游戏开发者的阅读建议
    - 阅读 script/game/initialize 文件夹下的游戏初始化流程
    - 理解如何建立一个游戏模块
    - 理解游戏初始化流程做了哪些事
    - 理解资源加载界面是如何通过界面管理（oops.gui.open）的API启动预制界面
    - 理解后举一反三，通过预制拼好界面，尝试调用通过 Cocos Creator 节点组件开发模式制作界面，在通过 oops-framework 的API 管理界面的打开与关闭
    - 然后做一些 DEMO 小程序练习加深技术使用熟练度，在转入到第二阶段

2. 有项目经验开发者的阅读建议
    - 阅读 script/game 中作者提供的一个 DEMO，这个 DEMO 作者表达的是基于 oops-framework 设计的业务框架
    - 理解模块三层架构设计思路，辅助需求分析
    - 理解模块代码模板，辅助业务模块开发
    - 理解模块之间代码分离，保持业务思路清晰
    - 理解模块之间低耦合，降低模块之间的依赖度

#### 技术分类
1. 基础类
    - 界面管理 - LayerManager.ts
    - 资源管理 - ResLoader.ts
    - 时间管理 - TimerManager.ts
    - 音效管理 - AudioManager.ts
    - 消息管理 - MessageManager.ts
    - 屏幕适应 - GUI.ts.ts
    - 本地存储 - StorageManager.ts
2. 界面类 
    - 常用UI组件
        - 按钮类 - gui/button
        - 标签类 - gui/label
        - 语言类 - gui/language
    - MVVM组件库 - core/libs/model-view
    - 特效管理 - core/game/effect
3. 网络类
    - Http - core/network/HttpRequest.ts
    - WebSocket - core/network/NetManager.ts
4. 框架类
    - ECS - core/libs/ECS.ts
    - BehaviorTree 行为树 - core/libs/behavior-tree
    - 可视化动画状态机 - core/libs/animator
5. 工具类
    - 异步队列 - AsyncQueue.ts
    - 日志管理 - Logger.ts
    - 随机数生成器 - RandomManager.ts
    - 加密工具 - core/libs/security
    - gzip压缩 - core/libs/pako.min
    - 辅助方法库 - core/utils
6. 渲染纹理 
    - 三维摄像机内容显示到模型上 - RtToModel
    - 三维模型显示到二维精灵上 - RtToSprite
7. 热更新
    - 热更控制脚本 game/initialize/view/HotUpdate.ts
    - 本地热更配置 resources/project.manifes
    - 本地热更配置 resources/version.manifes
8. Cocos Creator 3.5 版本新功能业务框架模板
    ![](./doc/imgs/module.png)

#### 插件分类
1. 静态配置表Excel转Json数据与对应的数据结构TS脚本插件[【教程传送门】](https://blog.csdn.net/weixin_39324642/article/details/124484273?spm=1001.2014.3001.5502)
2. 热更新组件配套生成热更数据插件 [【教程传送门】](https://blog.csdn.net/weixin_39324642/article/details/124483993?spm=1001.2014.3001.5502)

#### 第三方源码库
| 库名          | 介绍                                                                  | 原创                                                         |
| ------------- | --------------------------------------------------------------------- | ------------------------------------------------------------ |
| WebSocket     | 原创者设计灵活，易扩展自定义协议                                      | [原创](https://github.com/wyb10a10/cocos_creator_framework)  |
| animator      | 可视化动画状态机，与Untiy的Animator使用体验类似，扩展3D骨骼动画支持 | [原创](https://github.com/LeeYip/cocos-animator)             |
| model-view    | MVVM组件库，原库为cc2.x版本，本人升级到cc3.x                          | [原创](https://github.com/wsssheep/cocos_creator_mvvm_tools) |
| ECS           | Entity-Component-System，原码升级优化过                               | [原创](https://github.com/shangdibaozi/ECS)                  |

#### 第三方 NPM 库
| 库名       | 介绍                               | 安装                      | 原创                                             |
| ---------- | ---------------------------------- | ------------------------- | ------------------------------------------------ |
| Nano ID    | 生成唯一标识                       | npm install --save nanoid | [原创](https://github.com/ai/nanoid)             |
| seedrandom | 生成随机数                         | npm install seedrandom    | [原创](https://www.npmjs.com/package/seedrandom) |
| ky         | Fetch API 的小巧优雅的 HTTP 客户端 | npm install ky            | [原创](https://github.com/sindresorhus/ky)       |

#### 贡献榜
| 时间       | 开发者   | 贡献内容                                                                                    |
| ---------- | -------- | ------------------------------------------------------------------------------------------- |
| 2022-04-15 | Hess     | 建议优化 ecs 框架所有生命周期事件在处理多实体时，将批处理逻辑移到框架层实现，减小业务代码量 |
| 2021-10-13 | laret    | 修复 Dialog 类型的 UI 不能连续触发                                                          |
| 2021-10-20 | dogegg   | 支持添加 cc.Component 到 ecs 实体对象中                                                     |
| 2022-02-18 | 匿名好友 | 修复 TimerManager 时间管理对象，在游戏最小化切到最大化时，定时间器不触发完成事件的问题      |

#### [框架部分功能演示](https://oops-1255342636.cos-website.ap-shanghai.myqcloud.com/oops-framework/)
#### [框架实现的解决方案演示](https://oops-1255342636.cos-website.ap-shanghai.myqcloud.com/oops-solution/)
#### [游戏地图模块 oops-rpg-2d](https://store.cocos.com/app/detail/3675)
#### [新手引导模块 oops-guide](https://store.cocos.com/app/detail/3653)
#### [联机游戏框架 oops-mgobe](https://store.cocos.com/app/detail/3574)
#### [开源框架 oops-framework gitee](https://gitee.com/dgflash/oops-framework)
#### [开源框架 oops-framework github](https://github.com/dgflash/oops-framework)