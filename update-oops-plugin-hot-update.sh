if [ ! -d "extensions" ]; then
    mkdir extensions
fi
cd extensions

if [ ! -d "oops-plugin-hot-update" ]; then
    git clone -b master https://gitee.com/dgflash/oops-plugin-hot-update.git
else
    cd oops-plugin-hot-update
    git pull
fi
