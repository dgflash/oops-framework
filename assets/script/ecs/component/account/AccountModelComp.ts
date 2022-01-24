

/*
 * @Author: dgflash
 * @Date: 2021-11-12 10:02:31
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-24 14:54:28
 */

import { ecs } from "../../../core/libs/ECS";

/** 
 * 游戏帐号数据 
 */
@ecs.register('AccountModel')
export class AccountModelComp extends ecs.Comp {
    /** 资源列表 */
    currency: any = {};

    reset() {

    }
}