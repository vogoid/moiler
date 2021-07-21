#!/bin/bash

PROJECT_PATH="$(dirname $0)/$(dirname "$(readlink "$0")")"/..

IDF_PATH=$PROJECT_PATH/deps/esp-idf
MODDABLE=$PROJECT_PATH/deps/moddable

# echo $(pwd)
source $IDF_PATH/export.sh

mcconfig -d -m -p esp32

