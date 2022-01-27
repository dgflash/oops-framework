/*
 * @Author: dgflash
 * @Date: 2021-11-18 15:56:01
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-27 15:49:07
 */

import { ecs } from "../../../core/libs/ECS";
import { RoleAttributeType } from "./RoleEnum";
import { RoleModelComp } from "./RoleModelComp";

/** 角色基础属性数据 */
@ecs.register('RoleBaseModel')
export class RoleBaseModelComp extends ecs.Comp {
    /** ----------一维属性---------- */
    /** 力量 */
    private _power: number = 0;
    public get power(): number {
        return this._power;
    }
    public set power(value: number) {
        this._power = value;
        this.ent.get(RoleModelComp).attributes.get(RoleAttributeType.power).base = value;
    }

    /** 体质 */
    private _physical: number = 0;
    public get physical(): number {
        return this._physical;
    }
    public set physical(value: number) {
        this._physical = value;
        this.ent.get(RoleModelComp).attributes.get(RoleAttributeType.physical).base = value;
    }
    /** 敏捷 */
    private _agile: number = 0;
    public get agile(): number {
        return this._agile;
    }
    public set agile(value: number) {
        this._agile = value;
        this.ent.get(RoleModelComp).attributes.get(RoleAttributeType.agile).base = value;
    }

    reset() {
        this.power = 0;
        this.physical = 0;
        this.agile = 0;
    }
}