/*
 * @Author: dgflash
 * @Date: 2021-11-18 15:56:01
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-29 17:25:43
 */

import { ecs } from "../../../core/libs/ECS";
import { Role } from "../Role";
import { RoleNumeric } from "./attribute/RoleNumeric";
import { RoleNumericMap } from "./attribute/RoleNumericMap";
import { RoleAttributeType } from "./RoleEnum";

/** 角色当前叠加后的属性数据 */
@ecs.register('RoleModel')
export class RoleModelComp extends ecs.Comp {
    /** 外观接口 */
    facade: Role = null!;

    /** 提供 VM 组件使用的数据 */
    vm: any = {};

    /** ----------基础属性---------- */
    /** 角色编号 */
    id: number = -1;
    /** 昵称 */
    name: string = "";
    /** 角色属性 */
    attributes: RoleNumericMap = new RoleNumericMap(this.vm);

    reset() {
        this.id = -1;
        this.name = "";

        for (var key in this.vm) {
            delete this.vm[key];
        }
    }

    toString() {
        console.log(`【${this.name}】的属性"--------------------------------------------`);
        this.attributes.forEach((value: RoleNumeric, key: RoleAttributeType) => {
            console.log(key, value.value);
        });
    }
}
