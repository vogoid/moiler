import {render} from 'ink'
import fs from 'fs'
import readline from 'readline'
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
const moddableProcess = execa(
  `UPLOAD_PORT=/dev/cu.usbserial-01E05E73 \
   IDF_PATH=${idfPath} \
   MODDABLE=${moddablePath} \
   source ${idfPath}/export.sh \
   && cd ${moilerPath} \
   && ${moddablePath}/build/bin/${os}/release/mcconfig -d -m -p esp32`,
  {shell: true}
)

console.log('Setting up...')
readline.createInterface({ input: moddableProcess.stderr }).on('line', line => {
    if (line === 'Done! You can now compile ESP-IDF projects.') {
        console.log('Compiling...')
    }
    if (line === 'Uploading stub...') {
        console.log('Uploading...')
    }
    if (line === 'Hard resetting via RTS pin...') {
        console.log('Running...')
    }
    console.log(line)
})


