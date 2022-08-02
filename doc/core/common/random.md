### 功能说明
Oops Framework－随机数生成管理模块，封装了[seedrandom](https://www.npmjs.com/package/seedrandom) 第三方随机数据库

### 使用说明
##### 设置随机种子
```
// 随机种子可由服务端派发给其它客户端，同样的种子，多端随机同样次数时，结果是相同的
RandomManager.instance.setSeed(123456789);
```

##### 生成指定范围的随机整数
```
var min = 1;
var max = 10;
// [min,max) 得到一个两数之间的随机整数,这个值不小于min（如果min不是整数的话，得到一个向上取整的 min），并且小于（但不等于）max  
RandomManager.instance.getRandomInt(min, max, 1);

// [min,max] 得到一个两数之间的随机整数，包括两个数在内,这个值比min大（如果min不是整数，那就不小于比min大的整数），但小于（但不等于）max
RandomManager.instance.getRandomInt(min, max, 2);

// (min,max) 得到一个两数之间的随机整数
RandomManager.instance.getRandomInt(min, max, 3);
```

##### 根据最大值，最小值范围生成随机数数组
```
var min = 1;
var max = 10;
var n = 10;
// 生成10个1~10之间的随机数数组
RandomManager.instance.getRandomByMinMaxList(min, max, n);
```

##### 获取数组中随机对象
```
var objs = [1,2,3,4,5,6,7,8,9]
RandomManager.instance.getRandomByObjectList(objs, 3);
```

##### 定和随机分配
```
// 随机5个整数，5个数的和为100
RandomManager.instance.getRandomBySumList(5,100);
```