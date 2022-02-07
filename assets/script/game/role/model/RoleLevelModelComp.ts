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

/**
 * 角色等级数据
 * 
 * 实现功能
 * 1、角色等级变化时、获取升级配置表中的生命附加值叠加到角色属性上
 * 
 * 技术分析
 * 1、等级模块直接通过数据访问层的API获取到本地等级配置表数据，通过当前等级匹配到配置表中的等级配置数据
 * 2、获取到的等级配置数据中的生命附加值，叠加到角色战斗属性的等级模块附加值上
 */
@ecs.register('RoleLevelModel')
export class RoleLevelModelComp extends ecs.Comp {
    /** 提供 VM 组件使用的数据 */
    vm: any = {};

    /** 当前等级已获取的经验值 */
    private _exp: number = 0;
    public get exp(): number {
        return this._exp;
    }
    public set exp(value: number) {
        this._exp = value;
        this.vm.exp = value;
    }

    private _lv: number = 0;
    /** 等级 */
    public get lv(): number {
        return this._lv;
    }
    public set lv(value: number) {
        this._lv = value;
        this.vm.lv = value;
        this.ent.get(RoleModelComp).attributes.get(RoleAttributeType.hp).level = this.rtlu.hp;
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

        for (var key in this.vm) {
            delete this.vm[key];
        }
    }
}
