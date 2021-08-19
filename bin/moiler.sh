#!/bin/bash

MOILER="$(dirname $0)/$(dirname "$(readlink "$0")")"/..

node -r esm $MOILER/bin/main.js