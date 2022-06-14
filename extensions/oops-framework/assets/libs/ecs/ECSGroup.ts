import { ecs } from "./ECS";
import { ECSEntity } from "./ECSEntity";

export class ECSGroup<E extends ECSEntity = ECSEntity> {
    /** 实体筛选规则 */
    private matcher: ecs.IMatcher;

    private _matchEntities: Map<number, E> = new Map();

    private _entitiesCache: E[] | null = null;

    /**
     * 符合规则的实体
     */
    get matchEntities() {
        if (this._entitiesCache === null) {
            this._entitiesCache = Array.from(this._matchEntities.values());
        }
        return this._entitiesCache;
    }

    /**
     * 当前group中实体的数量。
     * 
     * 注：不要手动修改这个属性值。
     * 注：其实可以通过this._matchEntities.size获得实体数量，但是需要封装get方法。为了减少一次方法的调用所以才直接创建一个count属性
     */
    count = 0;

    /** 获取matchEntities中第一个实体 */
    get entity(): E {
        return this.matchEntities[0];
    }

    private _enteredEntities: Map<number, E> | null = null;
    private _removedEntities: Map<number, E> | null = null;

    constructor(matcher: ecs.IMatcher) {
        this.matcher = matcher;
    }

    onComponentAddOrRemove(entity: E) {
        if (this.matcher.isMatch(entity)) {                         // Group只关心指定组件在实体身上的添加和删除动作。
            this._matchEntities.set(entity.eid, entity);
            this._entitiesCache = null;
            this.count++;

            if (this._enteredEntities) {
                this._enteredEntities.set(entity.eid, entity);
                this._removedEntities!.delete(entity.eid);
            }
        }
        else if (this._matchEntities.has(entity.eid)) {             // 如果Group中有这个实体，但是这个实体已经不满足匹配规则，则从Group中移除该实体
            this._matchEntities.delete(entity.eid);
            this._entitiesCache = null;
            this.count--;

            if (this._enteredEntities) {
                this._enteredEntities.delete(entity.eid);
                this._removedEntities!.set(entity.eid, entity);
            }
        }
    }

    watchEntityEnterAndRemove(enteredEntities: Map<number, E>, removedEntities: Map<number, E>) {
        this._enteredEntities = enteredEntities;
        this._removedEntities = removedEntities;
    }

    clear() {
        this._matchEntities.clear();
        this._entitiesCache = null;
        this.count = 0;
        this._enteredEntities?.clear();
        this._removedEntities?.clear();
    }
}