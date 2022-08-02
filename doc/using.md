### 框架使用说明
Oops Framework从3.5.2版本开始以Cocos Creator插件方式提供使用，这样设计的目的是为了方便作者升级框架功能与修复问题时，方便的去更新框架。

### 自动更新最新分支框架版本
打开Cocos Creator项目目录，执行下列命令

###### windows
```
md extensions
cd extensions
git clone -b master https://gitee.com/dgflash/oops-plugin-framework.git
git pull
```
###### mac
```
mkdir -p extensions
cd extensions
git clone -b master https://gitee.com/dgflash/oops-plugin-framework.git
git pull
```