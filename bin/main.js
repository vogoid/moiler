#!/usr/bin/env node

// import {render} from 'ink'
// import fs from 'fs'

const fs = require('fs')
const path = require('path')
const glob = require('glob')
const execa = require('execa')

const projectPath = "."
const moilerPath = path.dirname(__dirname)
const idfPath = moilerPath + '/deps/esp-idf'
const moddablePath = moilerPath + '/deps/moddable'

const manifestBase = require(moilerPath + '/manifest_base.json')

// generate temp manifest.json from manifest_base.json
const projectFiles = glob.sync(`{${projectPath}/,!(node_modules)/**/}*.js`)
const projectFilesModules = projectFiles.reduce((acc, cur, i) => {
    const s = cur.replace(".js", '')
    acc[s] = '../.' + s
    return acc
}, {})

const manifest = {
    ...manifestBase,
    modules: {
        ...manifestBase.modules,
        ...projectFilesModules
    }
}

fs.writeFileSync(moilerPath + '/manifest.json', JSON.stringify(manifest));

// run mcconfig
execa(`source ${idfPath}/export.sh && cd ${moilerPath} && ${moilerPath}/deps/moddable/build/bin/mac/release/mcconfig -d -m -p esp32`)