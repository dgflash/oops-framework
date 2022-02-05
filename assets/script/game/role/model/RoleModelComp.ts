/*
 * @Author: dgflash
 * @Date: 2021-11-18 15:56:01
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-29 17:25:43
 */

import { ecs } from "../../../core/libs/ECS";
import { RoleNumeric } from "./attribute/RoleNumeric";
import { RoleNumericMap } from "./attribute/RoleNumericMap";
import { RoleAttributeType } from "./RoleEnum";

/** 角色当前叠加后的属性数据 */
@ecs.register('RoleModel')
export class RoleModelComp extends ecs.Comp {
    /** 提供 VM 组件使用的数据 */
    vm: any = {};

    /** ----------基础属性---------- */
    /** 角色编号 */
    id: number = -1;

    private _name: string = "";
    /** 昵称 */
    get name(): string {
        return this._name;
    }
    set name(value: string) {
        this._name = value;
        this.vm.name = value;
    }

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
