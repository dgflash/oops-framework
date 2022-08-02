### 功能说明
Oops Framework－时间管理模块主要实现在游戏中不同类型的定时器功能。

### 使用说明
##### 获取游戏开始到现在逝去的时间
```
oops.timer.getTime();
```

##### 获取本地时间刻度
```
oops.timer.getLocalTime();
```

##### 注册一个固定间隔时间的触发器
```
oops.timer.schedule(()=>{
    // 每秒触发一次
}, 1000);
```

##### 注册一个只触发一次的延时的触发器
```
oops.timer.scheduleOnce(()=>{
    // 1秒后触发一次后不会在触发
}, 1000);
```

##### 删除一个时间触发器
```
var uuid = oops.timer.schedule(()=>{
    // 每秒触发一次
}, 1000);

// 删除指定标识的触发器
oops.timer.unschedule(uuid);
```

##### 删除所有时间触发器
```
oops.timer.unscheduleAll();
```

##### 在指定对象上注册一个倒计时的回调管理器
```
export class Test extends Component {
    private timeId!: string;
    
    start() {
        // 在指定对象上注册一个倒计时的回调管理器
        this.timeId = oops.timer.register(this, "countDown", this.onSecond, this.onComplete);
    }
    
    private onSecond() {
        console.log("每秒触发一次");
    }

    private onComplete() {
        console.log("倒计时完成触发");
    }
}
```

##### 在指定对象上注销一个倒计时的回调管理器
```
export class Test extends Component {
    private timeId!: string;
    
    start() {
        this.timeId = oops.timer.register(this, "countDown", this.onSecond, this.onComplete);
    }
    
    onDestroy() {
        // 在指定对象上注销一个倒计时的回调管理器
        oops.timer.unRegister(this.timeId);
    }
}
```

##### 定时跳动组件
```
export class Test extends Component {
    // 创建一个定时跳动组件
    private timer: Timer = new Timer(1);

    update(dt: number) {
        if (this.timer.update(this.dt)) {
            console.log(每一秒触发一次);
        }
    }
}
```