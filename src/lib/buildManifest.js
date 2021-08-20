import glob from 'glob'

export default function buildManifest(baseManifest, projectPath) {
  const projectFiles = glob.sync(`{,!(node_modules)/**/}*.js`)
  const projectFilesModules = projectFiles.reduce((acc, cur, i) => {
    const s = cur.replace(".js", '')
    acc['/' + s] = projectPath + '/' + s
    return acc
  }, {})

  const manifest = {
    ...baseManifest,
    modules: {
      '*': [
        projectPath + '/main.js'
      ],
      ...projectFilesModules
    }
  }
  
  return manifest
}