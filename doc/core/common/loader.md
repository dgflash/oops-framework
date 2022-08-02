### 功能说明
Oops Framework－资源管理模块主要处理游戏各种类型的资源的加载与释放功能。

### 使用说明
##### 加载远程资源
```
var opt: IRemoteOptions = { ext: ".png" };
var onComplete = (err: Error | null, data: ImageAsset) => {
    const texture = new Texture2D();
    texture.image = data;
    
    const spriteFrame = new SpriteFrame();
    spriteFrame.texture = texture;
    
    var sprite = this.sprite.addComponent(Sprite);
    sprite.spriteFrame = spriteFrame;
}
resLoader.loadRemote<ImageAsset>(this.url, opt, onComplete);
```

##### 加载资源包配置信息
```
var serverUrl = "http://192.168.1.13:8082/";        // 服务器地址
var md5 = "8e5c0";                                  // Cocos Creator 构建后的MD5字符
await resLoader.loadBundle(serverUrl,md5);
```

##### 加载单个资源
```
var path = "model";
resLoader.load(path, sp.SkeletonData, (err: Error | null, sd: sp.SkeletonData) => {
    if (err) {
        console.error(`资源不存在`);
        return;
    }

    this.spine.skeletonData = sd;
});
```

加载其它bundle中资源
```
var path = "model";
resLoader.load("bundleName", path, sp.SkeletonData, (err: Error | null, sd: sp.SkeletonData) => {
    if (err) {
        console.error(`资源不存在`);
        return;
    }

    this.spine.skeletonData = sd;
});
```

##### 加载一个文件夹中的资源
```
/** 加载进度事件 */
var onProgressCallback = (finished: number, total: number, item: any) => {
    console.log("资源加载进度", finished, total);
}

/** 加载完成事件 */
var onCompleteCallback = () => {
    console.log("资源加载完成");
}
resLoader.loadDir("game", onProgressCallback, onCompleteCallback);
```

##### 释放一个资源
```
resLoader.release("model", "resources");
```
注：第二个参数"resources"为默认值，为引擎默认bundle。如果需要释放其它bundle里的资源修改此参数即可

##### 释放一个文件夹的资源
```
resLoader.releaseDir("model", "resources");
```
注：第二个参数"resources"为默认值，为引擎默认bundle。如果需要释放其它bundle里的资源修改此参数即可

##### 获取缓存中资源
```
resLoader.get("common/anim/button_scale_start", AnimationClip, "resources")
```
注：第三个参数"resources"为默认值，为引擎默认bundle。如果需要获取其它bundle里的资源修改此参数即可


##### 打印缓存中所有资源信息
```
resLoader.dump();   
```
注：用于调试时观察是资源是否正确释放