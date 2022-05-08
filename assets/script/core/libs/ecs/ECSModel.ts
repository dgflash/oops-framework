import { ecs } from "./ECS";
import { ECSEntity } from "./ECSEntity";
import { ECSGroup } from "./ECSGroup";

export class ECSModel {
    /** 实体自增id */
    eid = 1;

    /** 组件类型id */
    compTid = 0;

    /** 组件缓存池 */
    compPools: Map<number, ecs.IComp[]> = new Map();

    /** 组件构造函数 */
    compCtors: (ecs.CompCtor<any> | number)[] = [];

    /**
     * 每个组件的添加和删除的动作都要派送到“关心”它们的group上。goup对当前拥有或者之前（删除前）拥有该组件的实体进行组件规则判断。判断该实体是否满足group
     * 所期望的组件组合。
     */
    compAddOrRemove: Map<number, ecs.CompAddOrRemove[]> = new Map();

    /** 编号获取组件 */
    tid2comp: Map<number, ecs.IComp> = new Map();

    /**
    * 实体对象缓存池
    */
    entityPool: Map<string, ECSEntity[]> = new Map();

    /**
     * 通过实体id查找实体对象
     */
    eid2Entity: Map<number, ECSEntity> = new Map();

    /**
     * 缓存的group
     * 
     * key是组件的筛选规则，一个筛选规则对应一个group
     */
    groups: Map<number, ECSGroup> = new Map();
}