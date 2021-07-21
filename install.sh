#!/bin/bash

unameOut="$(uname -s)"
case "${unameOut}" in
    Linux*)     OS=lin;;
    Darwin*)    OS=mac;;
    *)          OS="UNKNOWN"
esac

mkdir deps/
cd deps/

git clone -b v4.3 --recursive https://github.com/espressif/esp-idf.git
git clone -b esp-idf-v4.3 https://github.com/Moddable-OpenSource/moddable.git

MODDABLE="$(pwd)/moddable"
IDF_PATH=$(pwd)/esp-idf

cd ${MODDABLE}/build/makefiles/${OS}
make

cd $IDF_PATH
./install.sh
