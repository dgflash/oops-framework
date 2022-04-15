// 重构原则：如无必要，勿增实体。
export module ecs {
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

    export interface EntityCtor<T> {
        new(): T;
    }

    /**
     * 组件里面只放数据可能在实际写代码的时候比较麻烦。如果是单纯对组件内的数据操作可以在组件里面写方法。
     */
    export abstract class Comp implements IComp {
        /**
         * 组件的类型id，-1表示未给该组件分配id
         */
        static tid: number = -1;
        static compName: string;
        /**
         * 拥有该组件的实体
         */
        ent!: Entity;

        /**
         * 是否可回收组件对象，默认情况下都是可回收的。
         * 如果该组件对象是由ecs系统外部创建的，则不可回收，需要用户自己手动进行回收。
         */
        canRecycle: boolean = true;

        /**
         * 组件被回收时会调用这个接口。可以在这里重置数据，或者解除引用。
         * 
         * **不要偷懒，除非你能确定并保证组件在复用时，里面的数据是先赋值然后再使用。**
         */
        abstract reset(): void;
    }

    //#region 类型声明

    type CompAddOrRemove = (entity: Entity) => void;

    export type CompType<T> = CompCtor<T> | number;
    //#endregion

    //#region 注册组件

    /**
     * 组件缓存池
     */
    let compPools: Map<number, IComp[]> = new Map();

    /**
     * 组件类型id
     */
    let compTid = 0;

    /**
     * 组件构造函数
     */
    let compCtors: (CompCtor<any> | number)[] = [];

    /**
     * 每个组件的添加和删除的动作都要派送到“关心”它们的group上。goup对当前拥有或者之前（删除前）拥有该组件的实体进行组件规则判断。判断该实体是否满足group
     * 所期望的组件组合。
     */
    let compAddOrRemove: Map<number, CompAddOrRemove[]> = new Map();

    let tags: Map<number, string> = new Map();

    /**
     * 注册组件到ecs系统中
     * @param compName 由于js打包会改变类名，所以这里必须手动传入组件的名称。
     * @param canNew 标识是否可以new对象。想继承自Cocos Creator的组件就不能去new，需要写成@ecs.register('name', false)
     */
    export function register<T>(compName: string, canNew: boolean = true) {
        return function (ctor: CompCtor<T>) {
            if (ctor.tid === -1) {
                ctor.tid = compTid++;
                ctor.compName = compName;
                if (canNew) {
                    compCtors.push(ctor);
                    compPools.set(ctor.tid, []);
                }
                else {
                    compCtors.push(null!);
                }
                compAddOrRemove.set(ctor.tid, []);
            }
            else {
                throw new Error(`重复注册组件： ${compName}.`);
            }
        }
    }

    /**
     * 添加tag
     * 
     * eg.
     *      @registerTag()
     *      class Tag {
     *          static A: number;
     *          static B: number
     *      }
     * @returns 
     */
    export function registerTag() {
        return function (_class: any) {
            let tid = compTid;
            for (let k in _class) {
                tid = compTid++;
                _class[k] = tid;
                compCtors.push(tid);
                compPools.set(tid, []);
                compAddOrRemove.set(tid, []);
                tags.set(tid, k);
            }
        }
    }
    //#endregion

    //#region context

    /**
     * 实体对象缓存池
     */
    let entityPool: Map<string, Entity[]> = new Map();

    /**
     * 通过实体id查找实体对象
     */
    let eid2Entity: Map<number, Entity> = new Map();

    /**
     * 缓存的group
     * 
     * key是组件的筛选规则，一个筛选规则对应一个group
     */
    let groups: Map<number, Group> = new Map();

    /**
     * 实体自增id
     */
    let eid = 1;

    /** 扩展：获取带 eid 自增量的实体（继承Entity方式的编码风格，可减少一定代码量） */
    export function getEntity<T extends Entity>(ctor: EntityCtor<T>): T {
        var entitys = entityPool.get(ctor.name) || [];
        let entity: any = entitys.pop();
        if (!entity) {
            entity = new ctor();
            entity.eid = eid++; // 实体id也是有限的资源
        }

        if (entity.init)
            entity.init();
        else
            console.error(`${ctor.name} 实体缺少 init 方法初始化默认组件`);

        eid2Entity.set(entity.eid, entity);
        return entity as T;
    }

    /**
     * 创建实体
     */
    function createEntity<E extends Entity = Entity>(): E {
        let entity = new Entity();
        entity.eid = eid++;                     // 实体id也是有限的资源
        eid2Entity.set(entity.eid, entity);
        return entity as E;
    }

    /**
     * 创建组件对象
     * @param ctor
     */
    function createComp<T extends IComp>(ctor: CompCtor<T>): T {
        var cct = compCtors[ctor.tid];
        if (!cct) {
            throw Error(`没有找到该组件的构造函数，检查${ctor.compName}是否为不可构造的组件`);
        }
        let comps = compPools.get(ctor.tid)!;
        let component = comps.pop() || new (cct as CompCtor<T>);
        return component as T;
    }

    /**
     * 指定一个组件创建实体，返回组件对象。
     * @param ctor 
     */
    function createEntityWithComp<T extends IComp>(ctor: CompCtor<T>): T {
        let entity = createEntity();
        return entity.add(ctor);
    }

    // /**
    //  * 指定多个组件创建实体，返回实体对象。
    //  * @param ctors 
    //  */
    // function createEntityWithComps<E extends Entity = Entity>(...ctors: CompType<IComp>[]): E {
    //     let entity = createEntity();
    //     entity.addComponents(...ctors);
    //     return entity as E;
    // }

    /**
     * 销毁实体。
     * 
     * 缓存销毁的实体，下次新建实体时会优先从缓存中拿。
     * @param entity 
     */
    function destroyEntity(entity: Entity) {
        if (eid2Entity.has(entity.eid)) {
            var entitys = entityPool.get(entity.constructor.name);
            if (entitys == null) {
                entitys = [];
                entityPool.set(entity.constructor.name, entitys);
            }
            entitys.push(entity);
            eid2Entity.delete(entity.eid);
        }
        else {
            console.warn('试图销毁不存在的实体！');
        }
    }

    /**
     * 创建group，每个group只关心对应组件的添加和删除
     * @param matcher 实体筛选器
     */
    export function createGroup<E extends Entity = Entity>(matcher: IMatcher): Group<E> {
        let group = groups.get(matcher.mid);
        if (!group) {
            group = new Group(matcher);
            groups.set(matcher.mid, group);
            let careComponentTypeIds = matcher.indices;
            for (let i = 0; i < careComponentTypeIds.length; i++) {
                compAddOrRemove.get(careComponentTypeIds[i])!.push(group.onComponentAddOrRemove.bind(group));
            }
        }
        return group as unknown as Group<E>;
    }

    /**
     * 动态查询实体
     * @param matcher 
     * @returns 
     */
    export function query<E extends Entity = Entity>(matcher: IMatcher): E[] {
        let group = groups.get(matcher.mid);
        if (!group) {
            group = createGroup(matcher);
            eid2Entity.forEach(group.onComponentAddOrRemove, group);
        }
        return group.matchEntities as E[];
    }

    /**
     * 清理所有的实体
     */
    export function clear() {
        eid2Entity.forEach((entity) => {
            entity.destroy();
        });
        groups.forEach((group) => {
            group.clear();
        });
        compAddOrRemove.forEach(callbackLst => {
            callbackLst.length = 0;
        });
        eid2Entity.clear();
        groups.clear();
    }

    /**
     * 实体身上组件有增删操作，广播通知对应的观察者。
     * @param entity 实体对象
     * @param componentTypeId 组件类型id
     */
    function broadcastCompAddOrRemove(entity: Entity, componentTypeId: number) {
        let events = compAddOrRemove.get(componentTypeId);
        for (let i = events!.length - 1; i >= 0; i--) {
            events![i](entity);
        }
        // 判断是不是删了单例组件
        if (tid2comp.has(componentTypeId)) {
            tid2comp.delete(componentTypeId);
        }
    }

    /**
     * 根据实体id获得实体对象
     * @param eid 
     */
    export function getEntityByEid<E extends Entity = Entity>(eid: number): E {
        return eid2Entity.get(eid) as E;
    }

    /**
     * 当前活动中的实体数量
     */
    export function activeEntityCount() {
        return eid2Entity.size;
    }
    //#endregion


    /**
     * 表示只关心这些组件的添加和删除动作。虽然实体可能有这些组件之外的组件，但是它们的添加和删除没有被关注，所以不会存在对关注之外的组件
     * 进行添加操作引发Group重复添加实体。
     * @param args 
     */
    export function allOf(...args: CompType<IComp>[]) {
        return new Matcher().allOf(...args);
    }

    /**
     * 组件间是或的关系，表示关注拥有任意一个这些组件的实体。
     * @param args 组件索引
     */
    export function anyOf(...args: CompType<IComp>[]) {
        return new Matcher().anyOf(...args);
    }

    /**
     * 表示关注只拥有这些组件的实体
     * 
     * 注意：
     *  不是特殊情况不建议使用onlyOf。因为onlyOf会监听所有组件的添加和删除事件。
     * @param args 组件索引
     */
    export function onlyOf(...args: CompType<IComp>[]) {
        return new Matcher().onlyOf(...args);
    }

    /**
     * 不包含指定的任意一个组件
     * 
     * eg.
     *  ecs.excludeOf(A, B);表示不包含组件A或者组件B
     * @param args 
     */
    export function excludeOf(...args: CompType<IComp>[]) {
        return new Matcher().excludeOf(...args);
    }

    //#region 单例组件
    let tid2comp: Map<number, IComp> = new Map();
    /**
     * 获取单例组件
     * @param ctor 组件类
     */
    export function getSingleton<T extends IComp>(ctor: CompCtor<T>) {
        if (!tid2comp.has(ctor.tid)) {
            let comp = createEntityWithComp(ctor) as T;
            tid2comp.set(ctor.tid, comp);
        }
        return tid2comp.get(ctor.tid) as T;
    }

    /**
     * 注册单例。主要用于那些不能手动创建对象的组件
     * @param obj 
     */
    export function addSingleton(obj: IComp) {
        let tid = (obj.constructor as CompCtor<IComp>).tid;
        if (!tid2comp.has(tid)) {
            tid2comp.set(tid, obj);
        }
    }
    //#endregion

    class Mask {
        private mask: Uint32Array;
        private size: number = 0;

        constructor() {
            let length = Math.ceil(compTid / 31);
            this.mask = new Uint32Array(length);
            this.size = length;
        }

        set(num: number) {
            // https://stackoverflow.com/questions/34896909/is-it-correct-to-set-bit-31-in-javascript
            // this.mask[((num / 32) >>> 0)] |= ((1 << (num % 32)) >>> 0);
            this.mask[((num / 31) >>> 0)] |= (1 << (num % 31));
        }

        delete(num: number) {
            this.mask[((num / 31) >>> 0)] &= ~(1 << (num % 31));
        }

        has(num: number) {
            return !!(this.mask[((num / 31) >>> 0)] & (1 << (num % 31)));
        }

        or(other: Mask) {
            for (let i = 0; i < this.size; i++) {
                // &操作符最大也只能对2^30进行操作，如果对2^31&2^31会得到负数。当然可以(2^31&2^31) >>> 0，这样多了一步右移操作。
                if (this.mask[i] & other.mask[i]) {
                    return true;
                }
            }
            return false;
        }

        and(other: Mask) {
            for (let i = 0; i < this.size; i++) {
                if ((this.mask[i] & other.mask[i]) != this.mask[i]) {
                    return false;
                }
            }
            return true;
        }

        clear() {
            for (let i = 0; i < this.size; i++) {
                this.mask[i] = 0;
            }
        }
    }

    export class Entity {
        /**
         * 实体唯一标识，不要手动修改。
         */
        public eid: number = -1;

        private mask = new Mask();

        /**
         * 当前实体身上附加的组件构造函数
         */
        private compTid2Ctor: Map<number, CompType<IComp>> = new Map();
        /**
         * 配合 entity.remove(Comp, false)， 记录组件实例上的缓存数据，在添加时恢复原数据
         */
        private compTid2Obj: Map<number, IComp> = new Map();

        constructor() { }

        /**
         * 根据组件id动态创建组件，并通知关心的系统。
         * 
         * 如果实体存在了这个组件，那么会先删除之前的组件然后添加新的。
         * 
         * 注意：不要直接new Component，new来的Component不会从Component的缓存池拿缓存的数据。
         * @param componentTypeId 组件id
         * @param isReAdd true-表示用户指定这个实体可能已经存在了该组件，那么再次add组件的时候会先移除该组件然后再添加一遍。false-表示不重复添加组件。
         */
        add<T extends IComp>(obj: T): Entity;
        add(ctor: number, isReAdd?: boolean): Entity;
        add<T extends IComp>(ctor: CompCtor<T>, isReAdd?: boolean): T;
        add<T extends IComp>(ctor: CompType<T>, isReAdd?: boolean): T;
        add<T extends IComp>(ctor: CompType<T> | T, isReAdd: boolean = false): T | Entity {
            // console.log('typeof: ', typeof ctor);
            if (typeof ctor === 'function') {
                let compTid = ctor.tid;
                if (ctor.tid === -1) {
                    throw Error('组件未注册！');
                }
                if (this.compTid2Ctor.has(compTid)) {// 判断是否有该组件，如果有则先移除
                    if (isReAdd) {
                        this.remove(ctor);
                    }
                    else {
                        console.log(`已经存在组件：${ctor.compName}`);
                        // @ts-ignore
                        return this[ctor.compName] as T;
                    }
                }
                this.mask.set(compTid);

                let comp: T;
                if (this.compTid2Obj.has(compTid)) {
                    comp = this.compTid2Obj.get(compTid) as T;
                    this.compTid2Obj.delete(compTid);
                }
                else {
                    // 创建组件对象
                    comp = createComp(ctor) as T;
                }
                // 将组件对象直接附加到实体对象身上，方便直接获取。
                // @ts-ignore
                this[ctor.compName] = comp;
                this.compTid2Ctor.set(compTid, ctor);
                comp.ent = this;
                // 广播实体添加组件的消息
                broadcastCompAddOrRemove(this, compTid);

                return comp;
            }
            else if (typeof ctor === 'number') {
                if (tags.has(ctor)) {
                    this.mask.set(ctor);
                    this.compTid2Ctor.set(ctor, ctor);
                    let tagName = tags.get(ctor)!;
                    // @ts-ignore
                    this[tagName] = ctor;
                    broadcastCompAddOrRemove(this, ctor);
                }
                else {
                    throw Error('不存在的tag！');
                }
                return this;
            }
            else {
                let tmpCtor = (ctor.constructor as CompCtor<T>);
                let compTid = tmpCtor.tid;
                // console.assert(compTid !== -1 || !compTid, '组件未注册！');
                // console.assert(this.compTid2Ctor.has(compTid), '已存在该组件！');
                if (compTid === -1 || compTid == null) {
                    throw Error('组件未注册！');
                }
                if (this.compTid2Ctor.has(compTid)) {
                    throw Error('已经存在该组件！');
                }

                this.mask.set(compTid);
                //@ts-ignore
                this[tmpCtor.compName] = ctor;
                this.compTid2Ctor.set(compTid, tmpCtor);
                ctor.ent = this;
                ctor.canRecycle = false;
                broadcastCompAddOrRemove(this, compTid);
                return this;
            }
        }

        addComponents<T extends IComp>(...ctors: CompType<T>[]) {
            for (let ctor of ctors) {
                this.add(ctor);
            }
            return this;
        }

        get(ctor: number): number;
        get<T extends IComp>(ctor: CompCtor<T>): T;
        get<T extends IComp>(ctor: CompCtor<T> | number): T {
            let compName: string;
            if (typeof (ctor) === 'number') {
                compName = tags.get(ctor)!;
            }
            else {
                compName = ctor.compName;
            }
            // @ts-ignore
            return this[compName];
        }

        has(ctor: CompType<IComp>): boolean {
            if (typeof ctor == "number") {
                return this.mask.has(ctor);
            }
            else {
                return this.compTid2Ctor.has(ctor.tid);
            }
        }

        /**
         * 
         * @param ctor 组件构造函数或者组件Tag
         * @param isRecycle 是否回收该组件对象。对于有些组件上有大量数据，当要描述移除组件但是不想清除组件上的数据是可以
         * 设置该参数为false，这样该组件对象会缓存在实体身上，下次重新添加组件时会将该组件对象添加回来，不会重新从组件缓存
         * 池中拿一个组件来用。
         */
        remove(ctor: CompType<IComp>, isRecycle: boolean = true) {
            let componentTypeId = -1;
            let compName = '';
            let hasComp = false;
            if (typeof ctor === "number") {
                componentTypeId = ctor;
                if (this.mask.has(ctor)) {
                    hasComp = true;
                    compName = tags.get(ctor)!;
                }
            }
            else {
                componentTypeId = ctor.tid;
                compName = ctor.compName;
                if (this.mask.has(componentTypeId)) {
                    hasComp = true;
                    //@ts-ignore
                    let comp = this[ctor.compName] as IComp;
                    //@ts-ignore
                    comp.ent = null;
                    if (isRecycle) {
                        comp.reset();
                        if (comp.canRecycle) {
                            compPools.get(componentTypeId)!.push(comp);
                        }
                    }
                    else {
                        this.compTid2Obj.set(componentTypeId, comp);
                    }
                }
            }

            if (hasComp) {
                //@ts-ignore
                this[compName] = null;
                this.mask.delete(componentTypeId);
                this.compTid2Ctor.delete(componentTypeId);
                broadcastCompAddOrRemove(this, componentTypeId);
            }
        }

        private _remove(comp: CompType<IComp>) {
            this.remove(comp, false);
        }

        /**
         * 销毁实体，实体会被回收到实体缓存池中。
         */
        destroy() {
            this.compTid2Ctor.forEach(this._remove, this);
            destroyEntity(this);
            this.compTid2Obj.clear();
        }
    }

    export class Group<E extends Entity = Entity> {
        /**
         * 实体筛选规则
         */
        private matcher: IMatcher;

        private _matchEntities: Map<number, E> = new Map();

        private _entitiesCache: E[] | null = null;

        /**
         * 符合规则的实体
         */
        public get matchEntities() {
            if (this._entitiesCache === null) {
                this._entitiesCache = Array.from(this._matchEntities.values());
            }
            return this._entitiesCache;
        }

        /**
         * 当前group中实体的数量。
         * 
         * 不要手动修改这个属性值。
         */
        public count = 0; // 其实可以通过this._matchEntities.size获得实体数量，但是需要封装get方法。为了减少一次方法的调用所以才直接创建一个count属性

        /**
         * 获取matchEntities中第一个实体
         */
        get entity(): E {
            return this.matchEntities[0];
        }

        private _enteredEntities: Map<number, E> | null = null;
        private _removedEntities: Map<number, E> | null = null;

        constructor(matcher: IMatcher) {
            this.matcher = matcher;
        }

        public onComponentAddOrRemove(entity: E) {
            if (this.matcher.isMatch(entity)) { // Group只关心指定组件在实体身上的添加和删除动作。
                this._matchEntities.set(entity.eid, entity);
                this._entitiesCache = null;
                this.count++;

                if (this._enteredEntities) {
                    this._enteredEntities.set(entity.eid, entity);
                    this._removedEntities!.delete(entity.eid);
                }
            }
            else if (this._matchEntities.has(entity.eid)) { // 如果Group中有这个实体，但是这个实体已经不满足匹配规则，则从Group中移除该实体
                this._matchEntities.delete(entity.eid);
                this._entitiesCache = null;
                this.count--;

                if (this._enteredEntities) {
                    this._enteredEntities.delete(entity.eid);
                    this._removedEntities!.set(entity.eid, entity);
                }
            }
        }

        public watchEntityEnterAndRemove(enteredEntities: Map<number, E>, removedEntities: Map<number, E>) {
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

    //#region Matcher

    abstract class BaseOf {
        protected mask = new Mask();
        public indices: number[] = [];
        constructor(...args: CompType<IComp>[]) {
            let componentTypeId = -1;
            let len = args.length;
            for (let i = 0; i < len; i++) {
                if (typeof (args[i]) === "number") {
                    componentTypeId = args[i] as number;
                }
                else {
                    componentTypeId = (args[i] as CompCtor<IComp>).tid;
                }
                if (componentTypeId == -1) {
                    throw Error('存在没有注册的组件！');
                }
                this.mask.set(componentTypeId);

                if (this.indices.indexOf(componentTypeId) < 0) { // 去重
                    this.indices.push(componentTypeId);
                }
            }
            if (len > 1) {
                this.indices.sort((a, b) => { return a - b; }); // 对组件类型id进行排序，这样关注相同组件的系统就能共用同一个group
            }
        }

        public toString(): string {
            return this.indices.join('-'); // 生成group的key
        }

        public abstract getKey(): string;

        public abstract isMatch(entity: Entity): boolean;
    }

    /**
     * 用于描述包含任意一个这些组件的实体
     */
    class AnyOf extends BaseOf {
        public isMatch(entity: Entity): boolean {
            // @ts-ignore
            return this.mask.or(entity.mask);
        }

        getKey(): string {
            return 'anyOf:' + this.toString();
        }
    }

    /**
     * 用于描述包含了“这些”组件的实体，这个实体除了包含这些组件还可以包含其他组件
     */
    class AllOf extends BaseOf {
        public isMatch(entity: Entity): boolean {
            // @ts-ignore
            return this.mask.and(entity.mask);
        }

        getKey(): string {
            return 'allOf:' + this.toString();
        }
    }

    /**
     * 不包含指定的任意一个组件
     */
    class ExcludeOf extends BaseOf {
        public getKey(): string {
            return 'excludeOf:' + this.toString();
        }

        public isMatch(entity: Entity): boolean {
            // @ts-ignore
            return !this.mask.or(entity.mask);
        }
    }

    export interface IMatcher {
        mid: number;
        indices: number[];
        key: string;
        isMatch(entity: Entity): boolean;
    }

    let macherId: number = 1;

    /**
     * 筛选规则间是“与”的关系
     * 比如：ecs.Macher.allOf(...).excludeOf(...)表达的是allOf && excludeOf，即实体有“这些组件” 并且 “没有这些组件”
     */
    class Matcher implements IMatcher {
        protected rules: BaseOf[] = [];
        protected _indices: number[] | null = null;
        public isMatch!: (entity: Entity) => boolean;
        public mid: number = -1;

        private _key: string | null = null;
        public get key(): string {
            if (!this._key) {
                let s = '';
                for (let i = 0; i < this.rules.length; i++) {
                    s += this.rules[i].getKey()
                    if (i < this.rules.length - 1) {
                        s += ' && '
                    }
                }
                this._key = s;
            }
            return this._key;
        }

        constructor() {
            this.mid = macherId++;
        }

        /**
         * 匹配器关注的组件索引。在创建Group时，Context根据组件id去给Group关联组件的添加和移除事件。
         */
        public get indices() {
            if (this._indices === null) {
                this._indices = [];
                this.rules.forEach((rule) => {
                    Array.prototype.push.apply(this._indices, rule.indices);
                });
            }
            return this._indices;
        }

        /**
         * 组件间是或的关系，表示关注拥有任意一个这些组件的实体。
         * @param args 组件索引
         */
        public anyOf(...args: CompType<IComp>[]): Matcher {
            this.rules.push(new AnyOf(...args));
            this.bindMatchMethod();
            return this;
        }

        /**
         * 组件间是与的关系，表示关注拥有所有这些组件的实体。
         * @param args 组件索引
         */
        public allOf(...args: CompType<IComp>[]): Matcher {
            this.rules.push(new AllOf(...args));
            this.bindMatchMethod();
            return this;
        }

        /**
         * 表示关注只拥有这些组件的实体
         * 
         * 注意：
         *  不是特殊情况不建议使用onlyOf。因为onlyOf会监听所有组件的添加和删除事件。
         * @param args 组件索引
         */
        public onlyOf(...args: CompType<IComp>[]): Matcher {
            this.rules.push(new AllOf(...args));
            let otherTids: CompType<IComp>[] = [];
            for (let ctor of compCtors) {
                if (args.indexOf(ctor) < 0) {
                    otherTids.push(ctor);
                }
            }
            this.rules.push(new ExcludeOf(...otherTids));
            this.bindMatchMethod();
            return this;
        }

        /**
         * 不包含指定的任意一个组件
         * @param args 
         */
        public excludeOf(...args: CompType<IComp>[]) {
            this.rules.push(new ExcludeOf(...args));
            this.bindMatchMethod();
            return this;
        }

        private bindMatchMethod() {
            if (this.rules.length === 1) {
                this.isMatch = this.isMatch1;
            }
            else if (this.rules.length === 2) {
                this.isMatch = this.isMatch2;
            }
            else {
                this.isMatch = this.isMatchMore;
            }
        }

        private isMatch1(entity: Entity): boolean {
            return this.rules[0].isMatch(entity);
        }

        private isMatch2(entity: Entity): boolean {
            return this.rules[0].isMatch(entity) && this.rules[1].isMatch(entity);
        }

        private isMatchMore(entity: Entity): boolean {
            for (let rule of this.rules) {
                if (!rule.isMatch(entity)) {
                    return false;
                }
            }
            return true;
        }

        public clone(): Matcher {
            let newMatcher = new Matcher();
            newMatcher.mid = macherId++;
            this.rules.forEach(rule => newMatcher.rules.push(rule));
            return newMatcher;
        }
    }
    //#endregion

    //#region System
    /**
     * 如果需要监听实体首次进入System的情况，实现这个接口。
     * 
     * entityEnter会在update方法之前执行，实体进入后，不会再次进入entityEnter方法中。
     * 当实体从当前System移除，下次再次符合条件进入System也会执行上述流程。
     */
    export interface IEntityEnterSystem<E extends Entity = Entity> {
        entityEnter(entity: E): void;
    }

    /**
     * 如果需要监听实体从当前System移除，需要实现这个接口。
     */
    export interface IEntityRemoveSystem<E extends Entity = Entity> {
        entityRemove(entity: E): void;
    }

    /**
     * 第一次执行update
     */
    export interface ISystemFirstUpdate<E extends Entity = Entity> {
        firstUpdate(entity: E): void;
    }

    /**
     * 执行update
     */
    export interface ISystemUpdate<E extends Entity = Entity> {
        update(entity: E): void;
    }

    export abstract class ComblockSystem<E extends Entity = Entity> {
        protected group: Group<E>;
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
                    (this as unknown as IEntityEnterSystem).entityEnter(entity);
                }
                this.enteredEntities.clear();
            }

            // 只执行firstUpdate
            for (let entity of this.group.matchEntities) {
                (this as unknown as ISystemFirstUpdate).firstUpdate(entity);
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
                    (this as unknown as ISystemUpdate).update(entity);
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
                        (this as unknown as IEntityRemoveSystem).entityRemove(entity);
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
                        (this as unknown as IEntityEnterSystem).entityEnter(entity);
                    }
                }
                this.enteredEntities!.clear();
            }

            // 执行update
            if (this.hasUpdate) {
                for (let entity of this.group.matchEntities) {
                    (this as unknown as ISystemUpdate).update(entity);
                }
            }
        }

        /**
         * 实体过滤规则
         * 
         * 根据提供的组件过滤实体。
         */
        abstract filter(): IMatcher;
    }

    /**
     * System的root，对游戏中的System遍历从这里开始。
     * 
     * 一个System组合中只能有一个RootSystem，可以有多个并行的RootSystem。
     */
    export class RootSystem {
        private executeSystemFlows: ComblockSystem[] = [];
        private systemCnt: number = 0;

        add(system: System | ComblockSystem) {
            if (system instanceof System) {
                // 将嵌套的System都“摊平”，放在根System中进行遍历，减少execute的频繁进入退出。
                Array.prototype.push.apply(this.executeSystemFlows, system.comblockSystems);
            }
            else {
                this.executeSystemFlows.push(system as ComblockSystem);
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
    export class System {
        private _comblockSystems: ComblockSystem[] = [];
        get comblockSystems() {
            return this._comblockSystems;
        }

        add(system: System | ComblockSystem) {
            if (system instanceof System) {
                Array.prototype.push.apply(this._comblockSystems, system._comblockSystems);
                system._comblockSystems.length = 0;
            }
            else {
                this._comblockSystems.push(system as ComblockSystem);
            }
            return this;
        }
    }
    //#endregion
}