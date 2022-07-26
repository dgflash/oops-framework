/*
 * @Author: dgflash
 * @Date: 2021-11-18 15:56:01
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-14 19:54:43
 */

import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { VM } from "../../../../../extensions/oops-plugin-framework/assets/libs/model-view/ViewModel";
import { RoleAttributeType } from "./RoleEnum";
import { RoleModelComp } from "./RoleModelComp";

/**
 * 角色基础属性数据
 * 
 * 实现功能
 * 1、角色初始创建时有随机的基础战斗属性
 * 2、基础战斗属性会独立显示数值
 * 
 * 技术分析
 * 1、RoleModelComp.attributes 中设计了可扩展的角色战斗属性对象，这里分出来一个基础属性对象，是为了生成 VM 组件需要的数据格式，辅助视图层的显示逻辑
 * 2、这样设计用意是不在 RoleModelComp 对象中插入一个针对基础属性的 VM 数据。这里表达在新增需求时，尽量通过增量开发，不影响原有功能。在项目代码越来越多时，不容易因忽略某个点导致出现新问题。
 */
@ecs.register('RoleModelBase')
export class RoleModelBaseComp extends ecs.Comp {
    /** 提供 VM 组件使用的数据 */
    private vm: any = {};

    /** 力量 */
    private _power: number = 0;
    public get power(): number {
        return this._power;
    }
    public set power(value: number) {
        this._power = value;
        this.ent.get(RoleModelComp).attributes.get(RoleAttributeType.power).base = value;
        this.vm[RoleAttributeType.power] = value;
    }

    /** 体质 */
    private _physical: number = 0;
    public get physical(): number {
        return this._physical;
    }
    public set physical(value: number) {
        this._physical = value;
        this.ent.get(RoleModelComp).attributes.get(RoleAttributeType.physical).base = value;
        this.vm[RoleAttributeType.physical] = value;
    }

    /** 敏捷 */
    private _agile: number = 0;
    public get agile(): number {
        return this._agile;
    }
    public set agile(value: number) {
        this._agile = value;
        this.ent.get(RoleModelComp).attributes.get(RoleAttributeType.agile).base = value;
        this.vm[RoleAttributeType.agile] = value;
    }

    vmAdd() {
        VM.add(this.vm, "RoleBase");
    }

    vmRemove() {
        VM.remove("RoleBase");
    }

    reset() {
        this.vmRemove();

        for (var key in this.vm) {
            this.vm[key] = 0;
        }
    }
}