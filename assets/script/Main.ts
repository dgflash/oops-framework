/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-26 17:30:22
 */
import { setDisplayStats, _decorator } from 'cc';
import { DEBUG } from 'cc/env';
import { ecs } from './core/libs/ECS';
import { Root } from './core/Root';
import { SingletonModuleComp } from './game/common/ecs/SingletonModuleComp';
import { Initialize } from './game/initialize/Initialize';
const { ccclass, property } = _decorator;

/*
封装加密版本的本地存储API到engine.storage中使用
扩展 config.json 配置engine.http的服务器地址与请求超时
ECS DEMO 通用项目模板(cc.Component + ecs.Comp + VMComp DEMO)

提升新项目搭建的效率
提升团队开发模块开发的代码标准
*/

@ccclass('Main')
export class Main extends Root {
    start() {
        if (DEBUG) setDisplayStats(true);
    }

    protected run() {
        var module = ecs.getSingleton(SingletonModuleComp);
        module.initialize = new Initialize();
        module.initialize.open();
    }
}