import { ecs } from "./ECS";
import { ECSEntity } from "./ECSEntity";
import { ECSGroup } from "./ECSGroup";
import { ECSModel } from "./ECSModel";

/**
 * 创建group，每个group只关心对应组件的添加和删除
 * @param matcher 实体筛选器
 */
export function createGroup<E extends ECSEntity = ECSEntity>(matcher: ecs.IMatcher): ECSGroup<E> {
    let group = ECSModel.groups.get(matcher.mid);
    if (!group) {
        group = new ECSGroup(matcher);
        ECSModel.groups.set(matcher.mid, group);
        let careComponentTypeIds = matcher.indices;
        for (let i = 0; i < careComponentTypeIds.length; i++) {
            ECSModel.compAddOrRemove.get(careComponentTypeIds[i])!.push(group.onComponentAddOrRemove.bind(group));
        }
    }
    return group as unknown as ECSGroup<E>;
}

export abstract class ECSComblockSystem<E extends ECSEntity = ECSEntity> {
    protected group: ECSGroup<E>;
    protected dt: number = 0;

    private enteredEntities: Map<number, E> = null!;
    private removedEntities: Map<number, E> = null!;

    private hasEntityEnter: boolean = false;
    private hasEntityRemove: boolean = false;
    private hasUpdate: boolean = false;

    private tmpExecute: ((dt: number) => void) | null = null;
    private execute!: (dt: number) => void;

    constructor() {
        let hasOwnProperty = Object.hasOwnProperty;
        let prototype = Object.getPrototypeOf(this);
        let hasEntityEnter = hasOwnProperty.call(prototype, 'entityEnter');
        let hasEntityRemove = hasOwnProperty.call(prototype, 'entityRemove');
        let hasFirstUpdate = hasOwnProperty.call(prototype, 'firstUpdate');
        let hasUpdate = hasOwnProperty.call(prototype, 'update');

        this.hasEntityEnter = hasEntityEnter;
        this.hasEntityRemove = hasEntityRemove;
        this.hasUpdate = hasUpdate;

        if (hasEntityEnter || hasEntityRemove) {
            this.enteredEntities = new Map<number, E>();
            this.removedEntities = new Map<number, E>();

            this.execute = this.execute1;
            this.group = createGroup(this.filter());
            this.group.watchEntityEnterAndRemove(this.enteredEntities, this.removedEntities);
        }
        else {
            this.execute = this.execute0;
            this.group = createGroup(this.filter());
        }

        if (hasFirstUpdate) {
            this.tmpExecute = this.execute;
            this.execute = this.updateOnce;
        }
    }

    init(): void {

    }

    onDestroy(): void {

    }

    hasEntity(): boolean {
        return this.group.count > 0;
    }

    /**
     * 先执行entityEnter，最后执行firstUpdate
     * @param dt 
     * @returns 
     */
    private updateOnce(dt: number) {
        if (this.group.count === 0) {
            return;
        }

        this.dt = dt;

        // 处理刚进来的实体
        if (this.enteredEntities.size > 0) {
            var entities = this.enteredEntities.values();
            for (let entity of entities) {
                (this as unknown as ecs.IEntityEnterSystem).entityEnter(entity);
            }
            this.enteredEntities.clear();
        }

        // 只执行firstUpdate
        for (let entity of this.group.matchEntities) {
            (this as unknown as ecs.ISystemFirstUpdate).firstUpdate(entity);
        }

        this.execute = this.tmpExecute!;
        this.execute(dt);
        this.tmpExecute = null;
    }

    /**
     * 只执行update
     * @param dt 
     * @returns 
     */
    private execute0(dt: number): void {
        if (this.group.count === 0) return;

        this.dt = dt;

        // 执行update
        if (this.hasUpdate) {
            for (let entity of this.group.matchEntities) {
                (this as unknown as ecs.ISystemUpdate).update(entity);
            }
        }
    }

    /**
     * 先执行entityRemove，再执行entityEnter，最后执行update
     * @param dt 
     * @returns 
     */
    private execute1(dt: number): void {
        if (this.removedEntities.size > 0) {
            if (this.hasEntityRemove) {
                var entities = this.removedEntities.values();
                for (let entity of entities) {
                    (this as unknown as ecs.IEntityRemoveSystem).entityRemove(entity);
                }
            }
            this.removedEntities.clear();
        }

        if (this.group.count === 0) return;

        this.dt = dt;

        // 处理刚进来的实体
        if (this.enteredEntities!.size > 0) {
            if (this.hasEntityEnter) {
                var entities = this.enteredEntities!.values();
                for (let entity of entities) {
                    (this as unknown as ecs.IEntityEnterSystem).entityEnter(entity);
                }
            }
            this.enteredEntities!.clear();
        }

        // 执行update
        if (this.hasUpdate) {
            for (let entity of this.group.matchEntities) {
                (this as unknown as ecs.ISystemUpdate).update(entity);
            }
        }
    }

    /**
     * 实体过滤规则
     * 
     * 根据提供的组件过滤实体。
     */
    abstract filter(): ecs.IMatcher;
}

/**
 * System的root，对游戏中的System遍历从这里开始。
 * 
 * 一个System组合中只能有一个RootSystem，可以有多个并行的RootSystem。
 */
export class ECSRootSystem {
    private executeSystemFlows: ECSComblockSystem[] = [];
    private systemCnt: number = 0;

    add(system: ECSSystem | ECSComblockSystem) {
        if (system instanceof ECSSystem) {
            // 将嵌套的System都“摊平”，放在根System中进行遍历，减少execute的频繁进入退出。
            Array.prototype.push.apply(this.executeSystemFlows, system.comblockSystems);
        }
        else {
            this.executeSystemFlows.push(system as ECSComblockSystem);
        }
        this.systemCnt = this.executeSystemFlows.length;
        return this;
    }

    init() {
        this.executeSystemFlows.forEach(sys => sys.init());
    }

    execute(dt: number) {
        for (let i = 0; i < this.systemCnt; i++) {
            // @ts-ignore
            this.executeSystemFlows[i].execute(dt);
        }
    }

    clear() {
        this.executeSystemFlows.forEach(sys => sys.onDestroy());
    }
}

/**
 * 系统组合器，用于将多个相同功能模块的系统逻辑上放在一起。System也可以嵌套System。
 */
export class ECSSystem {
    private _comblockSystems: ECSComblockSystem[] = [];
    get comblockSystems() {
        return this._comblockSystems;
    }

    add(system: ECSSystem | ECSComblockSystem) {
        if (system instanceof ECSSystem) {
            Array.prototype.push.apply(this._comblockSystems, system._comblockSystems);
            system._comblockSystems.length = 0;
        }
        else {
            this._comblockSystems.push(system as ECSComblockSystem);
        }
        return this;
    }
}