/*
 * @Author: dgflash
 * @Date: 2021-11-24 10:04:56
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-14 19:54:52
 */
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { TableRoleJob } from "../../common/table/TableRoleJob";
import { RoleAttributeType } from "./RoleEnum";
import { RoleModelComp } from "./RoleModelComp";

/** 
 * 角色职业数据 
 * 
 * 实现功能
 * 1、影响角色力量、敏捷战斗属性
 * 2、影响角色动画武器
 */
@ecs.register('RoleModelJob')
export class RoleModelJobComp extends ecs.Comp {
    private table: TableRoleJob = new TableRoleJob();

    /** 职业编号编号 */
    private _id: number = -1;
    get id(): number {
        return this._id;
    }
    set id(value: number) {
        this.table.init(value);
        this._id = value;

        var attributes = this.ent.get(RoleModelComp).attributes;
        attributes.get(RoleAttributeType.power).job = this.power;
        attributes.get(RoleAttributeType.agile).job = this.agile;
    }
    /** 职业名 */
    get armsName(): string {
        return this.table.armsName;
    }
    /** 力量 */
    get power(): number {
        return this.table.power;
    }
    /** 敏捷 */
    get agile(): number {
        return this.table.agile;
    }
    /** 武器类型 */
    get weaponType(): number[] {
        return this.table.weaponType;
    }

    reset() {
        this._id = -1;
    }
}