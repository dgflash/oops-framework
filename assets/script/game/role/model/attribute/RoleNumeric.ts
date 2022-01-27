/*
 * @Author: dgflash
 * @Date: 2022-01-20 18:20:32
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-26 17:04:49
 */

import { RoleAttributeType } from "../RoleEnum";
import { RoleNumericMap } from "./RoleNumericMap";

/** 
 * 角色属性值
 * 1、不同模块设置对应的属性值
 * 2、任意模块的值修改时，自动计算当前值的所有模块的和
 * 3、每个模块对象自己求出息管理属性列表的值，等待多模块角色属性对象叠加
 */
export class RoleNumeric {
    protected attributes: RoleNumericMap;

    constructor(attributes: RoleNumericMap) {
        this.attributes = attributes;
    }

    protected _base: number = 0;
    /** 角色基础属性 */
    get base(): number {
        return this._base;
    }
    set base(value: number) {
        this._base = value;
        this.update();
    }

    protected _level: number = 0;
    /** 等级属性 */
    get level(): number {
        return this._level;
    }
    set level(value: number) {
        this._level = value;
        this.update();
    }

    protected _job: number = 0;
    /** 角色职业属性 */
    get job(): number {
        return this._job;
    }
    set job(value: number) {
        this._job = value;
        this.update();
    }

    protected _equip: number = 0;
    /** 角色装备属性 */
    get equip(): number {
        return this._equip;
    }
    set equip(value: number) {
        this._equip = value;
        this.update();
    }

    protected _decorator: number = 0;
    /** 战斗动态效果装饰属性 */
    get decorator(): number {
        return this._decorator;
    }
    set decorator(value: number) {
        this._decorator = value;
        this.update();
    }

    protected _battle: number = 0;
    /** 战斗角色属性 */
    get battle(): number {
        return this._battle;
    }
    set battle(value: number) {
        this._battle = value;
        this.update();
    }

    value: number = 0;

    protected update() {
        this.value = this.base
            + this.level
            + this.job
            + this.equip
            + this.battle
            + this.decorator;
    }
}

/** 角色数值装饰器 */
export class RoleNumericDecorator {
    /** 属性类型 */
    attribute: RoleAttributeType = null!;
    /** 属性数值 */
    value: number = 0;
}