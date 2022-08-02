### 功能说明
Oops Framework－本地存储模块主要封装了Cocos Crator引擎里sys.localStorage对象的跨平台平地存储功能，同时在此基础上添加了数据加密与不同帐号区分的功能。

### 使用说明
##### 初始化本地存储加密
```
oops.storage.init("key", "vi");
```
注：调试模式下不会触发数据加密，方便明文调试。发布模式自动启动数据加密

##### 初始化本地存储加密
```
var uid = 10000;                // 用户唯一编号数据
oops.storage.setUser(uid);
```
注：用于区分不同账号本地存储数据，避免同名key的数据被其它账号登录时覆盖

##### 设置指定关键字的数据
```
oops.storage.set(key, value);
```

##### 获取指定关键字的数据
```
var data = oops.storage.get(key);
```

##### 删除指定关键字的数据
```
oops.storage.remove(key);
```

##### 清空整个本地存储
```
oops.storage.clear();
```


