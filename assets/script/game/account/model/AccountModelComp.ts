

/*
 * @Author: dgflash
 * @Date: 2021-11-12 10:02:31
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-27 11:07:05
 */

import { ecs } from "../../../core/libs/ECS";
import { Role } from "../../role/Role";

/** 
 * 游戏帐号数据 
 */
@ecs.register('AccountModel')
export class AccountModelComp extends ecs.Comp {
    /** 资源列表 */
    currency: any = {};
    /** 角色对象 */
    role: Role = null!;

    reset() {

    }
}