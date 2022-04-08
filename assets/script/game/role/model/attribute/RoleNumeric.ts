/*
 * @Author: dgflash
 * @Date: 2022-01-20 18:20:32
 * @LastEditors: dgflash
 * @LastEditTime: 2022-02-09 13:11:39
 */

import { RoleAttributeType } from "../RoleEnum";
import { RoleNumericMap } from "./RoleNumericMap";

/** 影响角色属性的模块 */
export enum RoleModuleType {
    /** 初始默认属性 */
    Base,
    /** 职业附加属性 */
    Job,
    /** 等级附加属性 */
    Level,
    /** 装备附加属性 */
    Equip,
    /** 修饰器附加属性 */
    Decorator,
    /** 技能附加属性 */
    Skill
}

/** 
 * 角色属性对象
 * 1、不同模块设置对应的属性值
 * 2、任意模块的属性值修改时，自动角色属性更新后的数值和
 */
export class RoleNumeric {
    /** 数值更新事件 */
    onUpdate: Function = null!

    /** 属性类型 */
    type: RoleAttributeType = null!;

    /** 各模块附加值求和总数值 */
    value: number = 0;

    /** 属性值集合 */
    protected attributes: RoleNumericMap;
    /** 分组不同模块数值 */
    protected values: Map<RoleModuleType, number> = new Map();

    constructor(type: RoleAttributeType, attributes: RoleNumericMap) {
        this.type = type;
        this.attributes = attributes;

        // 设置初始值
        var rmt = RoleModuleType;
        for (var key in rmt) {
            var k = Number(key);
            if (k > -1) this.values.set(k, 0);
        }
    }

    /** 获取指定模块属性值 */
    protected getValue(module: RoleModuleType) {
        return this.values.get(module);
    }

    /** 设置指定模块属性值 */
    protected setValue(module: RoleModuleType, value: number) {
        this.values.set(module, value);
        this.update();
    }

    protected update() {
        var result = 0;
        this.values.forEach(value => {
            result += value;
        });
        this.value = result;

        this.onUpdate && this.onUpdate(this);
    }

    reset() {
        this.values.clear();
        this.update();
    }

    /** 角色基础属性 */
    get base(): number {
        return this.getValue(RoleModuleType.Base)!;
    }
    set base(value: number) {
        this.setValue(RoleModuleType.Base, value);
    }

    /** 等级属性 */
    get level(): number {
        return this.getValue(RoleModuleType.Level)!;
    }
    set level(value: number) {
        this.setValue(RoleModuleType.Level, value);
    }

    /** 角色职业属性 */
    get job(): number {
        return this.getValue(RoleModuleType.Job)!;
    }
    set job(value: number) {
        this.setValue(RoleModuleType.Job, value);
    }

    /** 角色装备属性 */
    get equip(): number {
        return this.getValue(RoleModuleType.Equip)!;
    }
    set equip(value: number) {
        this.setValue(RoleModuleType.Equip, value);
    }

    /** 修饰器属性 */
    get decorator(): number {
        return this.getValue(RoleModuleType.Decorator)!;
    }
    set decorator(value: number) {
        this.setValue(RoleModuleType.Decorator, value);
    }

    /** 技能附加属性 */
    get skill(): number {
        return this.getValue(RoleModuleType.Skill)!;
    }
    set skill(value: number) {
        this.setValue(RoleModuleType.Skill, value);
    }
}