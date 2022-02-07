/*
 * @Author: dgflash
 * @Date: 2022-01-20 18:20:32
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-29 16:52:08
 */

import { RoleAttributeType } from "../RoleEnum";
import { RoleNumericMap } from "./RoleNumericMap";

/** 
 * 角色属性值
 * 1、不同模块设置对应的属性值
 * 2、任意模块的属性值修改时，自动角色属性更新后的数值和
 */
export class RoleNumeric {
    /** 数值更新事件 */
    onUpdate: Function = null!

    /** 属性类型 */
    type: RoleAttributeType = null!;

    /** 属性值集合 */
    protected attributes: RoleNumericMap;

    constructor(type: RoleAttributeType, attributes: RoleNumericMap) {
        this.type = type;
        this.attributes = attributes;
    }

    reset() {
        this._base = 0;
        this._job = 0;
        this._level = 0;
        this._equip = 0;
        this._decorator = 0;
        this._battle = 0;
        this.update();
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

    protected _battle: number = 0;
    /** 战斗角色属性 */
    get battle(): number {
        return this._battle;
    }
    set battle(value: number) {
        this._battle = value;
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

    value: number = 0;

    protected update() {
        this.value = this.base
            + this.level
            + this.job
            + this.equip
            + this.battle
            + this.decorator;

        this.onUpdate && this.onUpdate(this);
    }
}