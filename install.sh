#!/bin/bash

# Sets OS env var with OS family
unameOut="$(uname -s)"
case "${unameOut}" in
    Linux*)     OS=lin;;
    Darwin*)    OS=mac;;
    *)          OS="UNKNOWN"
esac

# Create deps folder
rm -rf deps/
mkdir deps/
cd deps/

# clone deps
git clone -b v4.3 --recursive https://github.com/espressif/esp-idf.git
git clone -b esp-idf-v4.3 https://github.com/Moddable-OpenSource/moddable.git

MODDABLE="$(pwd)/moddable"
IDF_PATH=$(pwd)/esp-idf

# install moddable
cd ${MODDABLE}/build/makefiles/${OS}
make

# install idf
cd $IDF_PATH
./install.sh
