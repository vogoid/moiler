#!/bin/bash

unameOut="$(uname -s)"
case "${unameOut}" in
    Linux*)     OS=lin;;
    Darwin*)    OS=mac;;
    *)          OS="UNKNOWN"
esac

export MOILER="$(dirname $0)/$(dirname "$(readlink "$0")")"/..

export IDF_PATH=$MOILER/deps/esp-idf
export MODDABLE=$MOILER/deps/moddable

source $IDF_PATH/export.sh

./deps/moddable/build/bin/$OS/release/mcconfig $MOILER/manifest.json -d -m -p esp32

