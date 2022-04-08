/*
 * @Author: dgflash
 * @Date: 2021-11-24 10:04:56
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-29 10:56:57
 */

import { ecs } from "../../../core/libs/ECS";
import { JsonUtil } from "../../../core/utils/JsonUtil";
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
    static TableName: string = "arms";

    /** 静态表中一条数据 */
    private data: any;

    private init(id: number) {
        var table = JsonUtil.get(RoleModelJobComp.TableName);
        this.data = table[id];

        console.log(`【职业编号】${id},力量：${this.power},敏捷：${this.agile} `);

        var attributes = this.ent.get(RoleModelComp).attributes;
        attributes.get(RoleAttributeType.power).job = this.power;
        attributes.get(RoleAttributeType.agile).job = this.agile;
    }

    /** 职业编号编号 */
    private _id: number = -1;
    get id(): number {
        return this._id;
    }
    set id(value: number) {
        this.init(value);
        this._id = value;
    }
    /** 职业名 */
    get armsName(): string {
        return this.data.armsName;
    }
    /** 力量 */
    get power(): number {
        return this.data.power;
    }
    /** 敏捷 */
    get agile(): number {
        return this.data.agile;
    }
    /** 武器类型 */
    get weaponType(): number[] {
        return this.data.weaponType;
    }

    reset() {
        this._id = -1;
        this.data = null;
    }
}