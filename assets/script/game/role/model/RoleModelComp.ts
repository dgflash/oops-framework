/*
 * @Author: dgflash
 * @Date: 2021-11-18 15:56:01
 * @LastEditors: dgflash
 * @LastEditTime: 2022-02-10 10:05:30
 */

import { ecs } from "../../../core/libs/ECS";
import { RoleNumeric } from "./attribute/RoleNumeric";
import { RoleNumericMap } from "./attribute/RoleNumericMap";
import { RoleAttributeType } from "./RoleEnum";

/** 
 * 角色属性数据 
 * 
 * 实现功能
 * 1、角色唯一基础数据
 * 2、角色战斗属性数据
 * 3、角色VM组件绑定数据
 * 
 * 技术分析
 * 1、使用ecs.Comp做为数据层的基类，是为了后续业务开发过程中，只要ecs.Entity对象中包含了当前数据组件，就可以通过 ecs.Entity.get(RoleModelComp) 的方式获取对应子模块的数据
 */
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
            this.vm[key] = 0;
        }
    }

    toString() {
        console.log(`【${this.name}】的属性"--------------------------------------------`);
        this.attributes.forEach((value: RoleNumeric, key: RoleAttributeType) => {
            console.log(key, value.value);
        });
    }
}
