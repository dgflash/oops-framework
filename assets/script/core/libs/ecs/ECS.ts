import { ECSComp } from "./ECSComp";
import { ECSEntity } from "./ECSEntity";
import { ECSMatcher } from "./ECSMatcher";
import { ECSModel } from "./ECSModel";
import { createGroup, ECSComblockSystem, ECSRootSystem, ECSSystem } from "./ECSSystem";

export module ecs {
    export type Entity = ECSEntity;
    export type Comp = ECSComp;
    export type System = ECSSystem;
    export type RootSystem = ECSRootSystem;
    export type ComblockSystem = ECSComblockSystem;

    export const Entity = ECSEntity;
    export const Comp = ECSComp;
    export const System = ECSSystem;
    export const RootSystem = ECSRootSystem;
    export const ComblockSystem = ECSComblockSystem;

    /** 注：不要尝试修改此对象数据，非对外使用 */
    export const model = new ECSModel();

    export type CompAddOrRemove = (entity: Entity) => void;
    export type CompType<T> = CompCtor<T> | number;

    //#region 接口
    export interface EntityCtor<T> {
        new(): T;
    }

    export interface IComp {
        canRecycle: boolean;
        ent: Entity;

        reset(): void;
    }

    export interface CompCtor<T> {
        new(): T;
        tid: number;
        compName: string;
    }

    export interface IMatcher {
        mid: number;
        indices: number[];
        key: string;
        isMatch(entity: Entity): boolean;
    }

    /**
     * 如果需要监听实体首次进入System的情况，实现这个接口。
     * 
     * entityEnter会在update方法之前执行，实体进入后，不会再次进入entityEnter方法中。
     * 当实体从当前System移除，下次再次符合条件进入System也会执行上述流程。
     */
    export interface IEntityEnterSystem<E extends Entity = Entity> {
        entityEnter(entity: E): void;
    }

    /** 如果需要监听实体从当前System移除，需要实现这个接口。*/
    export interface IEntityRemoveSystem<E extends Entity = Entity> {
        entityRemove(entity: E): void;
    }

    /** 第一次执行update */
    export interface ISystemFirstUpdate<E extends Entity = Entity> {
        firstUpdate(entity: E): void;
    }

    /** 执行update */
    export interface ISystemUpdate<E extends Entity = Entity> {
        update(entity: E): void;
    }
    //#endregion

    /**
     * 注册组件到ecs系统中
     * @param compName 由于js打包会改变类名，所以这里必须手动传入组件的名称。
     * @param canNew 标识是否可以new对象。想继承自Cocos Creator的组件就不能去new，需要写成@ecs.register('name', false)
     */
    export function register<T>(compName: string, canNew: boolean = true) {
        return function (ctor: CompCtor<T>) {
            if (ctor.tid === -1) {
                ctor.tid = model.compTid++;
                ctor.compName = compName;
                if (canNew) {
                    model.compCtors.push(ctor);
                    model.compPools.set(ctor.tid, []);
                }
                else {
                    model.compCtors.push(null!);
                }
                model.compAddOrRemove.set(ctor.tid, []);
            }
            else {
                throw new Error(`重复注册组件： ${compName}.`);
            }
        }
    }

    /** 扩展：获取带 eid 自增量的实体（继承Entity方式的编码风格，可减少一定代码量） */
    export function getEntity<T extends Entity>(ctor: EntityCtor<T>): T {
        var entitys = model.entityPool.get(ctor.name) || [];
        let entity: any = entitys.pop();
        if (!entity) {
            entity = new ctor();
            entity.eid = model.eid++; // 实体id也是有限的资源
        }

        if (entity.init)
            entity.init();
        else
            console.error(`${ctor.name} 实体缺少 init 方法初始化默认组件`);

        model.eid2Entity.set(entity.eid, entity);
        return entity as T;
    }

    /**
     * 动态查询实体
     * @param matcher 
     * @returns 
     */
    export function query<E extends Entity = Entity>(matcher: IMatcher): E[] {
        let group = model.groups.get(matcher.mid);
        if (!group) {
            group = createGroup(matcher);
            model.eid2Entity.forEach(group.onComponentAddOrRemove, group);
        }
        return group.matchEntities as E[];
    }

    /** 清理所有的实体 */
    export function clear() {
        model.eid2Entity.forEach((entity) => {
            entity.destroy();
        });
        model.groups.forEach((group) => {
            group.clear();
        });
        model.compAddOrRemove.forEach(callbackLst => {
            callbackLst.length = 0;
        });
        model.eid2Entity.clear();
        model.groups.clear();
    }

    /**
     * 根据实体id获得实体对象
     * @param eid 
     */
    export function getEntityByEid<E extends Entity = Entity>(eid: number): E {
        return model.eid2Entity.get(eid) as E;
    }

    /** 当前活动中的实体数量 */
    export function activeEntityCount() {
        return model.eid2Entity.size;
    }

    /** 创建实体 */
    function createEntity<E extends Entity = Entity>(): E {
        let entity = new Entity();
        entity.eid = model.eid++;                     // 实体id也是有限的资源
        model.eid2Entity.set(entity.eid, entity);
        return entity as E;
    }

    /**
     * 指定一个组件创建实体，返回组件对象。
     * @param ctor 
     */
    function createEntityWithComp<T extends IComp>(ctor: CompCtor<T>): T {
        let entity = createEntity();
        return entity.add(ctor);
    }

    //#region 过滤器
    /**
     * 表示只关心这些组件的添加和删除动作。虽然实体可能有这些组件之外的组件，但是它们的添加和删除没有被关注，所以不会存在对关注之外的组件
     * 进行添加操作引发Group重复添加实体。
     * @param args 
     */
    export function allOf(...args: CompType<IComp>[]) {
        return new ECSMatcher().allOf(...args);
    }

    /**
     * 组件间是或的关系，表示关注拥有任意一个这些组件的实体。
     * @param args 组件索引
     */
    export function anyOf(...args: CompType<IComp>[]) {
        return new ECSMatcher().anyOf(...args);
    }

    /**
     * 表示关注只拥有这些组件的实体
     * 
     * 注意：
     *  不是特殊情况不建议使用onlyOf。因为onlyOf会监听所有组件的添加和删除事件。
     * @param args 组件索引
     */
    export function onlyOf(...args: CompType<IComp>[]) {
        return new ECSMatcher().onlyOf(...args);
    }

    /**
     * 不包含指定的任意一个组件
     * 
     * eg.
     *  ecs.excludeOf(A, B);表示不包含组件A或者组件B
     * @param args 
     */
    export function excludeOf(...args: CompType<IComp>[]) {
        return new ECSMatcher().excludeOf(...args);
    }
    //#endregion

    //#region 单例组件
    /**
     * 获取单例组件
     * @param ctor 组件类
     */
    export function getSingleton<T extends IComp>(ctor: CompCtor<T>) {
        if (!model.tid2comp.has(ctor.tid)) {
            let comp = createEntityWithComp(ctor) as T;
            model.tid2comp.set(ctor.tid, comp);
        }
        return model.tid2comp.get(ctor.tid) as T;
    }

    /**
     * 注册单例。主要用于那些不能手动创建对象的组件
     * @param obj 
     */
    export function addSingleton(obj: IComp) {
        let tid = (obj.constructor as CompCtor<IComp>).tid;
        if (!model.tid2comp.has(tid)) {
            model.tid2comp.set(tid, obj);
        }
    }

    //#endregion
}