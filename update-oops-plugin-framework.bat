md extensions
cd extensions

IF EXIST oops-plugin-framework (
goto update
) ELSE (
goto clone
)

:clone
git clone -b master https://gitee.com/dgflash/oops-plugin-framework.git

:update
cd oops-plugin-framework
git pull