import {render} from 'ink'
import fs from 'fs'
import path from 'path'
import glob from 'glob'
import execa from 'execa'
import {platform} from 'process'

const os = platform === 'darwin' ? 'mac' : 'lin'
const projectPath = "./"
const moilerPath = path.dirname(__dirname)
const idfPath = moilerPath + '/deps/esp-idf'
const moddablePath = moilerPath + '/deps/moddable'

const manifestBase = require(moilerPath + '/manifest_base.json')

// generate temp manifest.json from manifest_base.json
const projectFiles = glob.sync(`{,!(node_modules)/**/}*.js`)
const projectFilesModules = projectFiles.reduce((acc, cur, i) => {
    const s = cur.replace(".js", '')
    acc['/' + s] = '../../' + s
    return acc
}, {})

const manifest = {
    ...manifestBase,
    modules: {
        ...manifestBase.modules,
        ...projectFilesModules
    }
}

console.log(JSON.stringify(manifest))

fs.writeFileSync(moilerPath + '/manifest.json', JSON.stringify(manifest));

// run mcconfig
execa(
  `source ${idfPath}/export.sh \
   && cd ${moilerPath} \
   && ${moddablePath}/build/bin/${os}/release/mcconfig -d -m -p esp32`,
  {shell: true}
).stdout.on('line', line => console.log('what'))

