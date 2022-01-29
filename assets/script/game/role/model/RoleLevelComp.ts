/*
 * @Author: dgflash
 * @Date: 2021-11-18 15:56:01
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-29 16:51:20
 */

import { ecs } from "../../../core/libs/ECS";
import { RoleAttributeType } from "./RoleEnum";
import { RoleModelComp } from "./RoleModelComp";
import { RoleTableLevelUp } from "./RoleTableLevelUp";

/** 角色等级数据 */
@ecs.register('RoleLevel')
export class RoleLevelComp extends ecs.Comp {
    /** 当前等级已获取的经验值 */
    private _exp: number = 0;
    public get exp(): number {
        return this._exp;
    }
    public set exp(value: number) {
        this._exp = value;
        this.ent.get(RoleModelComp).vm.exp = value;
    }

    /** 等级 */
    private _lv: number = 0;
    public get lv(): number {
        return this._lv;
    }
    public set lv(value: number) {
        this._lv = value;

        var rm = this.ent.get(RoleModelComp);
        rm.attributes.get(RoleAttributeType.hp).level = this.rtlu.hp;
        rm.vm.lv = value;
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

    reset() {
        this.lv = 0;
        this.exp = 0;
        this._rtlu = null!;
    }
}
