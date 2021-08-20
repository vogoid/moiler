#!/bin/bash

MOILER="$(dirname $0)/$(dirname "$(readlink "$0")")"/..

node $MOILER/src/main.mjs