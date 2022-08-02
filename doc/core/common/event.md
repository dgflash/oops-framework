### 功能说明
Oops Framework－全局事件管理主要在设计上降低对象之间的耦合问题，避免相互调用API导致对象强依赖，从而在项目中后期需求变更或扩展时，增加维护成本。

### 使用说明
##### 注册持续监听的全局事件
```
export class RoleViewComp extends Component{
    onLoad(){
        // 监听全局事件
        oops.message.on(GameEvent.GameServerConnected, this.onHandler, this);
    }
    
    protected onDestroy() {
        // 对象释放时取消注册的全局事件
        oops.message.off(GameEvent.GameServerConnected, this.onHandler, this);
    }
    
    private onHandler(event: string, args: any) {
        switch (event) {
            case GameEvent.GameServerConnected:
                console.log("处理游戏服务器连接成功后的逻辑");
                break;
        }
    }
}
```

##### 注册只触发一次的全局事件
```
export class RoleViewComp extends Component{
    onLoad(){
        // 监听一次事件，事件响应后，该监听自动移除
        oops.message.once(GameEvent.GameServerConnected, this.onHandler, this);
    }
    
    private onHandler(event: string, args: any) {
        switch (event) {
            case GameEvent.GameServerConnected:
                console.log("处理游戏服务器连接成功后的逻辑");
                break;
        }
    }
}
```