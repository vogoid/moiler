import { render } from 'ink'
import fs from 'fs'
import readline from 'readline'
import path from 'path'
import execa from 'execa'
import { platform } from 'process'
import detectPort from './lib/detectPort.mjs'
import buildManifest from './lib/buildManifest.mjs'

const programBoard = () => {
  const projectPath = path.resolve('./')
  const buildPath = process.env.HOME + '/.moiler'
  const idfPath = buildPath + '/esp-idf'
  const moddablePath = buildPath + '/moddable'

  const os = platform === 'darwin' ? 'mac' : 'lin'
  const port = detectPort()

  if (!port) {
    throw new Error('Could not detect port.')
  }

  // generate temp manifest.json from manifest_base.json
  const manifest = buildManifest(projectPath)
  fs.writeFileSync(buildPath + '/manifest.json', JSON.stringify(manifest))

  // run mcconfig
  const moddableProcess = execa(
    `UPLOAD_PORT=${port} \
    IDF_PATH=${idfPath} \
    MODDABLE=${moddablePath} \
    source ${idfPath}/export.sh \
    && cd ${buildPath} \
    && ${moddablePath}/build/bin/${os}/release/mcconfig -d -m -p esp32`,
    { shell: true }
  )

  console.log('Setting up...')
  readline
    .createInterface({ input: moddableProcess.stdout })
    .on('line', (line) => {
      switch (line) {
        case 'Done! You can now compile ESP-IDF projects.':
          return console.log('Compiling...')
        case 'Uploading stub...':
          return console.log('Uploading...')
        case 'Hard resetting via RTS pin...':
          return console.log('Running...')
        default:
          break
      }
      //console.log(line)
    })

  readline
    .createInterface({ input: moddableProcess.stderr })
    .on('line', (line) => {
      //console.log(line)
    })
}

programBoard()
