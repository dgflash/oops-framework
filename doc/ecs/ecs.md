# 简介
libs/ecs 这是一个 Typescript 语言版的Entity-Component-System框架架。

# 使用说明
创建实体
```Typescript
ecs.getEntity<ecs.Entity>(ecs.Entity);
```

## 组件
自定义组件必须继承ecs.Comp，并且需要使用ecs.register注册组件。
```TypeScript
@ecs.register('Hello')
export class HelloComponent extends ecs.Comp {
    info: string;
    data: number;

    // 组件被回收前会调用这个方法。
    reset() {
        this.info = '';
        this.data = 0;
    }
}
```

## ecs.register功能
- 能通过```entity.Hello```获得组件对象；
- 将组件的构造函数存入ecs上下文中，并且给该类组件分配一个组件id。

## 实体
为了能利用Typescript的类型提示机制，在使用实体的时候需要用户自己继承ecs.Entity。
```TypeScript
ecs.register('HelloEntity')
export class HelloEntity extends ecs.Entity {
    Hello: HelloComponent; // 这里的Hello要和ecs.register中填入的参数一致
}
```

- 管理子实体
```TypeScript
// 添加子实体
entity.addChild(ecs.Entity);

// 移除子实体
entity.removeChild(ecs.Entity);
```

- 添加组件：
```TypeScript
entity.add(HelloComponent); // 添加组件时会优先从组件缓存池中获取无用的组件对象，如果没有才会新创建一个组件对象
```

- 添加组件对象：注意，外部创建的组件对象ecs系统不负责回收，需要用户自己管理该组件对象的声明周期。
```Typescript
let compObj = new HelloComponent();
entity.add(compObj)
```

- 删除组件：
```TypeScript
entity.remove(HelloComponent); // 组件对象会从实体身上移除并放入组件缓存池中
```

- 删除组件但不删除组件对象：实际开发中，组件身上有很多属性，如果删除了后面再添加，属性值还原是个麻烦的问题，
remove方法可以删除组件，但是不真正从实体身上移除该组件对象，这样下次重新添加组件时还是会添加那个组件对象。
```Typescript
entity.remove(HelloComponent, false)
```

- 获得组件对象
```TypeScript
entity.Hello; // 见上方自定义实体操作

entity.get(HelloComponent);
```

- 判断是否拥有组件：
```TypeScript
entity.has(HelloComponent);

!!entity.Hello;
```

- 销毁实体：
```TypeScript
entity.destroy() // 销毁实体时会先删除实体身上的所有组件，然后将实体放入实体缓存池中
```

## 实体筛选
目前提供了四种类型的筛选能力，但是这四种筛选能力可以组合从而提供更强大的筛选功能。
- anyOf: 用来描述包含任意一个这些组件的实体；
- allOf: 用来描述同时包含了这些组件的实体；
- onlyOf: 用来描述只包含了这些组件的实体；不是特殊情况不建议使用onlyOf，因为onlyOf会监听所有组件的添加和删除事件；
- excludeOf: 表示不包含所有这里面的组件（与关系）；

使用方式：

- 表示同时拥有多个组件
```TypeScript
ecs.allOf(AComponent, BComponent, CComponent);
```
- 表示拥有任意一个组件
```Typescript
ecs.anyOf(AComponent, BComponent);
```
- 表示拥有某些组件，并且不包含某些组件
```Typescript
// 不包含CComponent或者DComponent
ecs.allOf(AComponent, BComponent).excludeOf(CComponent, DComponent);

// 不同时包含CComponent和DComponent
ecs.allOf(AComponent, BComponent).excludeOf(CComponent).excludeOf(DComponent);
```

### 直接查询并获得实体
```Typescript
ecs.query(ecs.allOf(Comp1, Comp2))
```

## 系统
- ecs.System: 用来组合某一功能所包含的System；
- ecs.RootSystem: System的root；
- ecs.ComblockSystem: 抽象类，组合式的System。默认情况，如果该System有实体，则每帧都会执行update方法；
- ecs.IEntityEnterSystem: 实现这个接口表示关注实体的首次进入；
- ecs.IEntityRemoveSystem: 实现这个接口表示关注实体的移除；
- ecs.ISystemFirstUpdate: 实现这个接口会在System第一次执行update前执行一次firstUpdate
- ecs.ISystemUpdate:实现这个接口会在System中每帧出发update方法

# 怎么使用
1、声明组件
```TypeScript
@ecs.register('Node')
export class NodeComponent extends ecs.Comp {
    val: cc.Node = null;

    reset() {
        this.val = null;
    }
}

@ecs.reigster('Move')
export class MoveComponent extends ecs.Comp {
    heading: cc.Vec2 = cc.v2();
    speed: number = 0;

    reset() {
        this.heading.x = 0;
        this.heading.y = 0;
        this.speed = 0;
    }
}

@ecs.register('Transform')
export class TransformComponent extends ecs.Comp {
    position: cc.Vec2 = cc.v2();
    angle: number;
    reset() {
    
    }
}

export class AvatarEntity extends ecs.Entity {
    Node: NodeComponent;
    Move: MoveComponent;
    Transform: TransformComponent;
}
```

2、创建系统
```TypeScript
export class RoomSystem extends ecs.RootSystem {
    constructor() {
        super();
        this.add(new MoveSystem());
        this.add(new RenderSystem());
    }
}

export class MoveSystem extends ecs.ComblockSystem<AvatarEntity> implements ecs.IEntityEnterSystem, ecs.ISystemUpdate {
    init() {
    
    }

    filter(): ecs.IMatcher {
        return ecs.allOf(MoveComponent, TransformComponent);
    }

     // 实体第一次进入MoveSystem会进入此方法
    entityEnter(e: AvatarEntity) {
        e.Move.speed = 100;
    }
    
    // 每帧都会更新
    update(e: AvatarEntity) {
        let moveComp = e.Move;                      // e.get(MoveComponent);
        lel position = e.Transform.position;
        
        position.x += moveComp.heading.x * moveComp.speed * this.dt;
        position.y += moveComp.heading.y * moveComp.speed * this.dt;
        
        e.Transform.angle = cc.misc.lerp(e.Transform.angle, Math.atan2(moveComp.speed.y, moveComp.speed.x) * cc.macro.DEG, dt);
    }
}

export class RenderSystem extends ecs.ComblockSystem<AvatarEntity> implements ecs.IEntityEnterSystem, ecs.IEntityRemoveSystem, ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(NodeComponent, TransformComponent);
    }
    
    // 实体第一次进入MoveSystem会进入此方法
    entityEnter(e: AvatarEntity) {
        e.Node.val.active = true;
    }
    
    entityRemove(e: AvatarEntity) {
       
    }
    
    update(e: AvatarEntity) {
        e.Node.val.setPosition(e.Transform.position);
        e.Node.val.angle = e.Transform.angle;
    }
}
```

3、驱动ecs框架
```TypeScript
const { ccclass, property } = cc._decorator;
@ccclass
export class GameControllerBehaviour extends Component {
    rootSystem: RootSystem = null;

    onLoad() {
        this.rootSystem = new RootSystem();
        this.rootSystem.init();
    }
    
    createAvatar(node: cc.Node) {
        let entity = ecs.createEntityWithComps<AvatarEntity>(NodeComponent, TransformComponent, MoveComponent);
        entity.Node.val = node;
    }

    update(dt: number) {
        this.rootSystem.execute(dt);
    }
}

```

# 和Cocos Creator的组件混合使用
## 创建基类
```Typescript
import { Component, _decorator } from "cc";
import { ecs } from "../../../Libs/ECS";
const { ccclass, property } = _decorator;

@ccclass('CCComp')
export abstract class CCComp extends Component implements ecs.IComp {
    static tid: number = -1;
    static compName: string;

    canRecycle: boolean;
    ent: ecs.Entity;

    onLoad() {
        this.ent = ecs.createEntity();
        this.ent.add(this);    
    }

    abstract reset(): void;
}
```

## 创建ecs组件并且赋予序列化的功能，这样就能在Cocos Creator的“属性检查器”上修改参数
```Typescript
import { _decorator, toDegree, v3, Node, Vec3 } from "cc";
import { ecs } from "../../../Libs/ECS";
const { ccclass, property } = _decorator;

let outV3 = v3();
@ccclass('MovementComponent')
@ecs.register('Movement')
export class MovementComponent extends CCComp {
    pos: Vec3 = v3();
    angle: number = 0;
    speed: number = 0;

    @property
    acceleration: number = 0;

    @property
    private _maxSpeed: number = 0;
    @property
    set maxSpeed(val: number) {
        this._maxSpeed = val;
    }
    get maxSpeed() {
        return this._maxSpeed;
    }

    @property
    heading: Vec3 = v3();
    
    @property
    targetHeading: Vec3 = v3();

    reset() {

    }

    update(dt: number) {
        if(!Vec3.equals(this.heading, this.targetHeading, 0.01)) {
            Vec3.subtract(outV3, this.targetHeading, this.heading);
            outV3.multiplyScalar(0.025);
            this.heading.add(outV3);
            this.heading.normalize();
            this.angle = toDegree(Math.atan2(this.heading.y, this.heading.x)) - 90;
        }
        
        this.speed = Math.min(this.speed + this.acceleration * dt, this._maxSpeed);

        this.pos.add3f(this.heading.x * this.speed * dt, this.heading.y * this.speed * dt, 0);
    }

    calcAngle() {
        this.angle = toDegree(Math.atan2(this.heading.y, this.heading.x)) - 90;
        return this.angle;
    }
}

```

## 创建面向Cocos Creator的组件
```Typescript
import { Component, _decorator } from "cc";
const { ccclass, property } = _decorator;
@ccclass('Player')
@ecs.register('Player', false)
export class Player extends CCComp {
    @property({
        type: MovementComponent
    })
    movement: MovementComponent;

    onLoad() {
        super.onLoad();

        // 添加MovementComponent组件对象
        this.ent.add(this.movement);
    }
}
```

# 调试
添加如下代码
```TypeScript
windows['ecs'] = ecs;