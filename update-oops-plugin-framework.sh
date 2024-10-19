if [ ! -d "extensions" ]; then
    mkdir extensions
fi
cd extensions

if [ ! -d "oops-plugin-framework" ]; then
    git clone -b master https://gitee.com/dgflash/oops-plugin-framework.git
else
    cd oops-plugin-framework
    git pull
fi

npm install