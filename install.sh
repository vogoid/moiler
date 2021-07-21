#!/bin/bash

unameOut="$(uname -s)"
case "${unameOut}" in
    Linux*)     OS=lin;;
    Darwin*)    OS=mac;;
    *)          OS="UNKNOWN"
esac

MODDABLE="$(pwd)/deps/moddable"
IDF_PATH=$(pwd)/deps/esp-idf

echo $MODDABLE

cd ${MODDABLE}/build/makefiles/${OS}
make

cd $IDF_PATH
./install.sh
