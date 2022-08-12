md extensions
cd extensions

IF EXIST oops-plugin-excel-to-json (
goto update
) ELSE (
goto clone
)

:clone
git clone -b master https://gitee.com/dgflash/oops-plugin-excel-to-json.git

:update
cd oops-plugin-excel-to-json
git pull