/*
 * @Author: dgflash
 * @Date: 2021-11-18 15:56:01
 * @LastEditors: dgflash
 * @LastEditTime: 2022-03-10 11:38:31
 */

import { ecs } from "../../../core/libs/ECS";
import { VM } from "../../../core/libs/model-view/ViewModel";
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
@ecs.register('RoleModelLevel')
export class RoleModelLevelComp extends ecs.Comp {
    /** 下个等级配置 */
    rtluNext: RoleTableLevelUp = new RoleTableLevelUp();
    /** 当前等级配置 */
    rtluCurrent: RoleTableLevelUp = new RoleTableLevelUp();

    /** 提供 VM 组件使用的数据 */
    vm: RoleLevelVM = new RoleLevelVM();

    vmAdd() {
        VM.add(this.vm, "RoleLevel");
    }

    vmRemove() {
        this.vm.reset();
        VM.remove("RoleLevel");
    }

    reset() {
        this.vmRemove();
    }
}

class RoleLevelVM {
    /** 当前等级 */
    lv: number = 0;
    /** 当前经验 */
    exp: number = 0;
    /** 下级经验 */
    expNext: number = 0;

    reset() {
        this.lv = 0;
        this.exp = 0;
        this.expNext = 0;
    }
}