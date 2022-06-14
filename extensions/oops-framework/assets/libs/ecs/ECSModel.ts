/*
 * @Author: dgflash
 * @Date: 2022-05-12 14:18:44
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-24 11:07:13
 */
import { ecs } from "./ECS";
import { ECSEntity } from "./ECSEntity";
import { ECSGroup } from "./ECSGroup";

export class ECSModel {
    /** 实体自增id */
    static eid = 1;

    /** 组件类型id */
    static compTid = 0;

    /** 组件缓存池 */
    static compPools: Map<number, ecs.IComp[]> = new Map();

    /** 组件构造函数 */
    static compCtors: (ecs.CompCtor<any> | number)[] = [];

    /**
     * 每个组件的添加和删除的动作都要派送到“关心”它们的group上。goup对当前拥有或者之前（删除前）拥有该组件的实体进行组件规则判断。判断该实体是否满足group
     * 所期望的组件组合。
     */
    static compAddOrRemove: Map<number, ecs.CompAddOrRemove[]> = new Map();

    /** 编号获取组件 */
    static tid2comp: Map<number, ecs.IComp> = new Map();

    /**
    * 实体对象缓存池
    */
    static entityPool: Map<string, ECSEntity[]> = new Map();

    /**
     * 通过实体id查找实体对象
     */
    static eid2Entity: Map<number, ECSEntity> = new Map();

    /**
     * 缓存的group
     * 
     * key是组件的筛选规则，一个筛选规则对应一个group
     */
    static groups: Map<number, ECSGroup> = new Map();
}