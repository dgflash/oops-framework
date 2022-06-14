

/*
 * @Author: dgflash
 * @Date: 2021-11-12 10:02:31
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-14 17:42:26
 */

import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
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