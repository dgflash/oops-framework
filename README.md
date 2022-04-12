# oops-framework
#### 介绍
oops-framework 基于 Cocos Creato 3.x 开发的一款游戏框架
1. 提供游戏常用功能库，提高开发效率
2. 提供业务模块开发的模板，降低程序设计难度
3. 框架内置模块低耦合，可自行删除不需要的模块

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
3. 网络类
    - Http - core/network/HttpRequest.ts
    - WebSocket - core/network/NetManager.ts
4. 框架类
    - ECS（Entity-Component-System）- core/libs/ECS.ts
    - BehaviorTree 行为树 - core/libs/behavior-tree
    - 可视化动画状态机 - core/libs/animator
5. 工具类
    - 异步队列 - AsyncQueue.ts
    - 日志管理 - Logger.ts
    - 随机数生成器 - RandomManager.ts
    - 各种辅助方法库
    - 加密工具 - core/utils
6. 渲染纹理 
    - 三维摄像机内容显示到模型上 - RtToModel
    - 三维模型显示到二维精灵上 - RtToSprite


#### 集成优秀的第三方库
1. WebSocket 框架（原创者设计灵活，易扩展自定义协议）[原创者代码地址](https://github.com/wyb10a10/cocos_creator_framework)
2. animator 可视化动画状态机（与Untiy3D的Animator使用体验类似，扩展三维骨骼动画支持） [原创者代码地址](https://github.com/LeeYip/cocos-animator)
3. model-view MVVM组件库（原库为cc2.x版本，本人升级到cc3.x） [原创者代码地址](https://github.com/wsssheep/cocos_creator_mvvm_tools)
4. seedrandom 带随机种子的随机数库 [原创者代码地址](https://www.npmjs.com/package/seedrandom)
5. ECS 框架 [原创者代码地址](https://github.com/shangdibaozi/ECS)
6. 资源打包zip加载 [原创者代码地址](https://github.com/Stuk/jszip)
7. behavior-tree 行为树
8. 本地存储库数据加密
9. MD5、Crypto

#### [框架部分功能演示](https://oops-1255342636.cos-website.ap-shanghai.myqcloud.com/oops-framework/)
#### [框架实现的解决方案演示](https://oops-1255342636.cos-website.ap-shanghai.myqcloud.com/oops-solution/)
#### [游戏地图模块 oops-rpg-2d](https://store.cocos.com/app/detail/3675)
#### [新手引导模块 oops-guide](https://store.cocos.com/app/detail/3653)
#### [联机游戏框架 oops-mgobe](https://store.cocos.com/app/detail/3574)
#### [开源框架 oops-framework gitee](https://gitee.com/dgflash/oops-framework)
#### [开源框架 oops-framework github](https://github.com/dgflash/oops-framework)

#### 注：
打开项目请用Cocos Creator v3.4.2 以上版本

#### 学习交流QQ群：798575969
