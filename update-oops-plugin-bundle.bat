md extensions
cd extensions

IF EXIST oops-plugin-bundle (
goto update
) ELSE (
goto clone
)

:clone
git clone -b master https://gitee.com/dgflash/oops-plugin-bundle.git

:update
cd oops-plugin-bundle
git pull