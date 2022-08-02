### 功能说明
Oops Framework－日志管理主要封装console对象日志输出功能，方便在复杂的业务逻辑中，提供更很清晰的信息排查问题。

### 使用说明
##### 打印代码段的执行时间
```
oops.log.start();
...
省略N行代码
...
oops.log.end();
```

##### 打印表格
```
var object:any = {uid:1000, name:"oops"};
oops.log.table(object);
```

##### 打印日志
```
oops.log.trace("默认标准日志");
oops.log.logConfig("灰色配置日志");
oops.log.logNet("橙色网络日志");
oops.log.logModel("紫色数据日志");
oops.log.logBusiness("蓝色业务日志");
oops.log.logView("绿色视图日志");

// 日志格式：[11:31:07:293][标准日志][Generator.ts->next]:'默认标准日志'
```