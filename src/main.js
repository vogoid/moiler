import {render} from 'ink'
import fs from 'fs'
import readline from 'readline'
import path from 'path'
import execa from 'execa'
import {platform} from 'process'
import detectPort from './lib/detectPort'
import buildManifest from './lib/buildManifest'

const programBoard = () => {
    const projectPath = path.resolve('./')
    const moilerPath = path.resolve(__dirname+'/..')
    const buildPath = process.env.HOME + '/.moiler'
    const idfPath = buildPath + '/esp-idf'
    const moddablePath = buildPath + '/moddable'

    const os = platform === 'darwin' ? 'mac' : 'lin'
    const port = detectPort()

    if (!port) {
        throw new Error('Could not detect port.')
    }

    // generate temp manifest.json from manifest_base.json
    const baseManifest = require(moilerPath + '/manifest_base.json')
    const manifest = buildManifest(baseManifest, projectPath)
    fs.writeFileSync(buildPath + '/manifest.json', JSON.stringify(manifest));

    // run mcconfig
    const moddableProcess = execa(
    `UPLOAD_PORT=${port} \
    IDF_PATH=${idfPath} \
    MODDABLE=${moddablePath} \
    source ${idfPath}/export.sh \
    && cd ${buildPath} \
    && ${moddablePath}/build/bin/${os}/release/mcconfig -d -m -p esp32`,
    {shell: true}
    )

    console.log('Setting up...')
    readline.createInterface({ input: moddableProcess.stdout }).on('line', line => {
        if (line === 'Done! You can now compile ESP-IDF projects.') {
            console.log('Compiling...')
        }
        if (line === 'Uploading stub...') {
            console.log('Uploading...')
        }
        if (line === 'Hard resetting via RTS pin...') {
            console.log('Running...')
        }
        //console.log(line)
    })

    readline.createInterface({ input: moddableProcess.stderr }).on('line', line => {
        console.log(line)
    })
}

programBoard()