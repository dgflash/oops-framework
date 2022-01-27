/*
 * @Author: dgflash
 * @Date: 2021-11-18 15:56:01
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-26 17:17:34
 */

import { ecs } from "../../../core/libs/ECS";
import { Role } from "../Role";
import { RoleNumeric } from "./attribute/RoleNumeric";
import { RoleNumericMap } from "./attribute/RoleNumericMap";
import { RoleAttributeType } from "./RoleEnum";
import { RoleTableLevelUp } from "./RoleTableLevelUp";

/** 角色当前叠加后的属性数据 */
@ecs.register('RoleModel')
export class RoleModelComp extends ecs.Comp {
    /** 外观接口 */
    facade: Role = null!;

    /** ----------基础属性---------- */
    /** 角色编号 */
    id: number = -1;
    /** 昵称 */
    name: string = "";

    /** ----------等级属性---------- */
    /** 当前等级已获取的经验值 */
    exp: number = 0;

    /** 等级 */
    private _lv: number = 0;
    public get lv(): number {
        return this._lv;
    }
    public set lv(value: number) {
        this._lv = value;
        this.attributes.get(RoleAttributeType.hp).level = this.rtlu.hp;
    }

    private _rtlu: RoleTableLevelUp = null!;
    /** 升级后的变化属性 */
    get rtlu(): RoleTableLevelUp {
        if (this._rtlu == null)
            this._rtlu = new RoleTableLevelUp(this.lv);
        else if (this._rtlu.key != this.lv)
            this._rtlu.init(this.lv);
        return this._rtlu;
    }

    /** 角色属性 */
    attributes: RoleNumericMap = new RoleNumericMap();

    reset() {
        this.id = -1;
        this.name = "";
        this.lv = 0;
        this.exp = 0;
        this._rtlu = null!;
    }

    toString() {
        console.log(this.name, "--------------------------------------------");
        this.attributes.forEach((value: RoleNumeric, key: RoleAttributeType) => {
            console.log(key, value.value);
        });
        console.log(this.name, "--------------------------------------------");
    }
}
