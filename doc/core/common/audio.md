
### 功能说明
Oops Framework－音频管理模块主要处理游戏背景音乐、游戏音效两大类功能。

### [演示程序](https://gitee.com/dgflash/oops-framework/tree/master/assets/demo/audio)

### 使用说明
##### 播放背景音乐
```
oops.audio.playMusic("audios/nocturne");
```
注：调用此方法后，后台会异步下载音乐资源，完成后开始播放音乐

##### 背景音乐播放完成回调设置
```
oops.audio.setMusicComplete(() => {
    console.log("音乐播放完成");
});
```
   
##### 获取或设置背景音乐音量
```
oops.audio.musicVolume = 0.5;
```
注：音量范围 (0 ~ 1)

##### 背景音乐开关
```
oops.audio.switchMusic = false;
```

##### 获取或设置音乐播放进度
```
oops.audio.progressMusic = 0.5;
```
注：音量进度 (0 ~ 1)

##### 播放音效
```
oops.audio.playEffect("audios/Gravel");
```
注：调用此方法后，后台会异步下载音乐资源，完成后开始播放音乐
   
##### 获取或设置音效音量
```
oops.audio.volumeEffect = 0.5;
```
注：音量范围 (0 ~ 1)

##### 音效音乐开关
```
oops.audio.switchEffect = false;
```

##### 恢复暂停的所有音乐播放
```
oops.audio.resumeAll();
```

##### 暂停当前音乐与音效的播放
```
oops.audio.pauseAll();
```

##### 停止当前音乐与音效的播放
```
oops.audio.stopAll();
```

##### 停止当前音乐与音效的播放
```
oops.audio.stopAll();
```

##### 保存音乐音效的音量、开关配置数据到本地
```
oops.audio.save();
```

##### 本地加载音乐音效的音量、开关配置数据并设置到游戏中
```
oops.audio.load();
```

