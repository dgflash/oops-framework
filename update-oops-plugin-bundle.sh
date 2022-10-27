if [ ! -d "extensions" ]; then
    mkdir extensions
fi
cd extensions

if [ ! -d "oops-plugin-bundle" ]; then
    git clone -b master https://gitee.com/dgflash/oops-plugin-bundle.git
else
    cd oops-plugin-bundle
    git pull
fi
