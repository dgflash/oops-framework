/*
 * @Author: dgflash
 * @Date: 2021-11-18 14:20:46
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-14 19:54:06
 */

import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import { Account } from "../../account/Account";
import { Initialize } from "../../initialize/Initialize";

/** 游戏模块 */
@ecs.register('SingletonModule')
export class SingletonModuleComp extends ecs.Comp {
    /** 游戏初始化模块 */
    initialize: Initialize = null!;
    /** 游戏账号模块 */
    account: Account = null!;

    reset() { }
}

export var smc: SingletonModuleComp = ecs.getSingleton(SingletonModuleComp);